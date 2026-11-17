<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\IngredientBatch;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class IngredientBatchSeeder extends Seeder
{
    /**
     * Membuat 10 batch bahan baku dengan variasi status expiry.
     */
    public function run(): void
    {
        $milkId      = Ingredient::where('name', 'Fresh Milk Diamond 1L')->value('id');
        $beansId     = Ingredient::where('name', 'Espresso Beans Arabica 1kg')->value('id');
        $caramelId   = Ingredient::where('name', 'Caramel Syrup Monin 1L')->value('id');
        $vanillaId   = Ingredient::where('name', 'Vanilla Latte Syrup 750ml')->value('id');
        $uhtId       = Ingredient::where('name', 'UHT Full Cream 1L')->value('id');
        $croissantId = Ingredient::where('name', 'Croissant Frozen')->value('id');

        $batches = [
            // MILK-A-KRITIS
            [
                'ingredient_id' => $milkId,
                'batch_code'    => 'MILK-A-KRITIS',
                'initial_stock' => 12.00,
                'current_stock' => 3.00,
                'received_date' => Carbon::now()->subDays(28)->toDateString(),
                'expiry_date'   => Carbon::now()->addDays(2)->toDateString(),   // 🔴 < 3 hari
                'cost_per_unit' => 18500.00,
                'status'        => 'active',
            ],
            // MILK-B-WARNING
            [
                'ingredient_id' => $milkId,
                'batch_code'    => 'MILK-B-WARNING',
                'initial_stock' => 24.00,
                'current_stock' => 8.00,
                'received_date' => Carbon::now()->subDays(20)->toDateString(),
                'expiry_date'   => Carbon::now()->addDays(5)->toDateString(),   // 🟡 3-7 hari
                'cost_per_unit' => 18500.00,
                'status'        => 'active',
            ],
            // MILK-C-AMAN
            [
                'ingredient_id' => $milkId,
                'batch_code'    => 'MILK-C-AMAN',
                'initial_stock' => 24.00,
                'current_stock' => 12.00,
                'received_date' => Carbon::now()->subDays(5)->toDateString(),
                'expiry_date'   => Carbon::now()->addDays(15)->toDateString(),  // 🟢 > 7 hari
                'cost_per_unit' => 18500.00,
                'status'        => 'active',
            ],
            // BEANS-A-AMAN
            [
                'ingredient_id' => $beansId,
                'batch_code'    => 'BEANS-A-AMAN',
                'initial_stock' => 10.00,
                'current_stock' => 5.00,
                'received_date' => Carbon::now()->subDays(10)->toDateString(),
                'expiry_date'   => Carbon::now()->addDays(30)->toDateString(),  // 🟢 > 7 hari
                'cost_per_unit' => 180000.00,
                'status'        => 'active',
            ],
            // CARAMEL-A-WARNING
            [
                'ingredient_id' => $caramelId,
                'batch_code'    => 'CARAMEL-A-WARNING',
                'initial_stock' => 6.00,
                'current_stock' => 2.00,
                'received_date' => Carbon::now()->subDays(25)->toDateString(),
                'expiry_date'   => Carbon::now()->addDays(4)->toDateString(),   // 🟡 3-7 hari
                'cost_per_unit' => 145000.00,
                'status'        => 'active',
            ],
            // CARAMEL-B-HABIS
            [
                'ingredient_id' => $caramelId,
                'batch_code'    => 'CARAMEL-B-HABIS',
                'initial_stock' => 6.00,
                'current_stock' => 0.00,
                'received_date' => Carbon::now()->subDays(60)->toDateString(),
                'expiry_date'   => Carbon::now()->addDays(90)->toDateString(),
                'cost_per_unit' => 140000.00,
                'status'        => 'exhausted',
            ],
            // VANILLA-A-AMAN
            [
                'ingredient_id' => $vanillaId,
                'batch_code'    => 'VANILLA-A-AMAN',
                'initial_stock' => 4.00,
                'current_stock' => 1.00,
                'received_date' => Carbon::now()->subDays(15)->toDateString(),
                'expiry_date'   => Carbon::now()->addDays(20)->toDateString(),  // 🟢 > 7 hari
                'cost_per_unit' => 125000.00,
                'status'        => 'active',
            ],
            // UHT-A-AMAN
            [
                'ingredient_id' => $uhtId,
                'batch_code'    => 'UHT-A-AMAN',
                'initial_stock' => 24.00,
                'current_stock' => 18.00,
                'received_date' => Carbon::now()->subDays(3)->toDateString(),
                'expiry_date'   => Carbon::now()->addDays(60)->toDateString(),  // 🟢 UHT tahan lama
                'cost_per_unit' => 22000.00,
                'status'        => 'active',
            ],
            // CROISSANT-A-EXPIRED
            [
                'ingredient_id' => $croissantId,
                'batch_code'    => 'CROISSANT-A-EXPIRED',
                'initial_stock' => 30.00,
                'current_stock' => 8.00,
                'received_date' => Carbon::now()->subDays(20)->toDateString(),
                'expiry_date'   => Carbon::now()->subDays(3)->toDateString(),   // 🔴 Sudah lewat 3 hari
                'cost_per_unit' => 15000.00,
                'status'        => 'expired',
            ],
            // CROISSANT-B-DISPOSED
            [
                'ingredient_id' => $croissantId,
                'batch_code'    => 'CROISSANT-B-DISPOSED',
                'initial_stock' => 30.00,
                'current_stock' => 0.00,
                'received_date' => Carbon::now()->subDays(45)->toDateString(),
                'expiry_date'   => Carbon::now()->subDays(15)->toDateString(),
                'cost_per_unit' => 14000.00,
                'status'        => 'disposed',
            ],
        ];

        foreach ($batches as $batch) {
            IngredientBatch::firstOrCreate(
                ['batch_code' => $batch['batch_code']],
                [
                    'ingredient_id' => $batch['ingredient_id'],
                    'initial_stock' => $batch['initial_stock'],
                    'current_stock' => $batch['current_stock'],
                    'received_date' => $batch['received_date'],
                    'expiry_date'   => $batch['expiry_date'],
                    'cost_per_unit' => $batch['cost_per_unit'],
                    'status'        => $batch['status'],
                ]
            );
        }

        $this->command->info('✅ IngredientBatchSeeder: 10 batch berhasil dibuat.');
    }
}

