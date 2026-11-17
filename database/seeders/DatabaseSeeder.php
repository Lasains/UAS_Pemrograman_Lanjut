<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Menjalankan semua seeder dalam urutan yang benar.
     *
     * URUTAN WAJIB (karena foreign key dependency):
     * 1. Users             → tidak ada FK, jalan pertama
     * 2. Categories        → tidak ada FK, jalan kedua
     * 3. Ingredients       → FK ke categories → harus setelah CategorySeeder
     * 4. IngredientBatches → FK ke ingredients → harus setelah IngredientSeeder
     * 5. StockUsages       → FK ke batches DAN users → harus setelah keduanya
     * 6. WasteLogs         → FK ke batches DAN users → harus setelah keduanya
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            IngredientSeeder::class,
            IngredientBatchSeeder::class,
            StockUsageSeeder::class,
            WasteLogSeeder::class,
        ]);
    }
}
