<?php

namespace App\Actions;

use App\Models\IngredientBatch;
use App\Models\StockUsage;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class DeductStockAction
{
    /**
     * Eksekusi pemotongan stok bahan dan pencatatan log pemakaian.
     *
     * @param IngredientBatch $batch Batch yang dikurangi stoknya
     * @param User $user Pengguna yang melakukan pencatatan
     * @param array{
     *     quantity_used: float|numeric,
     *     usage_date: string,
     *     is_fefo_compliant: bool,
     *     deviation_reason?: string|null,
     *     notes?: string|null
     * } $data Payload pemakaian
     * @return StockUsage
     * @throws Exception Jika stok tidak mencukupi saat lock update
     */
    public function execute(IngredientBatch $batch, User $user, array $data): StockUsage
    {
        return DB::transaction(function () use ($batch, $user, $data) {
            // Lock baris data batch untuk mencegah race condition (pembelian/pemakaian konkuren)
            /** @var IngredientBatch $lockedBatch */
            $lockedBatch = IngredientBatch::where('id', $batch->id)
                ->lockForUpdate()
                ->firstOrFail();

            $quantity = (float) $data['quantity_used'];
            $currentStock = (float) $lockedBatch->current_stock;

            // Validasi proteksi stok minus di tingkat database lock
            if ($quantity > $currentStock) {
                throw new Exception("Stok tidak mencukupi pada saat transaksi diproses. Tersedia: {$currentStock}, Diminta: {$quantity}");
            }

            // 1. Kurangi kuantitas stok saat ini
            $newStock = $currentStock - $quantity;
            $lockedBatch->current_stock = $newStock;

            // 2. Lifecycle check: Jika stok habis (0), otomatis tandai exhausted
            if ($newStock <= 0.0001) {
                $lockedBatch->current_stock = 0;
                $lockedBatch->status = 'exhausted';
            }

            $lockedBatch->save();

            // 3. Rekam jejak pemakaian ke tabel stock_usages
            return StockUsage::create([
                'ingredient_batch_id' => $lockedBatch->id,
                'user_id'             => $user->id,
                'quantity_used'       => $quantity,
                'usage_date'          => $data['usage_date'],
                'is_fefo_compliant'   => (bool) $data['is_fefo_compliant'],
                'deviation_reason'    => $data['deviation_reason'] ?? null,
                'notes'               => $data['notes'] ?? null,
            ]);
        });
    }
}
