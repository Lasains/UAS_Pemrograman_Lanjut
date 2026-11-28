import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category, Ingredient } from '@/types/inventory';
import { Head, router, useForm } from '@inertiajs/react';
import { Boxes, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface CategoryWithCount extends Category {
    ingredients_count?: number;
}

interface IngredientsIndexProps {
    ingredients: Ingredient[];
    categories: CategoryWithCount[];
}

export default function IngredientsIndex({
    ingredients = [],
    categories = [],
}: IngredientsIndexProps) {
    const categoryForm = useForm({ name: '' });
    const ingredientForm = useForm({
        category_id: categories[0] ? String(categories[0].id) : '',
        name: '',
        unit: 'ml',
        minimum_stock: '1000',
        warning_days: '7',
    });

    const submitCategory: FormEventHandler = (e) => {
        e.preventDefault();
        categoryForm.post(route('categories.store'), {
            onSuccess: () => categoryForm.reset('name'),
        });
    };

    const submitIngredient: FormEventHandler = (e) => {
        e.preventDefault();
        ingredientForm.post(route('ingredients.store'), {
            onSuccess: () => ingredientForm.reset('name'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <span className="text-lg font-bold tracking-tight text-content-high">
                    Master Bahan &amp; Kategori
                </span>
            }
        >
            <Head title="Master Bahan & Kategori - BeanFlow" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
                    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Boxes className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-content-high">Master Bahan Baku &amp; Kategori</h1>
                        <p className="text-sm text-content-medium">
                            Kelola daftar kategori serta master bahan baku beserta batas stok minimum dan hari peringatan.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 space-y-5">
                        <form
                            onSubmit={submitCategory}
                            className="rounded-2xl bg-surface-container border border-surface-border p-5 space-y-4"
                        >
                            <h2 className="text-sm font-bold text-content-high">Tambah Kategori Baru</h2>
                            <div>
                                <input
                                    type="text"
                                    value={categoryForm.data.name}
                                    onChange={(e) => categoryForm.setData('name', e.target.value)}
                                    placeholder="Contoh: Dairy, Syrup, Coffee Beans"
                                    className="w-full rounded-xl border border-surface-border bg-surface-base px-3.5 py-2 text-sm"
                                    required
                                />
                                <InputError message={categoryForm.errors.name} className="mt-1" />
                            </div>
                            <button
                                type="submit"
                                disabled={categoryForm.processing}
                                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
                            >
                                <Plus className="w-4 h-4" />
                                Simpan Kategori
                            </button>
                        </form>

                        <div className="rounded-2xl bg-surface-container border border-surface-border p-5 space-y-3">
                            <h2 className="text-sm font-bold text-content-high">Daftar Kategori ({categories.length})</h2>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="flex items-center justify-between rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-xs"
                                    >
                                        <div>
                                            <span className="font-semibold text-content-high">{cat.name}</span>
                                            <span className="ml-2 text-content-medium">
                                                ({cat.ingredients_count ?? 0} bahan)
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => router.delete(route('categories.destroy', cat.id))}
                                            className="text-rose-600 hover:text-rose-800"
                                            title="Hapus kategori"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-5">
                        <form
                            onSubmit={submitIngredient}
                            className="rounded-2xl bg-surface-container border border-surface-border p-5 space-y-4"
                        >
                            <h2 className="text-sm font-bold text-content-high">Tambah Master Bahan Baru</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-content-medium mb-1">Kategori *</label>
                                    <select
                                        value={ingredientForm.data.category_id}
                                        onChange={(e) => ingredientForm.setData('category_id', e.target.value)}
                                        className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="">Pilih kategori</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={ingredientForm.errors.category_id} className="mt-1" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-content-medium mb-1">Nama Bahan *</label>
                                    <input
                                        type="text"
                                        value={ingredientForm.data.name}
                                        onChange={(e) => ingredientForm.setData('name', e.target.value)}
                                        placeholder="Contoh: Fresh Milk Diamond 1L"
                                        className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm"
                                        required
                                    />
                                    <InputError message={ingredientForm.errors.name} className="mt-1" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-content-medium mb-1">Satuan *</label>
                                    <select
                                        value={ingredientForm.data.unit}
                                        onChange={(e) => ingredientForm.setData('unit', e.target.value)}
                                        className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm"
                                    >
                                        <option value="ml">ml</option>
                                        <option value="gram">gram</option>
                                        <option value="pcs">pcs</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-content-medium mb-1">Stok Min *</label>
                                        <input
                                            type="number"
                                            value={ingredientForm.data.minimum_stock}
                                            onChange={(e) => ingredientForm.setData('minimum_stock', e.target.value)}
                                            className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-content-medium mb-1">Warning (Hari) *</label>
                                        <input
                                            type="number"
                                            value={ingredientForm.data.warning_days}
                                            onChange={(e) => ingredientForm.setData('warning_days', e.target.value)}
                                            className="w-full rounded-xl border border-surface-border bg-surface-base px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={ingredientForm.processing}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Bahan
                            </button>
                        </form>

                        <div className="rounded-2xl bg-surface-container border border-surface-border overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-surface-container-high text-content-medium uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Nama Bahan</th>
                                        <th className="px-4 py-3">Kategori</th>
                                        <th className="px-4 py-3">Stok Aktif</th>
                                        <th className="px-4 py-3">Min / Warning</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-border">
                                    {ingredients.map((ing) => (
                                        <tr key={ing.id}>
                                            <td className="px-4 py-3 font-bold text-content-high">{ing.name}</td>
                                            <td className="px-4 py-3">{ing.category?.name ?? '-'}</td>
                                            <td className="px-4 py-3">
                                                {Number(ing.total_current_stock ?? 0).toLocaleString('id-ID')} {ing.unit}
                                            </td>
                                            <td className="px-4 py-3">
                                                {Number(ing.minimum_stock).toLocaleString('id-ID')} {ing.unit} / {ing.warning_days} hr
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => router.delete(route('ingredients.destroy', ing.id))}
                                                    className="text-rose-600 hover:text-rose-800"
                                                    title="Hapus bahan"
                                                >
                                                    <Trash2 className="w-4 h-4 inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
