<?php

namespace Tests\Feature\Api;

use App\Models\Deployment;
use App\Models\Environment;
use App\Models\Pipeline;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeploymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_deployments(): void
    {
        Deployment::factory()->count(3)->create();

        $this->getJson('/api/v1/deployments')
             ->assertOk()
             ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_deployment(): void
    {
        $pipeline    = Pipeline::factory()->create();
        $environment = Environment::factory()->create();

        $response = $this->postJson('/api/v1/deployments', [
            'pipeline_id'    => $pipeline->id,
            'environment_id' => $environment->id,
            'status'         => 'pending',
            'commit_hash'    => 'abc123def456',
            'triggered_by'   => 'ci-bot',
        ]);

        $response->assertCreated()
                 ->assertJsonPath('data.status', 'pending');
    }

    public function test_store_rejects_invalid_status(): void
    {
        $pipeline    = Pipeline::factory()->create();
        $environment = Environment::factory()->create();

        $response = $this->postJson('/api/v1/deployments', [
            'pipeline_id'    => $pipeline->id,
            'environment_id' => $environment->id,
            'status'         => 'unknown', // invalide
        ]);

        $response->assertUnprocessable()
                 ->assertJsonPath('errors.status.0', 'Le statut doit être : pending, running, success, failed ou rolled_back.');
    }

    public function test_can_show_deployment(): void
    {
        $deployment = Deployment::factory()->create();

        $this->getJson("/api/v1/deployments/{$deployment->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $deployment->id);
    }

    public function test_can_update_deployment_status(): void
    {
        $deployment = Deployment::factory()->create(['status' => 'pending']);

        $this->putJson("/api/v1/deployments/{$deployment->id}", ['status' => 'success'])
             ->assertOk()
             ->assertJsonPath('data.status', 'success');
    }

    public function test_can_delete_deployment(): void
    {
        $deployment = Deployment::factory()->create();

        $this->deleteJson("/api/v1/deployments/{$deployment->id}")
             ->assertOk();

        $this->assertDatabaseMissing('deployments', ['id' => $deployment->id]);
    }
}
