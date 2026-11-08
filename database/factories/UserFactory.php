<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name'      => $this->faker->name(),
            'email'     => $this->faker->unique()->safeEmail(),
            'role'      => $this->faker->randomElement(['admin', 'developer', 'viewer']),
            'is_active' => $this->faker->boolean(80),
        ];
    }
}
