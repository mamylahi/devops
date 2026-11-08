<?php

namespace Tests\Feature\Api;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_projects(): void
    {
        Project::factory()->count(3)->create();

        $this->getJson('/api/v1/projects')
             ->assertOk()
             ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_project(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/v1/projects', [
            'user_id'        => $user->id,
            'name'           => 'Projet Alpha',
            'status'         => 'active',
            'repository_url' => 'https://github.com/org/alpha',
        ]);

        $response->assertCreated()
                 ->assertJsonPath('data.name', 'Projet Alpha');
    }

    public function test_store_rejects_nonexistent_user(): void
    {
        $response = $this->postJson('/api/v1/projects', [
            'user_id' => 9999,
            'name'    => 'Projet Orphelin',
            'status'  => 'active',
        ]);

        $response->assertUnprocessable()
                 ->assertJsonPath('errors.user_id.0', 'L\'utilisateur spécifié n\'existe pas.');
    }

    public function test_can_show_project(): void
    {
        $project = Project::factory()->create();

        $this->getJson("/api/v1/projects/{$project->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $project->id);
    }

    public function test_can_update_project(): void
    {
        $project = Project::factory()->create();

        $this->putJson("/api/v1/projects/{$project->id}", ['status' => 'archived'])
             ->assertOk()
             ->assertJsonPath('data.status', 'archived');
    }

    public function test_can_delete_project(): void
    {
        $project = Project::factory()->create();

        $this->deleteJson("/api/v1/projects/{$project->id}")
             ->assertOk();

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }
}
