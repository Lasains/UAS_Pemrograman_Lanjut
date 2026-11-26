<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IngredientBatchController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StockUsageController;
use App\Http\Controllers\WasteLogController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/inventory', [IngredientBatchController::class, 'index'])
        ->name('inventory.index');

    Route::get('/waste-logs', [WasteLogController::class, 'index'])
        ->name('waste-logs.index');

    Route::get('/stock-usages', [StockUsageController::class, 'index'])
        ->name('stock-usages.index');

    Route::get('/dashboard/barista', [DashboardController::class, 'barista'])
        ->name('dashboard.barista');

    Route::middleware(['role:barista,supervisor'])->group(function () {
        Route::post('/stock-usages', [StockUsageController::class, 'store'])
            ->name('stock-usages.store');

        Route::get('/batches/create', [IngredientBatchController::class, 'create'])
            ->name('batches.create');
        Route::post('/batches', [IngredientBatchController::class, 'store'])
            ->name('batches.store');

        Route::get('/waste-logs/create', [WasteLogController::class, 'create'])
            ->name('waste-logs.create');
        Route::post('/waste-logs', [WasteLogController::class, 'store'])
            ->name('waste-logs.store');
    });

    Route::middleware(['role:supervisor'])->group(function () {
        Route::resource('categories', CategoryController::class)->except(['show']);
        Route::resource('ingredients', IngredientController::class)->except(['show']);

        Route::get('/batches/{batch}/edit', [IngredientBatchController::class, 'edit'])
            ->name('batches.edit');
        Route::patch('/batches/{batch}', [IngredientBatchController::class, 'update'])
            ->name('batches.update');

        Route::patch('/waste-logs/{wasteLog}/approve', [WasteLogController::class, 'approve'])
            ->name('waste-logs.approve');
        Route::patch('/waste-logs/{wasteLog}/reject', [WasteLogController::class, 'reject'])
            ->name('waste-logs.reject');
    });

    Route::middleware(['role:owner'])->group(function () {
        Route::get('/dashboard/owner', [DashboardController::class, 'owner'])
            ->name('dashboard.owner');
        Route::get('/analytics', [DashboardController::class, 'analytics'])
            ->name('analytics.index');
        Route::get('/analytics/export', [DashboardController::class, 'export'])
            ->name('analytics.export');
    });
});

require __DIR__.'/auth.php';
