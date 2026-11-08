<?php

namespace Database\Factories;

use App\Models\Environment;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnvironmentFactory extends Factory
{
    protected $model = Environment::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'name'       => $this->faker->randomElement(['development', 'staging', 'production']),
            'url'        => $this->faker->url(),
            'status'     => $this->faker->randomElement(['active', 'inactive', 'deploying']),
            'variables'  => null,
        ];
    }
}
