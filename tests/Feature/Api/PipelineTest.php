<?php

namespace Tests\Feature\Api;

use App\Models\Pipeline;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PipelineTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_pipelines(): void
    {
        Pipeline::factory()->count(3)->create();

        $this->getJson('/api/v1/pipelines')
             ->assertOk()
             ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_pipeline(): void
    {
        $project = Project::factory()->create();

        $response = $this->postJson('/api/v1/pipelines', [
            'project_id' => $project->id,
            'name'       => 'CI Main',
            'branch'     => 'main',
            'status'     => 'idle',
        ]);

        $response->assertCreated()
                 ->assertJsonPath('data.name', 'CI Main');
    }

    public function test_store_rejects_nonexistent_project(): void
    {
        $response = $this->postJson('/api/v1/pipelines', [
            'project_id' => 9999,
            'name'       => 'Orphan',
            'branch'     => 'main',
            'status'     => 'idle',
        ]);

        $response->assertUnprocessable()
                 ->assertJsonPath('errors.project_id.0', 'Le projet spécifié n\'existe pas.');
    }

    public function test_can_show_pipeline(): void
    {
        $pipeline = Pipeline::factory()->create();

        $this->getJson("/api/v1/pipelines/{$pipeline->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $pipeline->id);
    }

    public function test_can_update_pipeline_status(): void
    {
        $pipeline = Pipeline::factory()->create(['status' => 'idle']);

        $this->putJson("/api/v1/pipelines/{$pipeline->id}", ['status' => 'running'])
             ->assertOk()
             ->assertJsonPath('data.status', 'running');
    }

    public function test_can_delete_pipeline(): void
    {
        $pipeline = Pipeline::factory()->create();

        $this->deleteJson("/api/v1/pipelines/{$pipeline->id}")
             ->assertOk();

        $this->assertDatabaseMissing('pipelines', ['id' => $pipeline->id]);
    }
}
