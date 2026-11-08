<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'user_id'        => User::factory(),
            'name'           => $this->faker->words(3, true),
            'description'    => $this->faker->sentence(),
            'status'         => $this->faker->randomElement(['active', 'archived', 'pending']),
            'repository_url' => 'https://github.com/org/' . $this->faker->slug(),
        ];
    }
}
