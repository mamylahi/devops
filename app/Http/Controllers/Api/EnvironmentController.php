<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Environment\StoreEnvironmentRequest;
use App\Http\Requests\Environment\UpdateEnvironmentRequest;
use App\Http\Resources\EnvironmentCollection;
use App\Http\Resources\EnvironmentResource;
use App\Services\EnvironmentService;
use Illuminate\Http\JsonResponse;

class EnvironmentController extends Controller
{
    public function __construct(private readonly EnvironmentService $environmentService) {}

    /**
     * GET /api/environments
     */
    public function index(): JsonResponse
    {
        $environments = $this->environmentService->getAll();

        return response()->json([
            'success' => true,
            'data'    => new EnvironmentCollection($environments),
            'meta'    => [
                'current_page' => $environments->currentPage(),
                'last_page'    => $environments->lastPage(),
                'per_page'     => $environments->perPage(),
                'total'        => $environments->total(),
            ],
        ]);
    }

    /**
     * POST /api/environments
     */
    public function store(StoreEnvironmentRequest $request): JsonResponse
    {
        $environment = $this->environmentService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Environnement créé avec succès.',
            'data'    => new EnvironmentResource($environment),
        ], JsonResponse::HTTP_CREATED);
    }

    /**
     * GET /api/environments/{environment}
     */
    public function show(int $environment): JsonResponse
    {
        $environmentModel = $this->environmentService->getById($environment);

        return response()->json([
            'success' => true,
            'data'    => new EnvironmentResource($environmentModel),
        ]);
    }

    /**
     * PUT /api/environments/{environment}
     */
    public function update(UpdateEnvironmentRequest $request, int $environment): JsonResponse
    {
        $environmentModel = $this->environmentService->update($environment, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Environnement mis à jour avec succès.',
            'data'    => new EnvironmentResource($environmentModel),
        ]);
    }

    /**
     * DELETE /api/environments/{environment}
     */
    public function destroy(int $environment): JsonResponse
    {
        $this->environmentService->delete($environment);

        return response()->json([
            'success' => true,
            'message' => 'Environnement supprimé avec succès.',
        ]);
    }
}
