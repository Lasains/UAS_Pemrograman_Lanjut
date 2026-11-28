<?php

namespace App\Http\Controllers;

use App\Models\IngredientBatch;
use App\Models\WasteLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class WasteLogController extends Controller
{
    /**
     * Tampilkan halaman daftar & approval center laporan bahan rusak.
     */
    public function index(Request $request): Response
    {
        $statusFilter = $request->string('status')->toString();

        $query = WasteLog::with(['batch.ingredient.category', 'reporter', 'approver'])
            ->latest();

        if (in_array($statusFilter, ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $statusFilter);
        }

        $wasteLogs = $query->paginate(15)->withQueryString();

        $summary = [
            'pending_count'       => WasteLog::where('status', 'pending')->count(),
            'approved_count'      => WasteLog::where('status', 'approved')->count(),
            'rejected_count'      => WasteLog::where('status', 'rejected')->count(),
            'total_approved_loss' => (float) WasteLog::where('status', 'approved')->sum('financial_loss'),
        ];

        return Inertia::render('Waste/Index', [
            'wasteLogs' => $wasteLogs,
            'summary'   => $summary,
            'filters'   => ['status' => $statusFilter],
        ]);
    }

    /**
     * Tampilkan form pelaporan bahan rusak (write-off) untuk Barista & Supervisor.
     */
    public function create(Request $request): Response
    {
        $batches = IngredientBatch::active()
            ->fefoOrder()
            ->with('ingredient.category')
            ->get()
            ->map(function (IngredientBatch $batch) {
                return $batch->append(['expiry_status', 'urgency_status', 'days_until_expiry']);
            });

        $recentReports = WasteLog::with(['batch.ingredient', 'reporter', 'approver'])
            ->when($request->user()->isBarista(), function ($q) use ($request) {
                $q->where('reported_by', $request->user()->id);
            })
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Waste/Create', [
            'batches'       => $batches,
            'recentReports' => $recentReports,
        ]);
    }

    /**
     * Simpan laporan bahan rusak baru dengan status pending.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ingredient_batch_id' => ['required', 'integer', Rule::exists('ingredient_batches', 'id')],
            'waste_quantity'      => ['required', 'numeric', 'min:0.01'],
            'reason'              => ['required', 'string', 'max:500'],
        ], [
            'ingredient_batch_id.required' => 'Batch bahan wajib dipilih.',
            'waste_quantity.required'      => 'Jumlah bahan rusak wajib diisi.',
            'waste_quantity.min'           => 'Jumlah bahan rusak minimal 0.01.',
            'reason.required'              => 'Alasan kerusakan wajib diisi.',
        ]);

        $batch = IngredientBatch::findOrFail($validated['ingredient_batch_id']);

        if ($batch->status !== 'active' || (float) $validated['waste_quantity'] > (float) $batch->current_stock) {
            throw ValidationException::withMessages([
                'waste_quantity' => "Jumlah rusak melebihi stok aktif batch {$batch->batch_code} (tersedia: {$batch->current_stock}).",
            ]);
        }

        $wasteLog = new WasteLog([
            'ingredient_batch_id' => $batch->id,
            'reported_by'         => $request->user()->id,
            'waste_quantity'      => $validated['waste_quantity'],
            'reason'              => trim($validated['reason']),
            'status'              => 'pending',
        ]);
        $wasteLog->financial_loss = (float) $validated['waste_quantity'] * (float) $batch->cost_per_unit;
        $wasteLog->save();

        return redirect()
            ->route('waste-logs.create')
            ->with('success', 'Laporan bahan rusak berhasil dikirim dan menunggu persetujuan Supervisor.');
    }

    /**
     * Setujui laporan waste: potong stok batch menjadi 0 & catat kerugian finansial.
     */
    public function approve(Request $request, WasteLog $wasteLog): RedirectResponse
    {
        $processed = DB::transaction(function () use ($request, $wasteLog) {
            $lockedLog = WasteLog::lockForUpdate()->findOrFail($wasteLog->id);

            if ($lockedLog->status !== 'pending') {
                return false;
            }

            $batch = IngredientBatch::lockForUpdate()->findOrFail($lockedLog->ingredient_batch_id);
            $financialLoss = (float) $lockedLog->waste_quantity * (float) $batch->cost_per_unit;

            $lockedLog->approved_by = $request->user()->id;
            $lockedLog->financial_loss = $financialLoss;
            $lockedLog->status = 'approved';
            $lockedLog->save();

            $batch->update([
                'current_stock' => 0,
                'status'        => 'disposed',
            ]);

            return true;
        });

        if (! $processed) {
            return redirect()
                ->back()
                ->with('warning', 'Laporan waste ini sudah diproses sebelumnya.');
        }

        return redirect()
            ->back()
            ->with('success', 'Laporan waste disetujui. Stok batch dipotong menjadi 0 dan kerugian finansial dicatat.');
    }

    /**
     * Tolak laporan waste tanpa memotong stok batch.
     */
    public function reject(Request $request, WasteLog $wasteLog): RedirectResponse
    {
        if ($wasteLog->status !== 'pending') {
            return redirect()
                ->back()
                ->with('warning', 'Laporan waste ini sudah diproses sebelumnya.');
        }

        $wasteLog->approved_by = $request->user()->id;
        $wasteLog->status = 'rejected';
        $wasteLog->save();

        return redirect()
            ->back()
            ->with('success', 'Laporan waste ditolak. Stok batch tetap aktif.');
    }
}
