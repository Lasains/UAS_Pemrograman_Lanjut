<?php

namespace Database\Seeders;

use App\Models\IngredientBatch;
use App\Models\User;
use App\Models\WasteLog;
use Illuminate\Database\Seeder;

class WasteLogSeeder extends Seeder
{
    /**
     * Membuat 3 tiket pemusnahan untuk demo workflow approval.
     */
    public function run(): void
    {
        $barista    = User::where('email', 'barista@kafe.com')->first();
        $supervisor = User::where('email', 'supervisor@kafe.com')->first();

        $milkBatchA        = IngredientBatch::where('batch_code', 'MILK-A-KRITIS')->first();
        $croissantDisposed = IngredientBatch::where('batch_code', 'CROISSANT-B-DISPOSED')->first();
        $caramelBatchA     = IngredientBatch::where('batch_code', 'CARAMEL-A-WARNING')->first();

        // TIKET 1: STATUS PENDING
        WasteLog::firstOrCreate(
            [
                'ingredient_batch_id' => $milkBatchA->id,
                'reported_by'         => $barista->id,
                'reason'              => 'Susu berbau asam dan menggumpal saat dibuka',
            ],
            [
                'waste_quantity' => 2.00,
                'financial_loss' => null,
                'approved_by'    => null,
                'status'         => 'pending',
            ]
        );

        // TIKET 2: STATUS APPROVED
        $approvedLog = WasteLog::firstOrCreate(
            [
                'ingredient_batch_id' => $croissantDisposed->id,
                'reported_by'         => $barista->id,
                'reason'              => 'Croissant berjamur dan tidak layak dikonsumsi setelah melewati tanggal expired',
            ],
            [
                'waste_quantity' => 15.00,
                'status'         => 'approved',
            ]
        );

        // Kolom non-fillable diisi via assignment langsung
        if ($approvedLog->wasRecentlyCreated || $approvedLog->approved_by === null) {
            $approvedLog->approved_by    = $supervisor->id;
            $approvedLog->financial_loss = 15.00 * $croissantDisposed->cost_per_unit; // 15 × 14000 = 210000
            $approvedLog->save();
        }

        // TIKET 3: STATUS REJECTED
        WasteLog::firstOrCreate(
            [
                'ingredient_batch_id' => $caramelBatchA->id,
                'reported_by'         => $barista->id,
                'reason'              => 'Sirup terasa berbeda dari biasanya, kemungkinan kualitas menurun',
            ],
            [
                'waste_quantity' => 1.00,
                'financial_loss' => null,
                'approved_by'    => null,
                'status'         => 'rejected',
            ]
        );

        $this->command->info('✅ WasteLogSeeder: 3 tiket pemusnahan berhasil dibuat.');
    }
}

