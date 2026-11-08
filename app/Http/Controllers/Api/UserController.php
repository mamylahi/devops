<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService) {}

    /**
     * GET /api/users
     * Liste paginée des utilisateurs.
     */
    public function index(): JsonResponse
    {
        $users = $this->userService->getAll();

        return response()->json([
            'success' => true,
            'data'    => new UserCollection($users),
            'meta'    => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
            ],
        ]);
    }

    /**
     * POST /api/users
     * Crée un nouvel utilisateur.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur créé avec succès.',
            'data'    => new UserResource($user),
        ], JsonResponse::HTTP_CREATED);
    }

    /**
     * GET /api/users/{user}
     * Retourne un utilisateur.
     */
    public function show(int $user): JsonResponse
    {
        $userModel = $this->userService->getById($user);

        return response()->json([
            'success' => true,
            'data'    => new UserResource($userModel),
        ]);
    }

    /**
     * PUT /api/users/{user}
     * Met à jour un utilisateur.
     */
    public function update(UpdateUserRequest $request, int $user): JsonResponse
    {
        $userModel = $this->userService->update($user, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès.',
            'data'    => new UserResource($userModel),
        ]);
    }

    /**
     * DELETE /api/users/{user}
     * Supprime un utilisateur.
     */
    public function destroy(int $user): JsonResponse
    {
        $this->userService->delete($user);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès.',
        ]);
    }
}
