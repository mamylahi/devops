<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pipeline\StorePipelineRequest;
use App\Http\Requests\Pipeline\UpdatePipelineRequest;
use App\Http\Resources\PipelineCollection;
use App\Http\Resources\PipelineResource;
use App\Services\PipelineService;
use Illuminate\Http\JsonResponse;

class PipelineController extends Controller
{
    public function __construct(private readonly PipelineService $pipelineService) {}

    /**
     * GET /api/pipelines
     */
    public function index(): JsonResponse
    {
        $pipelines = $this->pipelineService->getAll();

        return response()->json([
            'success' => true,
            'data'    => new PipelineCollection($pipelines),
            'meta'    => [
                'current_page' => $pipelines->currentPage(),
                'last_page'    => $pipelines->lastPage(),
                'per_page'     => $pipelines->perPage(),
                'total'        => $pipelines->total(),
            ],
        ]);
    }

    /**
     * POST /api/pipelines
     */
    public function store(StorePipelineRequest $request): JsonResponse
    {
        $pipeline = $this->pipelineService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pipeline créé avec succès.',
            'data'    => new PipelineResource($pipeline),
        ], JsonResponse::HTTP_CREATED);
    }

    /**
     * GET /api/pipelines/{pipeline}
     */
    public function show(int $pipeline): JsonResponse
    {
        $pipelineModel = $this->pipelineService->getById($pipeline);

        return response()->json([
            'success' => true,
            'data'    => new PipelineResource($pipelineModel),
        ]);
    }

    /**
     * PUT /api/pipelines/{pipeline}
     */
    public function update(UpdatePipelineRequest $request, int $pipeline): JsonResponse
    {
        $pipelineModel = $this->pipelineService->update($pipeline, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pipeline mis à jour avec succès.',
            'data'    => new PipelineResource($pipelineModel),
        ]);
    }

    /**
     * DELETE /api/pipelines/{pipeline}
     */
    public function destroy(int $pipeline): JsonResponse
    {
        $this->pipelineService->delete($pipeline);

        return response()->json([
            'success' => true,
            'message' => 'Pipeline supprimé avec succès.',
        ]);
    }
}
