<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Deployment\StoreDeploymentRequest;
use App\Http\Requests\Deployment\UpdateDeploymentRequest;
use App\Http\Resources\DeploymentCollection;
use App\Http\Resources\DeploymentResource;
use App\Services\DeploymentService;
use Illuminate\Http\JsonResponse;

class DeploymentController extends Controller
{
    public function __construct(private readonly DeploymentService $deploymentService) {}

    /**
     * GET /api/deployments
     */
    public function index(): JsonResponse
    {
        $deployments = $this->deploymentService->getAll();

        return response()->json([
            'success' => true,
            'data'    => new DeploymentCollection($deployments),
            'meta'    => [
                'current_page' => $deployments->currentPage(),
                'last_page'    => $deployments->lastPage(),
                'per_page'     => $deployments->perPage(),
                'total'        => $deployments->total(),
            ],
        ]);
    }

    /**
     * POST /api/deployments
     */
    public function store(StoreDeploymentRequest $request): JsonResponse
    {
        $deployment = $this->deploymentService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Déploiement créé avec succès.',
            'data'    => new DeploymentResource($deployment),
        ], JsonResponse::HTTP_CREATED);
    }

    /**
     * GET /api/deployments/{deployment}
     */
    public function show(int $deployment): JsonResponse
    {
        $deploymentModel = $this->deploymentService->getById($deployment);

        return response()->json([
            'success' => true,
            'data'    => new DeploymentResource($deploymentModel),
        ]);
    }

    /**
     * PUT /api/deployments/{deployment}
     */
    public function update(UpdateDeploymentRequest $request, int $deployment): JsonResponse
    {
        $deploymentModel = $this->deploymentService->update($deployment, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Déploiement mis à jour avec succès.',
            'data'    => new DeploymentResource($deploymentModel),
        ]);
    }

    /**
     * DELETE /api/deployments/{deployment}
     */
    public function destroy(int $deployment): JsonResponse
    {
        $this->deploymentService->delete($deployment);

        return response()->json([
            'success' => true,
            'message' => 'Déploiement supprimé avec succès.',
        ]);
    }
}
