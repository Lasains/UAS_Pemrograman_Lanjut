<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Ingredient;
use App\Models\IngredientBatch;
use App\Models\User;
use App\Models\WasteLog;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WasteLogWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_barista_reports_waste_and_supervisor_approves_zeroing_stock(): void
    {
        $barista = User::factory()->create(['role' => 'barista']);
        $supervisor = User::factory()->create(['role' => 'supervisor']);

        $category = Category::create(['name' => 'Dairy', 'slug' => 'dairy']);
        $ingredient = Ingredient::create([
            'category_id'   => $category->id,
            'name'          => 'Oat Milk',
            'unit'          => 'ml',
            'minimum_stock' => 500,
            'warning_days'  => 7,
        ]);
        $batch = IngredientBatch::create([
            'ingredient_id' => $ingredient->id,
            'batch_code'    => 'BCH-WASTE-01',
            'initial_stock' => 1000,
            'current_stock' => 600,
            'received_date' => Carbon::today()->subDays(1),
            'expiry_date'   => Carbon::today()->addDays(3),
            'cost_per_unit' => 35,
            'status'        => 'active',
        ]);

        $this->actingAs($barista)->post(route('waste-logs.store'), [
            'ingredient_batch_id' => $batch->id,
            'waste_quantity'      => 600,
            'reason'              => 'Kemasan bocor',
        ])->assertRedirect(route('waste-logs.create'));

        $wasteLog = WasteLog::firstOrFail();
        $this->assertSame('pending', $wasteLog->status);

        // Barista tidak boleh approve
        $this->actingAs($barista)
            ->patch(route('waste-logs.approve', $wasteLog))
            ->assertForbidden();

        // Supervisor approve -> stok jadi 0, status disposed, financial_loss = 600 * 35 = 21000
        $this->actingAs($supervisor)
            ->patch(route('waste-logs.approve', $wasteLog))
            ->assertRedirect();

        $this->assertDatabaseHas('waste_logs', [
            'id'             => $wasteLog->id,
            'status'         => 'approved',
            'approved_by'    => $supervisor->id,
            'financial_loss' => 21000.00,
        ]);

        $this->assertDatabaseHas('ingredient_batches', [
            'id'            => $batch->id,
            'current_stock' => 0,
            'status'        => 'disposed',
        ]);
    }
}
