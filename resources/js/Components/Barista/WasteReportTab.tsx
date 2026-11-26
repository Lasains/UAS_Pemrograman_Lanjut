import { safeRoute } from '@/Components/Barista/FefoUsageTab';
import { Ingredient, IngredientBatch } from '@/types/inventory';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Info, Trash2 } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

interface WasteReportTabProps {
    activeBatches: IngredientBatch[];
    ingredients: Ingredient[];
}

export default function WasteReportTab({
    activeBatches,
    ingredients,
}: WasteReportTabProps) {
    const [clientError, setClientError] = useState<string | null>(null);
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);

    const ingredientMap = useMemo(
        () => new Map(ingredients.map((item) => [item.id, item])),
        [ingredients],
    );

    const eligibleBatches = useMemo(
        () =>
            activeBatches.filter(
                (b) => b.status === 'active' && b.current_stock > 0,
            ),
        [activeBatches],
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        ingredient_batch_id: eligibleBatches[0]?.id ?? 0,
        waste_quantity: '',
        reason: '',
    });

    const selectedBatch = eligibleBatches.find(
        (b) => b.id === Number(data.ingredient_batch_id),
    );
    const selectedIngredient = selectedBatch
        ? selectedBatch.ingredient ??
          ingredientMap.get(selectedBatch.ingredient_id)
        : undefined;

    const estimatedLoss =
        selectedBatch && Number(data.waste_quantity) > 0
            ? Number(data.waste_quantity) * selectedBatch.cost_per_unit
            : 0;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setClientError(null);
        setLocalSuccess(null);

        if (!selectedBatch) {
            setClientError('Pilih batch bahan yang rusak.');
            return;
        }
        const qty = Number(data.waste_quantity);
        if (!qty || qty <= 0) {
            setClientError('Jumlah bahan rusak harus lebih besar dari 0.');
            return;
        }
        if (qty > selectedBatch.current_stock) {
            setClientError(
                `Jumlah waste melebihi sisa stok batch (${selectedBatch.current_stock}).`,
            );
            return;
        }
        if (!data.reason.trim()) {
            setClientError('Alasan kerusakan wajib diisi.');
            return;
        }

        post(safeRoute('waste-logs.store', '/waste-logs'), {
            preserveScroll: true,
            onSuccess: () => {
                setLocalSuccess(
                    'Laporan bahan rusak terkirim dengan status pending menunggu persetujuan Supervisor.',
                );
                reset('waste_quantity', 'reason');
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-surface-border bg-surface-container p-6"
        >
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
                <Trash2 className="h-5 w-5 text-brand-tertiary" />
                <div>
                    <h2 className="text-base font-bold text-content-high">
                        Lapor Bahan Rusak (Waste)
                    </h2>
                    <p className="text-xs text-content-medium">
                        Laporkan bahan basi, bocor, atau tumpah untuk ditinjau Supervisor.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] p-3.5 text-xs text-[#A1580A]">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                    Laporan yang dikirim berstatus <strong>pending</strong> dan{' '}
                    <strong>tidak menghapus data stok (tanpa hard delete)</strong>.
                    Stok baru dipotong setelah Supervisor menyetujui laporan.
                </span>
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
                <label
                    htmlFor="waste_batch_id"
                    className="block text-xs font-semibold text-content-high"
                >
                    Pilih Batch Bahan
                </label>
                <select
                    id="waste_batch_id"
                    value={data.ingredient_batch_id}
                    onChange={(e) =>
                        setData('ingredient_batch_id', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                    required
                >
                    {eligibleBatches.map((batch) => {
                        const ing =
                            batch.ingredient ??
                            ingredientMap.get(batch.ingredient_id);
                        return (
                            <option key={batch.id} value={batch.id}>
                                {batch.batch_code} — {ing?.name ?? 'Bahan'} (Sisa:{' '}
                                {batch.current_stock} {ing?.unit ?? ''})
                            </option>
                        );
                    })}
                </select>
                {errors.ingredient_batch_id && (
                    <p className="mt-1 text-xs text-red-600">
                        {errors.ingredient_batch_id}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="waste_quantity"
                    className="block text-xs font-semibold text-content-high"
                >
                    Jumlah Bahan Rusak ({selectedIngredient?.unit ?? 'unit'})
                </label>
                <input
                    id="waste_quantity"
                    type="number"
                    min={1}
                    max={selectedBatch?.current_stock}
                    step="any"
                    value={data.waste_quantity}
                    onChange={(e) => setData('waste_quantity', e.target.value)}
                    placeholder={
                        selectedBatch
                            ? `Maksimal ${selectedBatch.current_stock}`
                            : 'Masukkan jumlah'
                    }
                    className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                    required
                />
                {estimatedLoss > 0 && (
                    <p className="mt-1 text-xs text-content-medium">
                        Estimasi kerugian:{' '}
                        <strong className="font-mono text-brand-tertiary">
                            Rp {estimatedLoss.toLocaleString('id-ID')}
                        </strong>
                    </p>
                )}
                {errors.waste_quantity && (
                    <p className="mt-1 text-xs text-red-600">
                        {errors.waste_quantity}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="waste_reason"
                    className="block text-xs font-semibold text-content-high"
                >
                    Alasan Kerusakan
                </label>
                <textarea
                    id="waste_reason"
                    rows={3}
                    value={data.reason}
                    onChange={(e) => setData('reason', e.target.value)}
                    placeholder="Contoh: Susu menggumpal / kemasan bocor di chiller"
                    className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                    required
                />
                {errors.reason && (
                    <p className="mt-1 text-xs text-red-600">{errors.reason}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing || !selectedBatch}
                className="w-full rounded-xl bg-brand-tertiary px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-brand-tertiary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
                {processing ? 'Mengirim Laporan...' : 'Kirim Laporan Waste (Pending)'}
            </button>
        </form>
    );
}
