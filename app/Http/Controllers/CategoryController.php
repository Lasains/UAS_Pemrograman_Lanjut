<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Redirect ke halaman Master Bahan & Kategori.
     */
    public function index(): RedirectResponse
    {
        return redirect()->route('ingredients.index');
    }

    /**
     * Simpan kategori bahan baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name'],
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.unique'   => 'Kategori dengan nama ini sudah ada.',
        ]);

        Category::create([
            'name' => trim($validated['name']),
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()
            ->route('ingredients.index')
            ->with('success', "Kategori \"{$validated['name']}\" berhasil ditambahkan.");
    }

    /**
     * Perbarui nama kategori yang sudah ada.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories', 'name')->ignore($category->id),
            ],
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.unique'   => 'Kategori dengan nama ini sudah ada.',
        ]);

        $category->update([
            'name' => trim($validated['name']),
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()
            ->route('ingredients.index')
            ->with('success', "Kategori berhasil diperbarui menjadi \"{$category->name}\".");
    }

    /**
     * Hapus kategori jika belum memiliki bahan baku terkait.
     */
    public function destroy(Category $category): RedirectResponse
    {
        if ($category->ingredients()->exists()) {
            return redirect()
                ->back()
                ->with('error', "Kategori \"{$category->name}\" tidak dapat dihapus karena masih digunakan oleh bahan baku.");
        }

        $name = $category->name;
        $category->delete();

        return redirect()
            ->route('ingredients.index')
            ->with('success', "Kategori \"{$name}\" berhasil dihapus.");
    }
}
