import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Ingredient, IngredientBatch } from '@/types/inventory';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

interface BatchesEditProps {
    batch: IngredientBatch;
    ingredients: Ingredient[];
}

export default function BatchesEdit({ batch, ingredients = [] }: BatchesEditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        ingredient_id: String(batch.ingredient_id),
        batch_code: batch.batch_code,
        current_stock: String(batch.current_stock),
        cost_per_unit: String(batch.cost_per_unit),
        received_date: batch.received_date.slice(0, 10),
        expiry_date: batch.expiry_date.slice(0, 10),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('batches.update', batch.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <span className="text-lg font-bold tracking-tight text-content-high">
                    Koreksi Batch {batch.batch_code}
                </span>
            }
        >
            <Head title={`Edit Batch ${batch.batch_code} - BeanFlow`} />

            <div className="max-w-3xl mx-auto space-y-6">
                <Link
                    href={route('inventory.index')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-medium hover:text-content-high"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Monitoring Inventaris
                </Link>

                <form
                    onSubmit={submit}
                    className="rounded-2xl bg-surface-container border border-surface-border p-6 space-y-5"
                >
                    <h1 className="text-xl font-bold text-content-high">Koreksi Data Batch</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-content-medium mb-1">Bahan Baku</label>
                            <select
                                value={data.ingredient_id}
                                onChange={(e) => setData('ingredient_id', e.target.value)}
                                className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm"
                            >
                                {ingredients.map((ing) => (
                                    <option key={ing.id} value={ing.id}>
                                        {ing.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.ingredient_id} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-content-medium mb-1">Kode Batch</label>
                            <input
                                type="text"
                                value={data.batch_code}
                                onChange={(e) => setData('batch_code', e.target.value)}
                                className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm font-mono"
                            />
                            <InputError message={errors.batch_code} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-content-medium mb-1">Sisa Stok</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.current_stock}
                                onChange={(e) => setData('current_stock', e.target.value)}
                                className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm"
                            />
                            <InputError message={errors.current_stock} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-content-medium mb-1">Harga per Unit (Rp)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.cost_per_unit}
                                onChange={(e) => setData('cost_per_unit', e.target.value)}
                                className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm"
                            />
                            <InputError message={errors.cost_per_unit} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-content-medium mb-1">Tanggal Terima</label>
                            <input
                                type="date"
                                value={data.received_date}
                                onChange={(e) => setData('received_date', e.target.value)}
                                className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm"
                            />
                            <InputError message={errors.received_date} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-content-medium mb-1">Tanggal Kedaluwarsa</label>
                            <input
                                type="date"
                                value={data.expiry_date}
                                onChange={(e) => setData('expiry_date', e.target.value)}
                                className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm"
                            />
                            <InputError message={errors.expiry_date} className="mt-1" />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
