<?php

namespace App\Services;

use App\Models\Pipeline;
use Illuminate\Pagination\LengthAwarePaginator;

class PipelineService
{
    /**
     * Retourne la liste paginée de tous les pipelines (avec leur projet).
     */
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Pipeline::with('project')->latest()->paginate($perPage);
    }

    /**
     * Retourne un pipeline par son identifiant.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function getById(int $id): Pipeline
    {
        return Pipeline::with(['project', 'deployments'])->findOrFail($id);
    }

    /**
     * Crée un nouveau pipeline.
     */
    public function create(array $data): Pipeline
    {
        return Pipeline::create($data);
    }

    /**
     * Met à jour un pipeline existant.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function update(int $id, array $data): Pipeline
    {
        $pipeline = Pipeline::findOrFail($id);
        $pipeline->update($data);

        return $pipeline->fresh(['project', 'deployments']);
    }

    /**
     * Supprime un pipeline.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function delete(int $id): void
    {
        $pipeline = Pipeline::findOrFail($id);
        $pipeline->delete();
    }
}
