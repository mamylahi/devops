<?php

namespace App\Services;

use App\Models\Environment;
use Illuminate\Pagination\LengthAwarePaginator;

class EnvironmentService
{
    /**
     * Retourne la liste paginée de tous les environnements.
     */
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Environment::with('project')->latest()->paginate($perPage);
    }

    /**
     * Retourne un environnement par son identifiant.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function getById(int $id): Environment
    {
        return Environment::with(['project', 'deployments'])->findOrFail($id);
    }

    /**
     * Crée un nouvel environnement.
     */
    public function create(array $data): Environment
    {
        return Environment::create($data);
    }

    /**
     * Met à jour un environnement existant.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function update(int $id, array $data): Environment
    {
        $environment = Environment::findOrFail($id);
        $environment->update($data);

        return $environment->fresh(['project', 'deployments']);
    }

    /**
     * Supprime un environnement.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function delete(int $id): void
    {
        $environment = Environment::findOrFail($id);
        $environment->delete();
    }
}
