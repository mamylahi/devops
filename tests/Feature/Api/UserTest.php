<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    // ─── Index ────────────────────────────────────────────────────────────────

    public function test_can_list_users(): void
    {
        User::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/users');

        $response->assertOk()
                 ->assertJsonStructure([
                     'success',
                     'data',
                     'meta' => ['current_page', 'last_page', 'per_page', 'total'],
                 ]);
    }

    // ─── Store ────────────────────────────────────────────────────────────────

    public function test_can_create_user(): void
    {
        $payload = [
            'name'      => 'Alice Dupont',
            'email'     => 'alice@devops.io',
            'role'      => 'developer',
            'is_active' => true,
        ];

        $response = $this->postJson('/api/v1/users', $payload);

        $response->assertCreated()
                 ->assertJsonFragment(['email' => 'alice@devops.io']);
    }

    public function test_store_validates_required_fields(): void
    {
        $response = $this->postJson('/api/v1/users', []);

        $response->assertUnprocessable()
                 ->assertJsonStructure(['success', 'message', 'errors']);
    }

    public function test_store_rejects_invalid_role(): void
    {
        $response = $this->postJson('/api/v1/users', [
            'name'  => 'Bob',
            'email' => 'bob@devops.io',
            'role'  => 'superadmin', // invalide
        ]);

        $response->assertUnprocessable()
                 ->assertJsonPath('errors.role.0', 'Le rôle doit être : admin, developer ou viewer.');
    }

    public function test_store_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'dup@devops.io']);

        $response = $this->postJson('/api/v1/users', [
            'name'  => 'Dup',
            'email' => 'dup@devops.io',
            'role'  => 'developer',
        ]);

        $response->assertUnprocessable()
                 ->assertJsonPath('errors.email.0', 'Cette adresse email est déjà utilisée.');
    }

    // ─── Show ─────────────────────────────────────────────────────────────────

    public function test_can_show_user(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/v1/users/{$user->id}");

        $response->assertOk()
                 ->assertJsonPath('data.id', $user->id);
    }

    public function test_show_returns_404_for_unknown_user(): void
    {
        $response = $this->getJson('/api/v1/users/9999');

        $response->assertNotFound()
                 ->assertJsonFragment(['success' => false]);
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    public function test_can_update_user(): void
    {
        $user = User::factory()->create();

        $response = $this->putJson("/api/v1/users/{$user->id}", ['name' => 'Nouveau Nom']);

        $response->assertOk()
                 ->assertJsonPath('data.name', 'Nouveau Nom');
    }

    // ─── Destroy ──────────────────────────────────────────────────────────────

    public function test_can_delete_user(): void
    {
        $user = User::factory()->create();

        $response = $this->deleteJson("/api/v1/users/{$user->id}");

        $response->assertOk()
                 ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
