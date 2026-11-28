<?php

namespace App\Http\Controllers;

use App\Models\IngredientBatch;
use App\Models\StockUsage;
use App\Models\WasteLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardController extends Controller
{
    /**
     * Tampilkan halaman dasbor operasional untuk Barista.
     */
    public function barista(): Response
    {
        $activeBatches = IngredientBatch::active()
            ->fefoOrder()
            ->with('ingredient.category')
            ->get()
            ->map(fn (IngredientBatch $batch) => $batch->append(['expiry_status', 'urgency_status', 'days_until_expiry', 'total_value']));

        $healthItems = $activeBatches
            ->groupBy('ingredient_id')
            ->map(function ($batches) {
                $first = $batches->first();
                $totalStock = (float) $batches->sum('current_stock');

                return [
                    'id'            => $first->ingredient_id,
                    'name'          => $first->ingredient?->name ?? '-',
                    'category'      => $first->ingredient?->category?->name ?? 'Umum',
                    'unit'          => $first->ingredient?->unit ?? 'unit',
                    'total_stock'   => $totalStock,
                    'batch_count'   => $batches->count(),
                    'priorityBatch' => $first->batch_code,
                    'expiry_date'   => $first->expiry_date->toDateString(),
                    'days_until'    => $first->days_until_expiry,
                    'status'        => $first->expiry_status,
                ];
            })
            ->sortBy('days_until')
            ->values();

        $todayUsages = StockUsage::with(['batch.ingredient', 'user'])
            ->whereDate('usage_date', Carbon::today())
            ->latest('id')
            ->take(10)
            ->get();

        $stats = [
            'active_batches_count' => $activeBatches->count(),
            'critical_count'       => $activeBatches->where('expiry_status', 'critical')->count(),
            'warning_count'        => $activeBatches->where('expiry_status', 'warning')->count(),
            'today_usages_count'   => StockUsage::whereDate('usage_date', Carbon::today())->count(),
        ];

        return Inertia::render('Barista/Dashboard', [
            'healthItems' => $healthItems,
            'todayUsages' => $todayUsages,
            'stats'       => $stats,
        ]);
    }

    /**
     * Tampilkan halaman dasbor eksekutif untuk Owner.
     */
    public function owner(): Response
    {
        $activeBatches = IngredientBatch::active()
            ->with('ingredient.category')
            ->get()
            ->map(fn (IngredientBatch $batch) => $batch->append(['expiry_status', 'days_until_expiry', 'total_value']));

        $totalAssetValue = (float) $activeBatches->sum('total_value');
        $criticalAssetValue = (float) $activeBatches->where('expiry_status', 'critical')->sum('total_value');

        $monthlyWasteLoss = (float) WasteLog::where('status', 'approved')
            ->whereMonth('updated_at', Carbon::now()->month)
            ->whereYear('updated_at', Carbon::now()->year)
            ->sum('financial_loss');

        $metrics = [
            'total_asset_value'    => $totalAssetValue,
            'critical_asset_value' => $criticalAssetValue,
            'monthly_waste_loss'   => $monthlyWasteLoss,
            'active_batches_count' => $activeBatches->count(),
        ];

        $totalUsages = StockUsage::count();
        $compliantUsages = StockUsage::where('is_fefo_compliant', true)->count();
        $fefoComplianceRate = $totalUsages > 0 ? round(($compliantUsages / $totalUsages) * 100, 1) : 100.0;

        $assetByCategory = $activeBatches
            ->groupBy(fn (IngredientBatch $b) => $b->ingredient?->category?->name ?? 'Lainnya')
            ->map(fn ($group, $category) => [
                'category' => $category,
                'value'    => round((float) $group->sum('total_value'), 2),
                'batches'  => $group->count(),
            ])
            ->values();

        $expiryBreakdown = [
            ['status' => 'Aman (>7 Hari)', 'count' => $activeBatches->where('expiry_status', 'safe')->count()],
            ['status' => 'Warning (3-7 Hari)', 'count' => $activeBatches->where('expiry_status', 'warning')->count()],
            ['status' => 'Kritis (<3 Hari)', 'count' => $activeBatches->where('expiry_status', 'critical')->count()],
        ];

        return Inertia::render('Dashboard', [
            'metrics'            => $metrics,
            'fefoComplianceRate' => $fefoComplianceRate,
            'assetByCategory'    => $assetByCategory,
            'expiryBreakdown'    => $expiryBreakdown,
        ]);
    }

    /**
     * Tampilkan halaman analitik finansial & waste untuk Owner.
     */
    public function analytics(): Response
    {
        $approvedWastes = WasteLog::with(['batch.ingredient.category', 'reporter', 'approver'])
            ->where('status', 'approved')
            ->latest('updated_at')
            ->get();

        $totalWasteLoss = (float) $approvedWastes->sum('financial_loss');
        $pendingCount = WasteLog::where('status', 'pending')->count();

        $totalUsages = StockUsage::count();
        $compliantCount = StockUsage::where('is_fefo_compliant', true)->count();
        $deviationCount = $totalUsages - $compliantCount;

        $wasteByIngredient = $approvedWastes
            ->groupBy(fn (WasteLog $log) => $log->batch?->ingredient?->name ?? 'Tidak Diketahui')
            ->map(fn ($logs, $name) => [
                'name'          => $name,
                'total_loss'    => round((float) $logs->sum('financial_loss'), 2),
                'incidents'     => $logs->count(),
            ])
            ->sortByDesc('total_loss')
            ->values();

        return Inertia::render('Analytics/Index', [
            'totalWasteLoss'    => $totalWasteLoss,
            'pendingCount'      => $pendingCount,
            'totalUsages'       => $totalUsages,
            'compliantCount'    => $compliantCount,
            'deviationCount'    => $deviationCount,
            'wasteByIngredient' => $wasteByIngredient,
            'recentWastes'      => $approvedWastes->take(20)->values(),
        ]);
    }

    /**
     * Export laporan waste approved ke format CSV.
     */
    public function export(Request $request): StreamedResponse
    {
        $filename = 'laporan-waste-' . now()->format('Ymd-His') . '.csv';

        $logs = WasteLog::with(['batch.ingredient', 'reporter', 'approver'])
            ->where('status', 'approved')
            ->latest('updated_at')
            ->get();

        return response()->streamDownload(function () use ($logs) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Tanggal', 'Kode Batch', 'Bahan', 'Jumlah Rusak', 'Kerugian (Rp)', 'Alasan', 'Pelapor', 'Disetujui Oleh']);

            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->id,
                    $log->updated_at?->toDateTimeString(),
                    $log->batch?->batch_code ?? '-',
                    $log->batch?->ingredient?->name ?? '-',
                    $log->waste_quantity,
                    $log->financial_loss,
                    $log->reason,
                    $log->reporter?->name ?? '-',
                    $log->approver?->name ?? '-',
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
