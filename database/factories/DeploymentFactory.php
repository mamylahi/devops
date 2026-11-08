<?php

namespace Database\Factories;

use App\Models\Deployment;
use App\Models\Environment;
use App\Models\Pipeline;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeploymentFactory extends Factory
{
    protected $model = Deployment::class;

    public function definition(): array
    {
        return [
            'pipeline_id'    => Pipeline::factory(),
            'environment_id' => Environment::factory(),
            'status'         => $this->faker->randomElement(['pending', 'running', 'success', 'failed', 'rolled_back']),
            'commit_hash'    => $this->faker->sha1(),
            'triggered_by'   => $this->faker->userName(),
            'started_at'     => $this->faker->dateTimeBetween('-1 week', 'now'),
            'finished_at'    => null,
            'logs'           => null,
        ];
    }
}
