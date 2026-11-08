<?php

namespace Database\Factories;

use App\Models\Pipeline;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class PipelineFactory extends Factory
{
    protected $model = Pipeline::class;

    public function definition(): array
    {
        return [
            'project_id'    => Project::factory(),
            'name'          => 'Pipeline ' . $this->faker->word(),
            'branch'        => $this->faker->randomElement(['main', 'develop', 'staging']),
            'status'        => $this->faker->randomElement(['idle', 'running', 'success', 'failed']),
            'configuration' => null,
        ];
    }
}
