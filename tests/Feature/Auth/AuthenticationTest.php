<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard.barista', absolute: false));
    }

    public function test_users_are_redirected_based_on_role_after_login(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $this->post('/login', ['email' => $owner->email, 'password' => 'password'])
            ->assertRedirect(route('dashboard.owner', absolute: false));
        $this->post('/logout');

        $supervisor = User::factory()->create(['role' => 'supervisor']);
        $this->post('/login', ['email' => $supervisor->email, 'password' => 'password'])
            ->assertRedirect(route('inventory.index', absolute: false));
    }

    public function test_barista_cannot_access_owner_dashboard(): void
    {
        $barista = User::factory()->create(['role' => 'barista']);

        $this->actingAs($barista)
            ->get('/dashboard/owner')
            ->assertStatus(403);
    }

    public function test_barista_can_access_waste_report_page(): void
    {
        $barista = User::factory()->create(['role' => 'barista']);

        $this->actingAs($barista)
            ->get(route('waste-logs.create'))
            ->assertStatus(200);
    }

    public function test_barista_can_access_stock_usage_page(): void
    {
        $barista = User::factory()->create(['role' => 'barista']);

        $this->actingAs($barista)
            ->get(route('stock-usages.index'))
            ->assertStatus(200);
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
