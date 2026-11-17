<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Membuat 4 kategori bahan baku kafe.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Dairy Products',
                'slug' => 'dairy',
            ],
            [
                'name' => 'Coffee Beans',
                'slug' => 'beans',
            ],
            [
                'name' => 'Syrups & Flavoring',
                'slug' => 'syrups',
            ],
            [
                'name' => 'Bakery & Food',
                'slug' => 'bakery',
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                ['name' => $category['name']]
            );
        }

        $this->command->info('✅ CategorySeeder: 4 kategori berhasil dibuat.');
    }
}

