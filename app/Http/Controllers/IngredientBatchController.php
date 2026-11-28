<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBatchRequest;
use App\Http\Requests\UpdateBatchRequest;
use App\Models\Ingredient;
use App\Models\IngredientBatch;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class IngredientBatchController extends Controller
{
    /**
     * Tampilkan daftar semua bahan & batch aktif untuk monitoring inventaris.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        if ($request->user()?->role === 'barista') {
            return redirect()->route('dashboard.barista');
        }

        $ingredients = Ingredient::with('category')
            ->with(['batches' => function ($query) {
                $query->active()->fefoOrder();
            }])
            ->orderBy('name')
            ->get()
            ->map(function (Ingredient $ingredient) {
                $batches = $ingredient->batches->values()->map(function (IngredientBatch $batch, int $index) {
                    $batch->append(['expiry_status', 'urgency_status', 'days_until_expiry', 'total_value']);
                    $batch->setAttribute('is_fefo_recommended', $index === 0);

                    return $batch;
                });

                $ingredient->setRelation('batches', $batches);
                $ingredient->setAttribute('total_current_stock', (float) $batches->sum('current_stock'));

                return $ingredient;
            });

        $activeBatches = IngredientBatch::active()->get()
            ->map(fn (IngredientBatch $b) => $b->append(['expiry_status', 'total_value']));

        $summaryStats = [
            'totalItems'          => $ingredients->count(),
            'safeCount'           => $activeBatches->where('expiry_status', 'safe')->count(),
            'warningCount'        => $activeBatches->where('expiry_status', 'warning')->count(),
            'criticalCount'       => $activeBatches->where('expiry_status', 'critical')->count(),
            'estimatedLossRupiah' => (float) $activeBatches->where('expiry_status', 'critical')->sum('total_value'),
        ];

        $filters = $request->only(['ingredient_id', 'status', 'expiry', 'search']);

        return Inertia::render('Inventory/Index', compact('ingredients', 'summaryStats', 'filters'));
    }

    /**
     * Tampilkan form penerimaan batch baru.
     */
    public function create(): Response
    {
        return Inertia::render('Batches/Create', [
            'ingredients'        => Ingredient::orderBy('name')
                                        ->with('category')
                                        ->get(['id', 'name', 'unit', 'category_id']),
            'defaultReceivedDate'=> now()->toDateString(),
            'suggestedBatchCode' => $this->generateBatchCode(),
        ]);
    }

    /**
     * Proses dan simpan data batch baru dari form penerimaan.
     */
    public function store(StoreBatchRequest $request): RedirectResponse
    {
        $batchCode = $request->filled('batch_code')
            ? strtoupper(trim($request->input('batch_code')))
            : $this->generateBatchCode();

        try {
            DB::transaction(function () use ($request, $batchCode) {
                IngredientBatch::create([
                    'ingredient_id' => $request->integer('ingredient_id'),
                    'batch_code'    => $batchCode,
                    'initial_stock' => $request->input('initial_stock'),
                    'current_stock' => $request->input('initial_stock'), // Wajib sama saat pertama dibuat
                    'received_date' => $request->input('received_date'),
                    'expiry_date'   => $request->input('expiry_date'),
                    'cost_per_unit' => $request->input('cost_per_unit'),
                    'status'        => 'active',
                ]);
            });

            $redirectRoute = $request->user()?->role === 'barista'
                ? 'dashboard.barista'
                : 'inventory.index';

            return redirect()
                ->route($redirectRoute)
                ->with('success', "Batch {$batchCode} berhasil ditambahkan ke inventaris.");

        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Kode batch sudah digunakan. Sistem akan generate kode otomatis — kosongkan field kode batch dan coba lagi.');

        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Gagal menyimpan batch. Silakan coba lagi.');
        }
    }

    /**
     * Tampilkan halaman detail satu batch.
     */
    public function show(IngredientBatch $batch): Response
    {
        $batch->load([
            'ingredient.category',
            'stockUsages.user',
            'wasteLogs.reporter',
            'wasteLogs.approver',
        ]);

        $batch->append(['expiry_status', 'days_until_expiry', 'total_value']);

        $stockUsages = $batch->stockUsages()
                            ->with('user')
                            ->latest('usage_date')
                            ->take(10)
                            ->get();

        $wasteLogs = $batch->wasteLogs()
                            ->with(['reporter', 'approver'])
                            ->latest()
                            ->get();

        return Inertia::render('Batches/Show', compact('batch', 'stockUsages', 'wasteLogs'));
    }

    /**
     * Tampilkan form edit untuk koreksi data batch.
     */
    public function edit(IngredientBatch $batch): Response
    {
        $batch->load('ingredient.category');
        $batch->append(['expiry_status', 'days_until_expiry']);

        return Inertia::render('Batches/Edit', [
            'batch'       => $batch,
            'ingredients' => Ingredient::orderBy('name')
                                ->with('category')
                                ->get(['id', 'name', 'unit', 'category_id']),
        ]);
    }

    /**
     * Proses dan simpan koreksi data batch oleh supervisor.
     */
    public function update(UpdateBatchRequest $request, IngredientBatch $batch): RedirectResponse
    {
        try {
            DB::transaction(function () use ($request, $batch) {
                $batch->update($request->validated());
            });

            return redirect()
                ->route('inventory.index')
                ->with('success', "Data batch {$batch->batch_code} berhasil diperbarui.");

        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Gagal memperbarui data batch. Silakan coba lagi.');
        }
    }

    /**
     * "Hapus" batch dengan mengubah status menjadi 'disposed'.
     */
    public function destroy(IngredientBatch $batch): RedirectResponse
    {
        // Guard 1: Batch yang sudah ada riwayat pemakaian tidak bisa dihapus
        if ($batch->stockUsages()->exists()) {
            return redirect()
                ->back()
                ->with('error', "Batch {$batch->batch_code} tidak bisa dihapus karena sudah memiliki riwayat pemakaian. Untuk batch yang sudah tidak terpakai, ubah status lewat laporan pemusnahan.");
        }

        // Guard 2: Batch yang sudah berstatus disposed
        if ($batch->status === 'disposed') {
            return redirect()
                ->back()
                ->with('info', "Batch {$batch->batch_code} sudah berstatus disposed.");
        }

        $batch->update(['status' => 'disposed']);

        return redirect()
            ->route('inventory.index')
            ->with('success', "Batch {$batch->batch_code} telah diarsipkan (disposed).");
    }

    /**
     * Generate kode batch otomatis dengan format: BATCH-{YYYYMMDD}-{01..99}
     */
    private function generateBatchCode(): string
    {
        $datePrefix = 'BATCH-' . now()->format('Ymd') . '-';

        $lastBatch = IngredientBatch::where('batch_code', 'like', $datePrefix . '%')
            ->orderBy('batch_code', 'desc')
            ->value('batch_code');

        if ($lastBatch) {
            $lastSequence = (int) substr($lastBatch, -2);
            $nextSequence = $lastSequence + 1;

            if ($nextSequence > 99) {
                return $datePrefix . now()->format('His');
            }

            return $datePrefix . str_pad($nextSequence, 2, '0', STR_PAD_LEFT);
        }

        return $datePrefix . '01';
    }
}
