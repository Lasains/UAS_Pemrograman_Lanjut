<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Ingredient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MasterDataAndDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_supervisor_can_manage_categories_and_ingredients(): void
    {
        $supervisor = User::factory()->create(['role' => 'supervisor']);

        $this->actingAs($supervisor)
            ->post(route('categories.store'), ['name' => 'Syrup'])
            ->assertRedirect(route('ingredients.index'));

        $category = Category::where('slug', 'syrup')->firstOrFail();

        $this->actingAs($supervisor)
            ->post(route('ingredients.store'), [
                'category_id'   => $category->id,
                'name'          => 'Caramel Syrup',
                'unit'          => 'ml',
                'minimum_stock' => 500,
                'warning_days'  => 14,
            ])
            ->assertRedirect(route('ingredients.index'));

        $ingredient = Ingredient::where('name', 'Caramel Syrup')->firstOrFail();

        // Kategori yang masih dipakai tidak boleh dihapus
        $this->actingAs($supervisor)
            ->delete(route('categories.destroy', $category))
            ->assertSessionHas('error');

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
        $this->assertDatabaseHas('ingredients', ['id' => $ingredient->id]);
    }

    public function test_owner_can_access_dashboard_analytics_and_export_csv(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        $this->actingAs($owner)->get(route('dashboard.owner'))->assertOk();
        $this->actingAs($owner)->get(route('analytics.index'))->assertOk();
        $this->actingAs($owner)
            ->get(route('analytics.export'))
            ->assertOk()
            ->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }

    public function test_barista_is_redirected_from_inventory_while_supervisor_and_owner_can_access(): void
    {
        $barista = User::factory()->create(['role' => 'barista']);
        $supervisor = User::factory()->create(['role' => 'supervisor']);
        $owner = User::factory()->create(['role' => 'owner']);

        $this->actingAs($barista)
            ->get(route('inventory.index'))
            ->assertRedirect(route('dashboard.barista'));
        $this->actingAs($supervisor)->get(route('inventory.index'))->assertOk();
        $this->actingAs($owner)->get(route('inventory.index'))->assertOk();
    }
}
