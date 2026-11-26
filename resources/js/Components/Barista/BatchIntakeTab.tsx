import { safeRoute } from '@/Components/Barista/FefoUsageTab';
import { Ingredient } from '@/types/inventory';
import { useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    PackagePlus,
    RefreshCw,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface BatchIntakeTabProps {
    ingredients: Ingredient[];
}

function generateBatchCode(): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BCH-${datePart}-${randomPart}`;
}

export default function BatchIntakeTab({ ingredients }: BatchIntakeTabProps) {
    const today = new Date().toISOString().split('T')[0];
    const [clientError, setClientError] = useState<string | null>(null);
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        ingredient_id: ingredients[0]?.id ?? 0,
        batch_code: generateBatchCode(),
        initial_stock: '',
        received_date: today,
        expiry_date: '',
        cost_per_unit: '',
    });

    const selectedIngredient = ingredients.find(
        (item) => item.id === Number(data.ingredient_id),
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setClientError(null);
        setLocalSuccess(null);

        if (!data.ingredient_id) {
            setClientError('Pilih bahan terlebih dahulu.');
            return;
        }
        if (!data.batch_code.trim()) {
            setClientError('Kode batch wajib diisi.');
            return;
        }
        if (Number(data.initial_stock) <= 0) {
            setClientError('Jumlah stok awal harus lebih besar dari 0.');
            return;
        }
        if (Number(data.cost_per_unit) <= 0) {
            setClientError('Harga modal per unit harus lebih besar dari 0.');
            return;
        }
        if (!data.expiry_date || data.expiry_date < data.received_date) {
            setClientError(
                'Tanggal kedaluwarsa harus sama atau lebih besar dari tanggal terima.',
            );
            return;
        }

        post(safeRoute('batches.store', '/batches'), {
            preserveScroll: true,
            onSuccess: () => {
                setLocalSuccess('Batch baru berhasil diterima ke inventaris.');
                reset('initial_stock', 'expiry_date', 'cost_per_unit');
                setData('batch_code', generateBatchCode());
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-surface-border bg-surface-container p-6"
        >
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
                <PackagePlus className="h-5 w-5 text-brand-primary" />
                <div>
                    <h2 className="text-base font-bold text-content-high">
                        Terima Batch Bahan Baru
                    </h2>
                    <p className="text-xs text-content-medium">
                        Catat kedatangan stok baru beserta tanggal kedaluwarsa untuk urutan FEFO.
                    </p>
                </div>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="batch_ingredient_id"
                        className="block text-xs font-semibold text-content-high"
                    >
                        Bahan Baku
                    </label>
                    <select
                        id="batch_ingredient_id"
                        value={data.ingredient_id}
                        onChange={(e) =>
                            setData('ingredient_id', Number(e.target.value))
                        }
                        className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                        required
                    >
                        {ingredients.map((ing) => (
                            <option key={ing.id} value={ing.id}>
                                {ing.name} ({ing.unit})
                            </option>
                        ))}
                    </select>
                    {errors.ingredient_id && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.ingredient_id}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="batch_code"
                        className="block text-xs font-semibold text-content-high"
                    >
                        Kode Batch
                    </label>
                    <div className="mt-1 flex gap-2">
                        <input
                            id="batch_code"
                            type="text"
                            value={data.batch_code}
                            onChange={(e) =>
                                setData('batch_code', e.target.value)
                            }
                            className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 font-mono text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                            required
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setData('batch_code', generateBatchCode())
                            }
                            title="Buat kode batch baru"
                            className="rounded-lg border border-surface-border bg-white px-2.5 text-content-medium hover:text-brand-primary"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>
                    {errors.batch_code && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.batch_code}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="initial_stock"
                        className="block text-xs font-semibold text-content-high"
                    >
                        Stok Awal ({selectedIngredient?.unit ?? 'unit'})
                    </label>
                    <input
                        id="initial_stock"
                        type="number"
                        min={1}
                        step="any"
                        value={data.initial_stock}
                        onChange={(e) =>
                            setData('initial_stock', e.target.value)
                        }
                        placeholder="Contoh: 5000"
                        className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                        required
                    />
                    {errors.initial_stock && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.initial_stock}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="cost_per_unit"
                        className="block text-xs font-semibold text-content-high"
                    >
                        Harga Modal per Unit (Rp)
                    </label>
                    <input
                        id="cost_per_unit"
                        type="number"
                        min={1}
                        step="any"
                        value={data.cost_per_unit}
                        onChange={(e) =>
                            setData('cost_per_unit', e.target.value)
                        }
                        placeholder="Contoh: 20"
                        className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                        required
                    />
                    {errors.cost_per_unit && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.cost_per_unit}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="received_date"
                        className="block text-xs font-semibold text-content-high"
                    >
                        Tanggal Terima
                    </label>
                    <input
                        id="received_date"
                        type="date"
                        value={data.received_date}
                        onChange={(e) =>
                            setData('received_date', e.target.value)
                        }
                        className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                        required
                    />
                    {errors.received_date && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.received_date}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="expiry_date"
                        className="block text-xs font-semibold text-content-high"
                    >
                        Tanggal Kedaluwarsa
                    </label>
                    <input
                        id="expiry_date"
                        type="date"
                        min={data.received_date}
                        value={data.expiry_date}
                        onChange={(e) => setData('expiry_date', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                        required
                    />
                    {errors.expiry_date && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.expiry_date}
                        </p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
                {processing ? 'Menyimpan Batch...' : 'Simpan Batch Baru'}
            </button>
        </form>
    );
}
