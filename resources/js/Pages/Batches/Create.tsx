import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Ingredient } from '@/types/inventory';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle2, PackagePlus, RefreshCw } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Role } from '@/types/inventory';

interface BatchesCreateProps {
    ingredients: Ingredient[];
    defaultReceivedDate: string;
    suggestedBatchCode: string;
}

export default function BatchesCreate({
    ingredients = [],
    defaultReceivedDate,
    suggestedBatchCode,
}: BatchesCreateProps) {
    const userRole = (usePage().props.auth as { user?: { role?: Role } })?.user?.role;
    const canViewInventory = userRole === 'supervisor' || userRole === 'owner';
    const firstIngredient = ingredients[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        ingredient_id: firstIngredient ? String(firstIngredient.id) : '',
        batch_code: suggestedBatchCode || '',
        initial_stock: '',
        cost_per_unit: '',
        received_date: defaultReceivedDate || new Date().toISOString().slice(0, 10),
        expiry_date: '',
        notes: '',
    });

    const selectedIngredient = ingredients.find((i) => String(i.id) === String(data.ingredient_id));

    const diffDays =
        data.expiry_date && data.received_date
            ? Math.round(
                  (new Date(data.expiry_date).getTime() - new Date(data.received_date).getTime()) /
                      (1000 * 60 * 60 * 24),
              )
            : null;

    const estimatedTotalCost =
        Number(data.initial_stock || 0) * Number(data.cost_per_unit || 0);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('batches.store'), {
            onSuccess: () => reset('initial_stock', 'cost_per_unit', 'expiry_date', 'notes'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-content-high">
                        Penerimaan Batch Baru
                    </span>
                    <span className="rounded bg-brand-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        MULTI-BATCH
                    </span>
                </div>
            }
        >
            <Head title="Penerimaan Batch Baru - BeanFlow" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-brand-primary shadow-xs">
                            <PackagePlus className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-content-high">
                                Penerimaan Batch Baru
                            </h1>
                            <p className="text-sm text-content-medium mt-0.5">
                                Catat stok bahan masuk, kode batch, tanggal kedaluwarsa, dan harga beli per unit.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={canViewInventory ? route('inventory.index') : route('dashboard.barista')}
                        className="inline-flex items-center px-3.5 py-2 rounded-lg border border-surface-border bg-surface-container text-xs font-semibold text-content-high hover:bg-surface-container-high"
                    >
                        {canViewInventory ? 'Lihat Monitoring Inventaris' : 'Kembali ke Dasbor Barista'}
                    </Link>
                </div>

                {ingredients.length === 0 ? (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
                        Belum ada master bahan baku. Hubungi Supervisor untuk menambahkan bahan di menu Master Bahan &amp; Kategori terlebih dahulu.
                    </div>
                ) : (
                    <form
                        onSubmit={submit}
                        className="rounded-2xl bg-surface-container border border-surface-border p-6 shadow-xs space-y-5"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                    Bahan Baku *
                                </label>
                                <select
                                    value={data.ingredient_id}
                                    onChange={(e) => setData('ingredient_id', e.target.value)}
                                    className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                                >
                                    {ingredients.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} ({item.unit})
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.ingredient_id} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                    Kode Batch (Opsional)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={data.batch_code}
                                        onChange={(e) => setData('batch_code', e.target.value.toUpperCase())}
                                        placeholder="Kosongkan untuk auto-generate"
                                        className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm font-mono text-content-high focus:border-brand-primary focus:ring-brand-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setData('batch_code', suggestedBatchCode)}
                                        className="px-3 rounded-xl border border-surface-border bg-surface-container-high text-xs font-semibold text-content-high hover:bg-surface-border"
                                        title="Gunakan kode saran"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                                <InputError message={errors.batch_code} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                    Stok Awal ({selectedIngredient?.unit ?? 'unit'}) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={data.initial_stock}
                                    onChange={(e) => setData('initial_stock', e.target.value)}
                                    placeholder="Contoh: 5000"
                                    className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                                    required
                                />
                                <InputError message={errors.initial_stock} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                    Harga Beli per {selectedIngredient?.unit ?? 'unit'} (Rp) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.cost_per_unit}
                                    onChange={(e) => setData('cost_per_unit', e.target.value)}
                                    placeholder="Contoh: 24"
                                    className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                                    required
                                />
                                <InputError message={errors.cost_per_unit} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                    Tanggal Diterima *
                                </label>
                                <input
                                    type="date"
                                    value={data.received_date}
                                    onChange={(e) => setData('received_date', e.target.value)}
                                    className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                                    required
                                />
                                <InputError message={errors.received_date} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                    Tanggal Kedaluwarsa *
                                </label>
                                <input
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                    className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                                    required
                                />
                                <InputError message={errors.expiry_date} className="mt-1" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-content-medium mb-1.5">
                                Catatan (Opsional)
                            </label>
                            <textarea
                                rows={2}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Catatan supplier atau lokasi penyimpanan..."
                                className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2.5 text-sm text-content-high focus:border-brand-primary focus:ring-brand-primary"
                            />
                            <InputError message={errors.notes} className="mt-1" />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface-container-high px-4 py-3 text-xs">
                            <div className="flex items-center gap-2 text-content-medium">
                                <Calendar className="w-4 h-4 text-brand-primary" />
                                <span>
                                    Estimasi Umur Simpan:{' '}
                                    <strong className="text-content-high">
                                        {diffDays !== null ? `${diffDays} hari` : '-'}
                                    </strong>
                                </span>
                            </div>
                            <div className="text-content-medium">
                                Total Nilai Batch:{' '}
                                <strong className="text-content-high">
                                    Rp {estimatedTotalCost.toLocaleString('id-ID')}
                                </strong>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-primary/90 disabled:opacity-50"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Batch Masuk'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
