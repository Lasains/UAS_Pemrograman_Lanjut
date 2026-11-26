<?php

namespace App\Http\Controllers;

use App\Actions\DeductStockAction;
use App\Http\Requests\RecordUsageRequest;
use App\Models\Ingredient;
use App\Models\IngredientBatch;
use App\Models\StockUsage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StockUsageController extends Controller
{
    /**
     * Tampilkan riwayat pemakaian bahan baku (Auditing & Monitoring).
     *
     * FITUR:
     * - Filter berdasarkan bahan baku
     * - Filter berdasarkan kepatuhan FEFO (semua / patuh / deviasi)
     * - Paginasi 15 data per halaman
     */
    public function index(Request $request): Response
    {
        $query = StockUsage::query()
            ->with([
                'batch.ingredient',
                'user:id,name,role',
            ]);

        // Filter berdasarkan bahan
        if ($request->filled('ingredient_id')) {
            $query->whereHas('batch', function ($q) use ($request) {
                $q->where('ingredient_id', $request->integer('ingredient_id'));
            });
        }

        // Filter berdasarkan kepatuhan FEFO
        if ($request->filled('fefo_status')) {
            if ($request->string('fefo_status') === 'compliant') {
                $query->where('is_fefo_compliant', true);
            } elseif ($request->string('fefo_status') === 'deviated') {
                $query->where('is_fefo_compliant', false);
            }
        }

        // Filter tanggal
        if ($request->filled('start_date')) {
            $query->whereDate('usage_date', '>=', $request->date('start_date'));
        }
        if ($request->filled('end_date')) {
            $query->whereDate('usage_date', '<=', $request->date('end_date'));
        }

        $usages = $query->latest('usage_date')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('StockUsages/Index', [
            'usages'      => $usages,
            'ingredients' => Ingredient::orderBy('name')->get(['id', 'name', 'unit']),
            'filters'     => $request->only(['ingredient_id', 'fefo_status', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Tampilkan formulir pencatatan pemakaian harian.
     * Mengembalikan daftar batch aktif terurut FEFO beserta batch rekomendasi utama.
     */
    public function create(Request $request): Response
    {
        $ingredients = Ingredient::orderBy('name')->get(['id', 'name', 'unit', 'minimum_stock']);

        $selectedIngredientId = $request->integer('ingredient_id') ?: $ingredients->first()?->id;
        $activeBatches = collect();
        $recommendedBatch = null;

        if ($selectedIngredientId) {
            // EKSEKUSI KUERI INTI ALGORITMA FEFO
            $activeBatches = IngredientBatch::forIngredient($selectedIngredientId)
                ->active()
                ->fefoOrder()
                ->get()
                ->each->append(['days_until_expiry', 'expiry_status']);

            // Batch teratas otomatis menjadi batch rekomendasi prioritas utama
            $recommendedBatch = $activeBatches->first();
        }

        return Inertia::render('StockUsages/Create', [
            'ingredients'          => $ingredients,
            'selectedIngredientId' => $selectedIngredientId,
            'activeBatches'        => $activeBatches,
            'recommendedBatchId'   => $recommendedBatch?->id,
            'defaultUsageDate'     => now()->toDateString(),
        ]);
    }

    /**
     * Eksekusi transaksi pemakaian bahan baku dengan enkapsulasi aksi.
     */
    public function store(RecordUsageRequest $request, DeductStockAction $deductStock): RedirectResponse
    {
        $batch = IngredientBatch::findOrFail($request->integer('ingredient_batch_id'));
        $user = Auth::user();

        try {
            $deductStock->execute($batch, $user, $request->validated());

            $compliantMessage = $request->boolean('is_fefo_compliant')
                ? "Pemakaian berhasil dicatat sesuai rekomendasi FEFO."
                : "Pemakaian berhasil dicatat dengan catatan deviasi.";

            return redirect()
                ->route('stock-usages.index')
                ->with('success', "{$compliantMessage} Stok batch {$batch->batch_code} telah diperbarui.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Gagal memproses pemotongan stok: ' . $e->getMessage());
        }
    }

    /**
     * Tampilkan rincian riwayat satu transaksi pemakaian.
     */
    public function show(StockUsage $stockUsage): Response
    {
        $stockUsage->load([
            'batch.ingredient.category',
            'user:id,name,role',
        ]);

        return Inertia::render('StockUsages/Show', [
            'usage' => $stockUsage,
        ]);
    }
}
