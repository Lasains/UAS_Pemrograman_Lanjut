<?php

use App\Http\Controllers\IngredientBatchController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StockUsageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ─── Modul Inventaris & Batch Restock ───────────────────────────────────
    Route::get('/inventory', [IngredientBatchController::class, 'index'])->name('inventory.index');
    Route::resource('batches', IngredientBatchController::class);

    // ─── Modul Pemakaian Stok & Algoritma FEFO ─────────────────────────────
    Route::resource('stock-usages', StockUsageController::class)->only(['index', 'create', 'store', 'show']);
});

require __DIR__.'/auth.php';
