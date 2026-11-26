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
     * Tampilkan daftar semua batch dengan filter opsional.
     */
    public function index(Request $request): Response
    {
        $query = IngredientBatch::query()
            ->with(['ingredient.category']);

        // Filter: Berdasarkan Bahan
        if ($request->filled('ingredient_id')) {
            $query->where('ingredient_id', $request->integer('ingredient_id'));
        }

        // Filter: Berdasarkan Status Batch
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        // Filter: Berdasarkan Kategori Expiry (traffic light)
        if ($request->filled('expiry')) {
            $expiry = $request->string('expiry');
            $query = match ((string) $expiry) {
                'critical' => $query->where('status', 'active')
                                    ->criticalExpiry(3),
                'warning'  => $query->where('status', 'active')
                                    ->criticalExpiry(7)
                                    ->where('expiry_date', '>', Carbon::now()->addDays(3)),
                'safe'     => $query->where('status', 'active')
                                    ->where('expiry_date', '>', Carbon::now()->addDays(7)),
                default    => $query,
            };
        }

        // Filter: Pencarian Teks
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('batch_code', 'like', "%{$search}%")
                  ->orWhereHas('ingredient', fn($q) =>
                        $q->where('name', 'like', "%{$search}%")
                  );
            });
        }

        // Default Sort: FEFO untuk batch aktif
        $query->orderBy('expiry_date', 'asc')
              ->orderBy('created_at', 'desc');

        // Paginate & append accessor ke setiap batch
        $batches = $query->paginate(15)
            ->withQueryString();

        $batches->through(function (IngredientBatch $batch) {
            return $batch->append(['expiry_status', 'days_until_expiry', 'total_value']);
        });

        // Summary statistik
        $summary = [
            'total_active'   => IngredientBatch::where('status', 'active')->count(),
            'total_critical' => IngredientBatch::active()->criticalExpiry(3)->count(),
            'total_warning'  => IngredientBatch::active()
                                    ->criticalExpiry(7)
                                    ->where('expiry_date', '>', Carbon::now()->addDays(3))
                                    ->count(),
            'total_expired'  => IngredientBatch::where('status', 'expired')->count(),
        ];

        $ingredients = Ingredient::orderBy('name')->get(['id', 'name', 'unit']);
        $filters     = $request->only(['ingredient_id', 'status', 'expiry', 'search']);

        return Inertia::render('Batches/Index', compact('batches', 'ingredients', 'filters', 'summary'));
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

            return redirect()
                ->route('inventory.index')
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
