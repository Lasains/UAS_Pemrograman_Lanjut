import Modal from '@/Components/Modal';
import { cn } from '@/lib/utils';
import {
    Ingredient,
    IngredientBatch,
    StockUsage,
    UrgencyStatus,
} from '@/types/inventory';
import { useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Flame,
    Star,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

interface FefoUsageTabProps {
    ingredients: Ingredient[];
    activeBatches: IngredientBatch[];
    recentUsages?: StockUsage[];
}

export function safeRoute(routeName: string, fallbackUrl: string): string {
    try {
        if (typeof route === 'function' && route().has(routeName)) {
            return route(routeName);
        }
    } catch {
        // Fallback jika Ziggy route belum tersedia
    }
    return fallbackUrl;
}

export function getBatchUrgency(batch: IngredientBatch): {
    daysUntilExpiry: number;
    status: UrgencyStatus;
} {
    let days = batch.days_until_expiry;
    if (typeof days !== 'number') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(batch.expiry_date);
        expiry.setHours(0, 0, 0, 0);
        days = Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000);
    }

    const status: UrgencyStatus =
        batch.urgency_status ??
        (days < 3 ? 'critical' : days <= 7 ? 'warning' : 'safe');

    return { daysUntilExpiry: days, status };
}

const URGENCY_META: Record<
    UrgencyStatus,
    { dot: string; badge: string; label: string }
> = {
    critical: {
        dot: 'bg-red-500',
        badge: 'border-[#F8C6BF] bg-[#FDF2F0] text-brand-tertiary',
        label: 'Kritis',
    },
    warning: {
        dot: 'bg-amber-500',
        badge: 'border-[#FED7AA] bg-[#FFF7ED] text-[#C88242]',
        label: 'Peringatan',
    },
    safe: {
        dot: 'bg-emerald-500',
        badge: 'border-emerald-300 bg-emerald-50 text-emerald-800',
        label: 'Aman',
    },
};

export default function FefoUsageTab({
    ingredients,
    activeBatches,
    recentUsages = [],
}: FefoUsageTabProps) {
    const [selectedIngredientId, setSelectedIngredientId] = useState<number>(
        ingredients[0]?.id ?? 0,
    );
    const [showDeviationModal, setShowDeviationModal] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);

    const ingredientMap = useMemo(
        () => new Map(ingredients.map((item) => [item.id, item])),
        [ingredients],
    );

    // Urutkan seluruh batch aktif secara kronologis FEFO (expiry_date terdekat di atas)
    const sortedBatches = useMemo(() => {
        return [...activeBatches]
            .filter((b) => b.status === 'active' && b.current_stock > 0)
            .sort(
                (a, b) =>
                    new Date(a.expiry_date).getTime() -
                    new Date(b.expiry_date).getTime(),
            );
    }, [activeBatches]);

    // Tentukan batch rekomendasi FEFO teratas untuk setiap ingredient_id
    const topFefoBatchByIngredient = useMemo(() => {
        const map = new Map<number, number>();
        for (const batch of sortedBatches) {
            if (!map.has(batch.ingredient_id)) {
                map.set(batch.ingredient_id, batch.id);
            }
        }
        return map;
    }, [sortedBatches]);

    const visibleBatches = useMemo(() => {
        if (!selectedIngredientId) return sortedBatches;
        return sortedBatches.filter(
            (b) => b.ingredient_id === selectedIngredientId,
        );
    }, [sortedBatches, selectedIngredientId]);

    const initialBatch = visibleBatches[0] ?? sortedBatches[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        ingredient_batch_id: initialBatch?.id ?? 0,
        quantity_used: '',
        notes: '',
        is_fefo_compliant: true,
        deviation_reason: '',
    });

    const selectedBatch = sortedBatches.find(
        (b) => b.id === Number(data.ingredient_batch_id),
    );
    const recommendedBatchId = selectedBatch
        ? topFefoBatchByIngredient.get(selectedBatch.ingredient_id)
        : undefined;
    const isTopFefo =
        !selectedBatch || selectedBatch.id === recommendedBatchId;

    const handleSelectBatch = (batch: IngredientBatch) => {
        const recommendedId = topFefoBatchByIngredient.get(batch.ingredient_id);
        const compliant = batch.id === recommendedId;
        setClientError(null);
        setLocalSuccess(null);
        setData((prev) => ({
            ...prev,
            ingredient_batch_id: batch.id,
            is_fefo_compliant: compliant,
            deviation_reason: compliant ? '' : prev.deviation_reason,
        }));
    };

    const submitUsage = () => {
        post(safeRoute('stock-usages.store', '/stock-usages'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeviationModal(false);
                setLocalSuccess('Pemakaian bahan berhasil dicatat.');
                reset('quantity_used', 'notes', 'deviation_reason');
            },
        });
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        setClientError(null);
        setLocalSuccess(null);

        if (!selectedBatch) {
            setClientError('Pilih batch bahan terlebih dahulu.');
            return;
        }

        const qty = Number(data.quantity_used);
        if (!qty || qty <= 0) {
            setClientError('Jumlah pemakaian harus lebih besar dari 0.');
            return;
        }
        if (qty > selectedBatch.current_stock) {
            setClientError(
                `Stok batch tidak cukup (maksimal ${selectedBatch.current_stock}).`,
            );
            return;
        }

        if (!isTopFefo) {
            setShowDeviationModal(true);
            return;
        }

        submitUsage();
    };

    const handleConfirmDeviation = (e: FormEvent) => {
        e.preventDefault();
        if (!data.deviation_reason.trim()) {
            setClientError('Alasan deviasi FEFO wajib diisi.');
            return;
        }
        setClientError(null);
        submitUsage();
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Kiri: Daftar Batch Terurut FEFO */}
                <div className="space-y-4 rounded-2xl border border-surface-border bg-surface-container p-5 lg:col-span-7">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
                        <div>
                            <h2 className="text-base font-bold text-content-high">
                                Daftar Batch Aktif (Urutan FEFO)
                            </h2>
                            <p className="text-xs text-content-medium">
                                Pilih batch prioritas terdekat untuk dipakai terlebih dahulu.
                            </p>
                        </div>
                        <select
                            aria-label="Filter bahan"
                            value={selectedIngredientId}
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                setSelectedIngredientId(id);
                                const first = sortedBatches.find(
                                    (b) => !id || b.ingredient_id === id,
                                );
                                if (first) handleSelectBatch(first);
                            }}
                            className="rounded-lg border border-surface-border bg-white px-3 py-1.5 text-xs font-medium text-content-high focus:border-brand-primary focus:ring-brand-primary"
                        >
                            <option value={0}>Semua Bahan</option>
                            {ingredients.map((ing) => (
                                <option key={ing.id} value={ing.id}>
                                    {ing.name} ({ing.unit})
                                </option>
                            ))}
                        </select>
                    </div>

                    {visibleBatches.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-surface-border bg-surface-canvas p-6 text-center text-xs text-content-medium">
                            Tidak ada batch aktif untuk bahan yang dipilih.
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {visibleBatches.map((batch) => {
                                const ing =
                                    batch.ingredient ??
                                    ingredientMap.get(batch.ingredient_id);
                                const { daysUntilExpiry, status } =
                                    getBatchUrgency(batch);
                                const meta = URGENCY_META[status];
                                const isRecommended =
                                    topFefoBatchByIngredient.get(
                                        batch.ingredient_id,
                                    ) === batch.id;
                                const isSelected =
                                    Number(data.ingredient_batch_id) ===
                                    batch.id;

                                return (
                                    <button
                                        key={batch.id}
                                        type="button"
                                        onClick={() => handleSelectBatch(batch)}
                                        className={cn(
                                            'flex w-full flex-col gap-2 rounded-xl border p-3.5 text-left transition-all sm:flex-row sm:items-center sm:justify-between',
                                            isSelected
                                                ? 'border-brand-primary bg-white ring-2 ring-brand-primary/20'
                                                : 'border-surface-border bg-surface-canvas hover:bg-white',
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-brand-primary">
                                                    {batch.batch_code}
                                                </span>
                                                {isRecommended && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-bold text-white">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        REKOMENDASI FEFO
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-content-high">
                                                {ing?.name ?? `Bahan #${batch.ingredient_id}`}
                                            </p>
                                            <p className="text-xs text-content-medium">
                                                Sisa:{' '}
                                                <strong className="font-mono text-content-high">
                                                    {batch.current_stock.toLocaleString('id-ID')}{' '}
                                                    {ing?.unit ?? ''}
                                                </strong>{' '}
                                                • Exp: {batch.expiry_date}
                                            </p>
                                        </div>

                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-1.5 self-start rounded-full border px-2.5 py-1 text-xs font-semibold sm:self-center',
                                                meta.badge,
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'h-2 w-2 rounded-full',
                                                    meta.dot,
                                                )}
                                            />
                                            {meta.label} (
                                            {daysUntilExpiry <= 0
                                                ? 'Expired'
                                                : `${daysUntilExpiry} hari`}
                                            )
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Kanan: Form Cepat Pemakaian Stok */}
                <form
                    onSubmit={handleFormSubmit}
                    className="space-y-4 rounded-2xl border border-surface-border bg-surface-container p-5 lg:col-span-5"
                >
                    <div className="flex items-center gap-2 border-b border-surface-border pb-3">
                        <Flame className="h-5 w-5 text-brand-primary" />
                        <h2 className="text-base font-bold text-content-high">
                            Catat Pemakaian Stok
                        </h2>
                    </div>

                    {localSuccess && (
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>{localSuccess}</span>
                        </div>
                    )}

                    {clientError && (
                        <div className="flex items-center gap-2 rounded-xl border border-[#F8C6BF] bg-[#FDF2F0] p-3 text-xs font-medium text-brand-tertiary">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span>{clientError}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-content-high">
                            Batch Dipilih
                        </label>
                        <div className="mt-1 rounded-lg border border-surface-border bg-white px-3 py-2 text-xs">
                            {selectedBatch ? (
                                <div className="flex items-center justify-between">
                                    <span className="font-mono font-bold text-brand-primary">
                                        {selectedBatch.batch_code}
                                    </span>
                                    <span className="text-content-medium">
                                        Sisa {selectedBatch.current_stock}{' '}
                                        {
                                            (
                                                selectedBatch.ingredient ??
                                                ingredientMap.get(
                                                    selectedBatch.ingredient_id,
                                                )
                                            )?.unit
                                        }
                                    </span>
                                </div>
                            ) : (
                                <span className="text-content-subtle">
                                    Belum ada batch dipilih
                                </span>
                            )}
                        </div>
                        {errors.ingredient_batch_id && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.ingredient_batch_id}
                            </p>
                        )}
                    </div>

                    {!isTopFefo && selectedBatch && (
                        <div className="flex items-start gap-2 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] p-3 text-xs text-[#A1580A]">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                                Batch ini <strong>bukan rekomendasi FEFO teratas</strong>. Anda akan diminta mengisi alasan deviasi saat menyimpan.
                            </span>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="quantity_used"
                            className="block text-xs font-semibold text-content-high"
                        >
                            Jumlah Pemakaian (
                            {selectedBatch
                                ? (
                                      selectedBatch.ingredient ??
                                      ingredientMap.get(
                                          selectedBatch.ingredient_id,
                                      )
                                  )?.unit ?? 'unit'
                                : 'unit'}
                            )
                        </label>
                        <input
                            id="quantity_used"
                            type="number"
                            min={1}
                            step="any"
                            value={data.quantity_used}
                            onChange={(e) =>
                                setData('quantity_used', e.target.value)
                            }
                            placeholder="Contoh: 250"
                            className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                            required
                        />
                        {errors.quantity_used && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.quantity_used}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="usage_notes"
                            className="block text-xs font-semibold text-content-high"
                        >
                            Catatan Menu / Shift (Opsional)
                        </label>
                        <input
                            id="usage_notes"
                            type="text"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Contoh: 2x Caffe Latte, isi hopper"
                            className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                        />
                        {errors.notes && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !selectedBatch}
                        className="w-full rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Pemakaian Stok'}
                    </button>
                </form>
            </div>

            {/* Ringkasan Pemakaian Terkini */}
            {recentUsages.length > 0 && (
                <div className="rounded-2xl border border-surface-border bg-surface-container p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-primary" />
                        <h3 className="text-sm font-bold text-content-high">
                            Pemakaian Terkini Shift
                        </h3>
                    </div>
                    <div className="divide-y divide-surface-border text-xs">
                        {recentUsages.slice(0, 5).map((usage) => (
                            <div
                                key={usage.id}
                                className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
                            >
                                <div>
                                    <span className="font-semibold text-content-high">
                                        {usage.batch?.ingredient?.name ??
                                            `Batch #${usage.ingredient_batch_id}`}
                                    </span>{' '}
                                    <span className="font-mono text-brand-primary">
                                        ({usage.batch?.batch_code ?? '-'})
                                    </span>
                                    {usage.notes && (
                                        <span className="text-content-subtle">
                                            {' '}
                                            — {usage.notes}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-content-high">
                                        {usage.quantity_used}{' '}
                                        {usage.batch?.ingredient?.unit ?? ''}
                                    </span>
                                    <span
                                        className={cn(
                                            'rounded-full px-2 py-0.5 text-[10px] font-bold',
                                            usage.is_fefo_compliant
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-[#FFF7ED] text-[#C88242]',
                                        )}
                                    >
                                        {usage.is_fefo_compliant
                                            ? 'Patuh FEFO'
                                            : 'Deviasi'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal Smart Warning Deviasi FEFO */}
            <Modal
                show={showDeviationModal}
                maxWidth="md"
                onClose={() => setShowDeviationModal(false)}
            >
                <form onSubmit={handleConfirmDeviation} className="space-y-4 p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#C88242]">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-content-high">
                                Peringatan Deviasi FEFO
                            </h3>
                            <p className="mt-1 text-xs text-content-medium">
                                Batch{' '}
                                <strong className="font-mono">
                                    {selectedBatch?.batch_code}
                                </strong>{' '}
                                bukan prioritas FEFO teratas. Mohon isi alasan deviasi agar tercatat pada audit shift.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="deviation_reason"
                            className="block text-xs font-semibold text-content-high"
                        >
                            Alasan Deviasi FEFO (Wajib)
                        </label>
                        <textarea
                            id="deviation_reason"
                            rows={3}
                            value={data.deviation_reason}
                            onChange={(e) =>
                                setData('deviation_reason', e.target.value)
                            }
                            placeholder="Contoh: Batch teratas sedang dicek supervisor / kemasan tertinggal di chiller belakang"
                            className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                            required
                        />
                        {(clientError || errors.deviation_reason) && (
                            <p className="mt-1 text-xs text-red-600">
                                {clientError ?? errors.deviation_reason}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowDeviationModal(false)}
                            className="rounded-lg border border-surface-border px-4 py-2 text-xs font-semibold text-content-medium hover:bg-surface-container"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-brand-secondary px-4 py-2 text-xs font-bold text-white hover:bg-brand-secondary-hover disabled:opacity-50"
                        >
                            {processing
                                ? 'Menyimpan...'
                                : 'Konfirmasi & Catat Deviasi'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
