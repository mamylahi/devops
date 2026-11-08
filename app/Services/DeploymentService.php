<?php

namespace App\Services;

use App\Models\Deployment;
use Illuminate\Pagination\LengthAwarePaginator;

class DeploymentService
{
    /**
     * Retourne la liste paginée de tous les déploiements.
     */
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Deployment::with(['pipeline', 'environment'])->latest()->paginate($perPage);
    }

    /**
     * Retourne un déploiement par son identifiant.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function getById(int $id): Deployment
    {
        return Deployment::with(['pipeline.project', 'environment'])->findOrFail($id);
    }

    /**
     * Crée un nouveau déploiement.
     */
    public function create(array $data): Deployment
    {
        return Deployment::create($data);
    }

    /**
     * Met à jour un déploiement existant.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function update(int $id, array $data): Deployment
    {
        $deployment = Deployment::findOrFail($id);
        $deployment->update($data);

        return $deployment->fresh(['pipeline.project', 'environment']);
    }

    /**
     * Supprime un déploiement.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function delete(int $id): void
    {
        $deployment = Deployment::findOrFail($id);
        $deployment->delete();
    }
}
