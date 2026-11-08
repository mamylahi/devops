<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Pagination\LengthAwarePaginator;

class ProjectService
{
    /**
     * Retourne la liste paginée de tous les projets (avec leur propriétaire).
     */
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return Project::with('user')->latest()->paginate($perPage);
    }

    /**
     * Retourne un projet par son identifiant (avec ses relations).
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function getById(int $id): Project
    {
        return Project::with(['user', 'pipelines', 'environments'])->findOrFail($id);
    }

    /**
     * Crée un nouveau projet.
     */
    public function create(array $data): Project
    {
        return Project::create($data);
    }

    /**
     * Met à jour un projet existant.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function update(int $id, array $data): Project
    {
        $project = Project::findOrFail($id);
        $project->update($data);

        return $project->fresh(['user', 'pipelines', 'environments']);
    }

    /**
     * Supprime un projet.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function delete(int $id): void
    {
        $project = Project::findOrFail($id);
        $project->delete();
    }
}
