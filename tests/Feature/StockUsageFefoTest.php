<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Ingredient;
use App\Models\IngredientBatch;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockUsageFefoTest extends TestCase
{
    use RefreshDatabase;

    private function seedIngredientWithTwoBatches(): array
    {
        $category = Category::create(['name' => 'Dairy', 'slug' => 'dairy']);
        $ingredient = Ingredient::create([
            'category_id'   => $category->id,
            'name'          => 'Fresh Milk 1L',
            'unit'          => 'ml',
            'minimum_stock' => 1000,
            'warning_days'  => 7,
        ]);

        $olderBatch = IngredientBatch::create([
            'ingredient_id' => $ingredient->id,
            'batch_code'    => 'BCH-OLD-01',
            'initial_stock' => 1000,
            'current_stock' => 1000,
            'received_date' => Carbon::today()->subDays(2),
            'expiry_date'   => Carbon::today()->addDays(2),
            'cost_per_unit' => 20,
            'status'        => 'active',
        ]);

        $newerBatch = IngredientBatch::create([
            'ingredient_id' => $ingredient->id,
            'batch_code'    => 'BCH-NEW-02',
            'initial_stock' => 1000,
            'current_stock' => 1000,
            'received_date' => Carbon::today(),
            'expiry_date'   => Carbon::today()->addDays(14),
            'cost_per_unit' => 20,
            'status'        => 'active',
        ]);

        return [$olderBatch, $newerBatch];
    }

    public function test_barista_can_record_fefo_compliant_usage_and_exhaust_batch(): void
    {
        $barista = User::factory()->create(['role' => 'barista']);
        [$olderBatch] = $this->seedIngredientWithTwoBatches();

        $response = $this->actingAs($barista)->post(route('stock-usages.store'), [
            'ingredient_batch_id' => $olderBatch->id,
            'quantity_used'       => 1000,
            'notes'               => 'Latte shift pagi',
        ]);

        $response->assertRedirect(route('stock-usages.index'));
        $this->assertDatabaseHas('stock_usages', [
            'ingredient_batch_id' => $olderBatch->id,
            'is_fefo_compliant'   => true,
        ]);
        $this->assertDatabaseHas('ingredient_batches', [
            'id'            => $olderBatch->id,
            'current_stock' => 0,
            'status'        => 'exhausted',
        ]);
    }

    public function test_non_fefo_usage_requires_deviation_reason(): void
    {
        $barista = User::factory()->create(['role' => 'barista']);
        [, $newerBatch] = $this->seedIngredientWithTwoBatches();

        $response = $this->actingAs($barista)->post(route('stock-usages.store'), [
            'ingredient_batch_id' => $newerBatch->id,
            'quantity_used'       => 200,
        ]);

        $response->assertSessionHasErrors('deviation_reason');

        $okResponse = $this->actingAs($barista)->post(route('stock-usages.store'), [
            'ingredient_batch_id' => $newerBatch->id,
            'quantity_used'       => 200,
            'deviation_reason'    => 'Kemasan sudah terbuka di chiller bar',
        ]);

        $okResponse->assertRedirect(route('stock-usages.index'));
        $this->assertDatabaseHas('stock_usages', [
            'ingredient_batch_id' => $newerBatch->id,
            'is_fefo_compliant'   => false,
            'deviation_reason'    => 'Kemasan sudah terbuka di chiller bar',
        ]);
    }

    public function test_usage_fails_when_stock_is_insufficient(): void
    {
        $barista = User::factory()->create(['role' => 'barista']);
        [$olderBatch] = $this->seedIngredientWithTwoBatches();

        $response = $this->actingAs($barista)->post(route('stock-usages.store'), [
            'ingredient_batch_id' => $olderBatch->id,
            'quantity_used'       => 5000,
        ]);

        $response->assertSessionHasErrors('quantity_used');
    }
}
