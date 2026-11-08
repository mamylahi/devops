<?php

namespace App\Exceptions;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * Exceptions qui ne sont pas reportées dans les logs.
     */
    protected $dontReport = [];

    /**
     * Gestion centralisée des exceptions pour l'API JSON.
     */
    public function render($request, Throwable $e): JsonResponse|\Illuminate\Http\Response
    {
        // Toutes les réponses API sont en JSON
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($e);
        }

        return parent::render($request, $e);
    }

    private function handleApiException(Throwable $e): JsonResponse
    {
        // Erreur de validation (422)
        if ($e instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Les données fournies sont invalides.',
                'errors'  => $e->errors(),
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Ressource introuvable (404)
        if ($e instanceof ModelNotFoundException) {
            $model = class_basename($e->getModel());
            return response()->json([
                'success' => false,
                'message' => "{$model} introuvable.",
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        // Erreur HTTP générique
        if ($e instanceof HttpException) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'Erreur HTTP.',
            ], $e->getStatusCode());
        }

        // Erreur serveur inattendue (500)
        return response()->json([
            'success' => false,
            'message' => 'Une erreur interne est survenue.',
            'debug'   => config('app.debug') ? $e->getMessage() : null,
        ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
    }
}
