<?php

use App\Http\Controllers\Api\DeploymentController;
use App\Http\Controllers\Api\EnvironmentController;
use App\Http\Controllers\Api\PipelineController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — DEVOPS Platform
|--------------------------------------------------------------------------
|
| Toutes les routes suivent le circuit :
| Route → Controller → Request → Service → Model → Base de données
|
*/

Route::prefix('v1')->group(function () {

    // ─── Users ────────────────────────────────────────────────────────────────
    Route::apiResource('users', UserController::class);

    // ─── Projects ─────────────────────────────────────────────────────────────
    Route::apiResource('projects', ProjectController::class);

    // ─── Pipelines ────────────────────────────────────────────────────────────
    Route::apiResource('pipelines', PipelineController::class);

    // ─── Environments ─────────────────────────────────────────────────────────
    Route::apiResource('environments', EnvironmentController::class);

    // ─── Deployments ──────────────────────────────────────────────────────────
    Route::apiResource('deployments', DeploymentController::class);
});
