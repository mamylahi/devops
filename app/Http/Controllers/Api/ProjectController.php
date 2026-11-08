<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\ProjectCollection;
use App\Http\Resources\ProjectResource;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function __construct(private readonly ProjectService $projectService) {}

    /**
     * GET /api/projects
     */
    public function index(): JsonResponse
    {
        $projects = $this->projectService->getAll();

        return response()->json([
            'success' => true,
            'data'    => new ProjectCollection($projects),
            'meta'    => [
                'current_page' => $projects->currentPage(),
                'last_page'    => $projects->lastPage(),
                'per_page'     => $projects->perPage(),
                'total'        => $projects->total(),
            ],
        ]);
    }

    /**
     * POST /api/projects
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Projet créé avec succès.',
            'data'    => new ProjectResource($project),
        ], JsonResponse::HTTP_CREATED);
    }

    /**
     * GET /api/projects/{project}
     */
    public function show(int $project): JsonResponse
    {
        $projectModel = $this->projectService->getById($project);

        return response()->json([
            'success' => true,
            'data'    => new ProjectResource($projectModel),
        ]);
    }

    /**
     * PUT /api/projects/{project}
     */
    public function update(UpdateProjectRequest $request, int $project): JsonResponse
    {
        $projectModel = $this->projectService->update($project, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Projet mis à jour avec succès.',
            'data'    => new ProjectResource($projectModel),
        ]);
    }

    /**
     * DELETE /api/projects/{project}
     */
    public function destroy(int $project): JsonResponse
    {
        $this->projectService->delete($project);

        return response()->json([
            'success' => true,
            'message' => 'Projet supprimé avec succès.',
        ]);
    }
}
