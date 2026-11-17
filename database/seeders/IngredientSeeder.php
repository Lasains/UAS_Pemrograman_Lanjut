<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Ingredient;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    /**
     * Membuat 6 master data bahan baku kafe.
     */
    public function run(): void
    {
        $dairyId  = Category::where('slug', 'dairy')->value('id');
        $beansId  = Category::where('slug', 'beans')->value('id');
        $syrupsId = Category::where('slug', 'syrups')->value('id');
        $bakeryId = Category::where('slug', 'bakery')->value('id');

        $ingredients = [
            [
                'category_id'   => $dairyId,
                'name'          => 'Fresh Milk Diamond 1L',
                'unit'          => 'botol',
                'minimum_stock' => 5.00,
                'warning_days'  => 3,
            ],
            [
                'category_id'   => $dairyId,
                'name'          => 'UHT Full Cream 1L',
                'unit'          => 'karton',
                'minimum_stock' => 10.00,
                'warning_days'  => 3,
            ],
            [
                'category_id'   => $beansId,
                'name'          => 'Espresso Beans Arabica 1kg',
                'unit'          => 'kg',
                'minimum_stock' => 2.00,
                'warning_days'  => 7,
            ],
            [
                'category_id'   => $syrupsId,
                'name'          => 'Caramel Syrup Monin 1L',
                'unit'          => 'botol',
                'minimum_stock' => 3.00,
                'warning_days'  => 5,
            ],
            [
                'category_id'   => $syrupsId,
                'name'          => 'Vanilla Latte Syrup 750ml',
                'unit'          => 'botol',
                'minimum_stock' => 2.00,
                'warning_days'  => 5,
            ],
            [
                'category_id'   => $bakeryId,
                'name'          => 'Croissant Frozen',
                'unit'          => 'pcs',
                'minimum_stock' => 20.00,
                'warning_days'  => 2,
            ],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::firstOrCreate(
                [
                    'name'        => $ingredient['name'],
                    'category_id' => $ingredient['category_id'],
                ],
                [
                    'unit'          => $ingredient['unit'],
                    'minimum_stock' => $ingredient['minimum_stock'],
                    'warning_days'  => $ingredient['warning_days'],
                ]
            );
        }

        $this->command->info('✅ IngredientSeeder: 6 bahan baku berhasil dibuat.');
    }
}

