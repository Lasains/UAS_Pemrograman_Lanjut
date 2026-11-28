<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Ingredient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class IngredientController extends Controller
{
    /**
     * Tampilkan halaman Master Bahan & Kategori untuk Supervisor.
     */
    public function index(): Response
    {
        $ingredients = Ingredient::with('category')
            ->withSum(['batches as total_current_stock' => function ($query) {
                $query->where('status', 'active');
            }], 'current_stock')
            ->orderBy('name')
            ->get();

        $categories = Category::withCount('ingredients')
            ->orderBy('name')
            ->get();

        return Inertia::render('Ingredients/Index', [
            'ingredients' => $ingredients,
            'categories'  => $categories,
        ]);
    }

    /**
     * Redirect ke index karena form tambah tersedia di halaman utama.
     */
    public function create(): RedirectResponse
    {
        return redirect()->route('ingredients.index');
    }

    /**
     * Simpan bahan baku baru ke master data.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id'   => ['required', 'integer', Rule::exists('categories', 'id')],
            'name'          => ['required', 'string', 'max:150', 'unique:ingredients,name'],
            'unit'          => ['required', 'string', 'max:30'],
            'minimum_stock' => ['required', 'numeric', 'min:0'],
            'warning_days'  => ['required', 'integer', 'min:1', 'max:365'],
        ], [
            'category_id.required'   => 'Kategori wajib dipilih.',
            'name.required'          => 'Nama bahan wajib diisi.',
            'name.unique'            => 'Bahan dengan nama ini sudah terdaftar.',
            'unit.required'          => 'Satuan unit wajib diisi.',
            'minimum_stock.required' => 'Stok minimum wajib diisi.',
            'warning_days.required'  => 'Batas hari peringatan wajib diisi.',
        ]);

        Ingredient::create($validated);

        return redirect()
            ->route('ingredients.index')
            ->with('success', "Bahan \"{$validated['name']}\" berhasil ditambahkan.");
    }

    /**
     * Redirect ke index karena edit tersedia di halaman utama.
     */
    public function edit(Ingredient $ingredient): RedirectResponse
    {
        return redirect()->route('ingredients.index');
    }

    /**
     * Perbarui data master bahan baku.
     */
    public function update(Request $request, Ingredient $ingredient): RedirectResponse
    {
        $validated = $request->validate([
            'category_id'   => ['required', 'integer', Rule::exists('categories', 'id')],
            'name'          => ['required', 'string', 'max:150', Rule::unique('ingredients', 'name')->ignore($ingredient->id)],
            'unit'          => ['required', 'string', 'max:30'],
            'minimum_stock' => ['required', 'numeric', 'min:0'],
            'warning_days'  => ['required', 'integer', 'min:1', 'max:365'],
        ]);

        $ingredient->update($validated);

        return redirect()
            ->route('ingredients.index')
            ->with('success', "Bahan \"{$ingredient->name}\" berhasil diperbarui.");
    }

    /**
     * Hapus bahan baku jika belum memiliki riwayat batch.
     */
    public function destroy(Ingredient $ingredient): RedirectResponse
    {
        if ($ingredient->batches()->exists()) {
            return redirect()
                ->back()
                ->with('error', "Bahan \"{$ingredient->name}\" tidak dapat dihapus karena sudah memiliki riwayat batch.");
        }

        $name = $ingredient->name;
        $ingredient->delete();

        return redirect()
            ->route('ingredients.index')
            ->with('success', "Bahan \"{$name}\" berhasil dihapus.");
    }
}
