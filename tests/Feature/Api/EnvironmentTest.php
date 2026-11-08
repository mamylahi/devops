<?php

namespace Tests\Feature\Api;

use App\Models\Environment;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnvironmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_environments(): void
    {
        Environment::factory()->count(3)->create();

        $this->getJson('/api/v1/environments')
             ->assertOk()
             ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_environment(): void
    {
        $project = Project::factory()->create();

        $response = $this->postJson('/api/v1/environments', [
            'project_id' => $project->id,
            'name'       => 'production',
            'url'        => 'https://app.devops.io',
            'status'     => 'active',
        ]);

        $response->assertCreated()
                 ->assertJsonPath('data.name', 'production');
    }

    public function test_store_rejects_invalid_environment_name(): void
    {
        $project = Project::factory()->create();

        $response = $this->postJson('/api/v1/environments', [
            'project_id' => $project->id,
            'name'       => 'qa', // invalide
            'status'     => 'active',
        ]);

        $response->assertUnprocessable()
                 ->assertJsonPath('errors.name.0', 'L\'environnement doit être : development, staging ou production.');
    }

    public function test_can_show_environment(): void
    {
        $env = Environment::factory()->create();

        $this->getJson("/api/v1/environments/{$env->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $env->id);
    }

    public function test_can_update_environment(): void
    {
        $env = Environment::factory()->create(['status' => 'inactive']);

        $this->putJson("/api/v1/environments/{$env->id}", ['status' => 'active'])
             ->assertOk()
             ->assertJsonPath('data.status', 'active');
    }

    public function test_can_delete_environment(): void
    {
        $env = Environment::factory()->create();

        $this->deleteJson("/api/v1/environments/{$env->id}")
             ->assertOk();

        $this->assertDatabaseMissing('environments', ['id' => $env->id]);
    }
}
