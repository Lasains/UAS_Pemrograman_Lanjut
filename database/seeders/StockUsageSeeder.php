<?php

namespace Database\Seeders;

use App\Models\IngredientBatch;
use App\Models\StockUsage;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class StockUsageSeeder extends Seeder
{
    /**
     * Membuat 5 riwayat pemakaian bahan untuk demo.
     */
    public function run(): void
    {
        $barista    = User::where('email', 'barista@kafe.com')->first();
        $supervisor = User::where('email', 'supervisor@kafe.com')->first();

        $milkBatchA    = IngredientBatch::where('batch_code', 'MILK-A-KRITIS')->first();
        $milkBatchB    = IngredientBatch::where('batch_code', 'MILK-B-WARNING')->first();
        $milkBatchC    = IngredientBatch::where('batch_code', 'MILK-C-AMAN')->first();
        $beansBatchA   = IngredientBatch::where('batch_code', 'BEANS-A-AMAN')->first();
        $caramelBatchA = IngredientBatch::where('batch_code', 'CARAMEL-A-WARNING')->first();

        $usages = [
            // Skenario 1: FEFO Compliant
            [
                'ingredient_batch_id' => $milkBatchA->id,
                'user_id'             => $barista->id,
                'quantity_used'       => 2.00,
                'usage_date'          => Carbon::now()->subDays(2)->toDateString(),
                'is_fefo_compliant'   => true,
                'deviation_reason'    => null,
                'notes'               => 'Pemakaian untuk latte pagi — sesuai FEFO',
            ],
            // Skenario 2: Deviasi FEFO
            [
                'ingredient_batch_id' => $milkBatchC->id,
                'user_id'             => $barista->id,
                'quantity_used'       => 1.50,
                'usage_date'          => Carbon::now()->subDays(1)->toDateString(),
                'is_fefo_compliant'   => false,
                'deviation_reason'    => 'Batch MILK-B-WARNING sudah dibuka lebih dulu di bar kemarin dan harus diselesaikan terlebih dahulu untuk menghindari kontaminasi',
                'notes'               => null,
            ],
            // Skenario 3: Supervisor input
            [
                'ingredient_batch_id' => $milkBatchB->id,
                'user_id'             => $supervisor->id,
                'quantity_used'       => 3.00,
                'usage_date'          => Carbon::now()->subDays(3)->toDateString(),
                'is_fefo_compliant'   => true,
                'deviation_reason'    => null,
                'notes'               => 'Input oleh supervisor saat barista izin sakit',
            ],
            // Skenario 4: Biji Kopi
            [
                'ingredient_batch_id' => $beansBatchA->id,
                'user_id'             => $barista->id,
                'quantity_used'       => 0.50,
                'usage_date'          => Carbon::now()->subDays(1)->toDateString(),
                'is_fefo_compliant'   => true,
                'deviation_reason'    => null,
                'notes'               => 'Grind untuk espresso shot pagi — 0.5 kg',
            ],
            // Skenario 5: Sirup Caramel (today)
            [
                'ingredient_batch_id' => $caramelBatchA->id,
                'user_id'             => $barista->id,
                'quantity_used'       => 0.50,
                'usage_date'          => Carbon::now()->toDateString(),
                'is_fefo_compliant'   => true,
                'deviation_reason'    => null,
                'notes'               => 'Digunakan untuk 10 gelas caramel macchiato',
            ],
        ];

        foreach ($usages as $usage) {
            StockUsage::firstOrCreate(
                [
                    'ingredient_batch_id' => $usage['ingredient_batch_id'],
                    'user_id'             => $usage['user_id'],
                    'usage_date'          => $usage['usage_date'],
                    'quantity_used'       => $usage['quantity_used'],
                ],
                [
                    'is_fefo_compliant' => $usage['is_fefo_compliant'],
                    'deviation_reason'  => $usage['deviation_reason'],
                    'notes'             => $usage['notes'],
                ]
            );
        }

        $this->command->info('✅ StockUsageSeeder: 5 riwayat pemakaian berhasil dibuat.');
    }
}

