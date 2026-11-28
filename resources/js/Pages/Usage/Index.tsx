import ExpiryBadge from '@/Components/ExpiryBadge';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { Ingredient, IngredientBatch, StockUsage } from '@/types/inventory';
import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Flame, History, Sparkles } from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';

interface UsageIndexProps {
    ingredients: Ingredient[];
    recentUsages: StockUsage[];
}

export default function UsageIndex({ ingredients = [], recentUsages = [] }: UsageIndexProps) {
    const ingredientsWithStock = useMemo(
        () => ingredients.filter((i) => (i.batches?.length ?? 0) > 0),
        [ingredients],
    );

    const [selectedIngredientId, setSelectedIngredientId] = useState<number>(
        ingredientsWithStock[0]?.id ?? 0,
    );

    const selectedIngredient =
        ingredientsWithStock.find((i) => i.id === selectedIngredientId) ?? ingredientsWithStock[0];

    const batches: IngredientBatch[] = selectedIngredient?.batches ?? [];
    const topFefoBatch = batches[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        ingredient_batch_id: topFefoBatch ? String(topFefoBatch.id) : '',
        quantity_used: '',
        deviation_reason: '',
        notes: '',
    });

    const [showDeviationModal, setShowDeviationModal] = useState(false);

    const selectedBatch = batches.find((b) => String(b.id) === String(data.ingredient_batch_id)) ?? topFefoBatch;
    const isDeviating = Boolean(topFefoBatch && selectedBatch && selectedBatch.id !== topFefoBatch.id);

    const handleIngredientChange = (id: number) => {
        setSelectedIngredientId(id);
        const ing = ingredientsWithStock.find((i) => i.id === id);
        const firstBatch = ing?.batches?.[0];
        setData({
            ...data,
            ingredient_batch_id: firstBatch ? String(firstBatch.id) : '',
            deviation_reason: '',
        });
    };

    const handleBatchSelect = (batch: IngredientBatch) => {
        const deviating = Boolean(topFefoBatch && batch.id !== topFefoBatch.id);
        setData({
            ...data,
            ingredient_batch_id: String(batch.id),
            deviation_reason: deviating ? data.deviation_reason : '',
        });
        if (deviating) {
            setShowDeviationModal(true);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isDeviating && !data.deviation_reason.trim()) {
            setShowDeviationModal(true);
            return;
        }
        post(route('stock-usages.store'), {
            onSuccess: () => reset('quantity_used', 'deviation_reason', 'notes'),
        });
    };

    const confirmDeviationAndSubmit = () => {
        if (!data.deviation_reason.trim()) return;
        setShowDeviationModal(false);
        post(route('stock-usages.store'), {
            onSuccess: () => reset('quantity_used', 'deviation_reason', 'notes'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-content-high">
                        Catat Pemakaian Bahan FEFO
                    </span>
                    <span className="rounded bg-brand-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        SMART CHOICE
                    </span>
                </div>
            }
        >
            <Head title="Catat Pemakaian Bahan FEFO - BeanFlow" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-xs">
                            <Flame className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-content-high">
                                Catat Pemakaian Bahan (FEFO)
                            </h1>
                            <p className="text-sm text-content-medium mt-0.5">
                                Batch dengan tanggal kedaluwarsa terdekat otomatis direkomendasikan di urutan teratas.
                            </p>
                        </div>
                    </div>
                </div>

                {ingredientsWithStock.length === 0 ? (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
                        Belum ada batch aktif dengan stok tersedia. Tambahkan batch masuk terlebih dahulu di menu Penerimaan Batch.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <form
                            onSubmit={submit}
                            className="lg:col-span-7 rounded-2xl bg-surface-container border border-surface-border p-6 shadow-xs space-y-5"
                        >
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                    1. Pilih Bahan Baku
                                </label>
                                <select
                                    value={selectedIngredient?.id ?? ''}
                                    onChange={(e) => handleIngredientChange(Number(e.target.value))}
                                    className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                                >
                                    {ingredientsWithStock.map((ing) => (
                                        <option key={ing.id} value={ing.id}>
                                            {ing.name} — Total Stok: {Number(ing.total_current_stock ?? 0).toLocaleString('id-ID')} {ing.unit}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-2">
                                    2. Pilih Batch Fisik (Urutan FEFO)
                                </label>
                                <div className="space-y-2.5">
                                    {batches.map((batch, index) => {
                                        const isSelected = String(batch.id) === String(selectedBatch?.id);
                                        const isTop = index === 0;
                                        return (
                                            <button
                                                key={batch.id}
                                                type="button"
                                                onClick={() => handleBatchSelect(batch)}
                                                className={cn(
                                                    'w-full text-left rounded-xl border p-3.5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2',
                                                    isSelected
                                                        ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary'
                                                        : 'border-surface-border bg-surface-base hover:bg-surface-container-high',
                                                )}
                                            >
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-mono text-sm font-bold text-content-high">
                                                            {batch.batch_code}
                                                        </span>
                                                        {isTop && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                                                                <Sparkles className="w-3 h-3" />
                                                                ★ REKOMENDASI FEFO
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-content-medium mt-1">
                                                        Sisa Stok: <strong>{Number(batch.current_stock).toLocaleString('id-ID')} {selectedIngredient?.unit}</strong> • Exp: {batch.expiry_date.slice(0, 10)}
                                                    </p>
                                                </div>
                                                <ExpiryBadge
                                                    status={batch.urgency_status ?? batch.expiry_status ?? 'safe'}
                                                    daysLeft={batch.days_until_expiry ?? 0}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                                <InputError message={errors.ingredient_batch_id} className="mt-1" />
                            </div>

                            {isDeviating && (
                                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                        <span>Deviasi FEFO Terdeteksi</span>
                                    </div>
                                    <p className="text-xs text-amber-800">
                                        Anda memilih batch di luar rekomendasi FEFO teratas ({topFefoBatch?.batch_code}). Wajib isi alasan deviasi.
                                    </p>
                                    <input
                                        type="text"
                                        value={data.deviation_reason}
                                        onChange={(e) => setData('deviation_reason', e.target.value)}
                                        placeholder="Contoh: Kemasan batch baru sudah terbuka di bar"
                                        className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs text-content-high"
                                    />
                                    <InputError message={errors.deviation_reason} />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                        Jumlah Dipakai ({selectedIngredient?.unit}) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.quantity_used}
                                        onChange={(e) => setData('quantity_used', e.target.value)}
                                        placeholder="Contoh: 250"
                                        className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high"
                                        required
                                    />
                                    <InputError message={errors.quantity_used} className="mt-1" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                        Catatan Pemakaian (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Contoh: 2x Caffe Latte"
                                        className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high"
                                    />
                                    <InputError message={errors.notes} className="mt-1" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-primary/90 disabled:opacity-50"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {processing ? 'Menyimpan...' : 'Catat Pemakaian Stok'}
                                </button>
                            </div>
                        </form>

                        <div className="lg:col-span-5 rounded-2xl bg-surface-container border border-surface-border p-6 shadow-xs space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-content-high">
                                <History className="w-4 h-4 text-brand-primary" />
                                <span>Riwayat Pemakaian Terbaru</span>
                            </div>

                            {recentUsages.length === 0 ? (
                                <p className="text-xs text-content-medium">Belum ada catatan pemakaian stok.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentUsages.map((usage) => (
                                        <div
                                            key={usage.id}
                                            className="rounded-xl border border-surface-border bg-surface-base p-3 text-xs space-y-1"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-content-high">
                                                    {usage.batch?.ingredient?.name ?? '-'}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'px-2 py-0.5 rounded-full text-[10px] font-bold',
                                                        usage.is_fefo_compliant
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-amber-100 text-amber-800',
                                                    )}
                                                >
                                                    {usage.is_fefo_compliant ? 'Patuh FEFO' : 'Deviasi FEFO'}
                                                </span>
                                            </div>
                                            <p className="text-content-medium">
                                                {Number(usage.quantity_used).toLocaleString('id-ID')} {usage.batch?.ingredient?.unit ?? ''} • Batch{' '}
                                                <span className="font-mono">{usage.batch?.batch_code}</span> • oleh {usage.user?.name ?? '-'}
                                            </p>
                                            {usage.deviation_reason && (
                                                <p className="text-amber-800 italic">Alasan: {usage.deviation_reason}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Modal show={showDeviationModal} onClose={() => setShowDeviationModal(false)} maxWidth="md">
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2.5 text-amber-700">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="text-base font-bold">Peringatan Deviasi FEFO</h3>
                    </div>
                    <p className="text-sm text-content-medium">
                        Batch <strong>{selectedBatch?.batch_code}</strong> bukan prioritas FEFO teratas (
                        <strong>{topFefoBatch?.batch_code}</strong>). Masukkan alasan deviasi untuk melanjutkan.
                    </p>
                    <textarea
                        rows={3}
                        value={data.deviation_reason}
                        onChange={(e) => setData('deviation_reason', e.target.value)}
                        placeholder="Tuliskan alasan mengapa tidak memakai batch teratas..."
                        className="w-full rounded-xl border border-surface-border p-3 text-sm"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowDeviationModal(false)}
                            className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold"
                        >
                            Tutup
                        </button>
                        <button
                            type="button"
                            disabled={!data.deviation_reason.trim()}
                            onClick={confirmDeviationAndSubmit}
                            className="px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-semibold disabled:opacity-50"
                        >
                            Konfirmasi &amp; Simpan
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
