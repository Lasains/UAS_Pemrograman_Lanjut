<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\IngredientBatch;
use App\Models\StockUsage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StockUsageController extends Controller
{
    /**
     * Tampilkan halaman pencatatan pemakaian stok (FEFO) untuk Barista & Supervisor.
     */
    public function index(): Response
    {
        $ingredients = Ingredient::with('category')
            ->with(['batches' => function ($query) {
                $query->active()->fefoOrder();
            }])
            ->orderBy('name')
            ->get()
            ->map(function (Ingredient $ingredient) {
                $batches = $ingredient->batches->values()->map(function (IngredientBatch $batch, int $index) {
                    $batch->append(['expiry_status', 'urgency_status', 'days_until_expiry']);
                    $batch->setAttribute('is_fefo_recommended', $index === 0);

                    return $batch;
                });

                $ingredient->setRelation('batches', $batches);
                $ingredient->setAttribute('total_current_stock', (float) $batches->sum('current_stock'));

                return $ingredient;
            });

        $recentUsages = StockUsage::with(['batch.ingredient', 'user'])
            ->latest('usage_date')
            ->latest('id')
            ->take(15)
            ->get();

        return Inertia::render('Usage/Index', [
            'ingredients'  => $ingredients,
            'recentUsages' => $recentUsages,
        ]);
    }

    /**
     * Catat pemakaian stok dengan validasi FEFO dan pengurangan stok dalam transaksi.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ingredient_batch_id' => ['required', 'integer', Rule::exists('ingredient_batches', 'id')],
            'quantity_used'       => ['required', 'numeric', 'min:0.01'],
            'usage_date'          => ['nullable', 'date'],
            'deviation_reason'    => ['nullable', 'string', 'max:500'],
            'notes'               => ['nullable', 'string', 'max:500'],
        ], [
            'ingredient_batch_id.required' => 'Batch bahan wajib dipilih.',
            'quantity_used.required'       => 'Jumlah pemakaian wajib diisi.',
            'quantity_used.min'            => 'Jumlah pemakaian minimal 0.01.',
        ]);

        $usage = DB::transaction(function () use ($request, $validated) {
            $batch = IngredientBatch::lockForUpdate()->findOrFail($validated['ingredient_batch_id']);

            if ($batch->status !== 'active' || (float) $batch->current_stock < (float) $validated['quantity_used']) {
                throw ValidationException::withMessages([
                    'quantity_used' => "Stok batch {$batch->batch_code} tidak mencukupi (tersedia: {$batch->current_stock}).",
                ]);
            }

            $topFefoBatch = IngredientBatch::where('ingredient_id', $batch->ingredient_id)
                ->active()
                ->fefoOrder()
                ->first();

            $isFefoCompliant = $topFefoBatch && $topFefoBatch->id === $batch->id;

            if (! $isFefoCompliant && blank($validated['deviation_reason'] ?? null)) {
                throw ValidationException::withMessages([
                    'deviation_reason' => 'Alasan deviasi wajib diisi karena Anda tidak menggunakan batch rekomendasi FEFO teratas.',
                ]);
            }

            $newStock = max(0, (float) $batch->current_stock - (float) $validated['quantity_used']);
            $batch->current_stock = $newStock;
            if ($newStock <= 0) {
                $batch->status = 'exhausted';
            }
            $batch->save();

            return StockUsage::create([
                'ingredient_batch_id' => $batch->id,
                'user_id'             => $request->user()->id,
                'quantity_used'       => $validated['quantity_used'],
                'usage_date'          => $validated['usage_date'] ?? now()->toDateString(),
                'is_fefo_compliant'   => $isFefoCompliant,
                'deviation_reason'    => $isFefoCompliant ? null : trim((string) $validated['deviation_reason']),
                'notes'               => $validated['notes'] ?? null,
            ]);
        });

        $msg = $usage->is_fefo_compliant
            ? 'Pemakaian stok berhasil dicatat sesuai standar FEFO.'
            : 'Pemakaian stok berhasil dicatat dengan catatan deviasi FEFO.';

        return redirect()
            ->route('stock-usages.index')
            ->with('success', $msg);
    }
}
