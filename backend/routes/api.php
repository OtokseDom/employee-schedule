<?php

use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\CategoryController;
use App\Http\Controllers\Api\v1\DashboardReportController;
use App\Http\Controllers\Api\v1\KanbanColumnController;
use App\Http\Controllers\Api\v1\OrganizationController;
use App\Http\Controllers\Api\v1\ProjectController;
use App\Http\Controllers\Api\v1\RelationCheckerController;
use App\Http\Controllers\Api\v1\TaskController;
use App\Http\Controllers\Api\v1\TaskDiscussionController;
use App\Http\Controllers\Api\v1\TaskHistoryController;
use App\Http\Controllers\Api\v1\TaskImageController;
use App\Http\Controllers\Api\v1\TaskStatusController;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Controllers\Api\v1\UserReportController;
use App\Http\Resources\UserResource;
use App\Models\TaskStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {

        // Route::get('/user-auth', function (Request $request) {
        //     return $request->user();
        // });
        // Eager load organization
        Route::get('/user-auth', function (Request $request) {
            $user = User::with('organization')->find($request->user()->id);
            return new UserResource($user);
        });
        Route::post('/logout', [AuthController::class, 'logout']);
        /* --------------------------------- Masters -------------------------------- */
        // User CRUD
        Route::apiResource('/organization', OrganizationController::class);
        Route::apiResource('/user', UserController::class);
        Route::apiResource('/task-status', TaskStatusController::class);
        Route::apiResource('/project', ProjectController::class);
        Route::apiResource('/category', CategoryController::class);
        Route::apiResource('/task', TaskController::class);
        Route::apiResource('/task-history', TaskHistoryController::class);
        Route::apiResource('/task-discussion', TaskDiscussionController::class);

        /* --------------------------------- Reports -------------------------------- */
        Route::get('/user/{id}/reports', [UserReportController::class, 'userReports']);
        Route::get('/dashboard', [DashboardReportController::class, 'dashboardReports']);

        /* ---------------------------------- OTHER --------------------------------- */
        Route::patch('/tasks/bulk-update', [TaskController::class, 'bulkUpdate']);
        Route::delete('/tasks/bulk-delete', [TaskController::class, 'bulkDelete']);
        // Route::post('/task-images', [TaskImageController::class, 'store']);
        // Route::delete('/task-images/{taskImage}', [TaskImageController::class, 'destroy']);
        Route::patch('/kanban-column/{kanban_column}', [KanbanColumnController::class, 'update']);
        Route::patch('/tasks/{task}/move', [TaskController::class, 'move']);
        Route::patch('/organization/{organization}/generate-code', [OrganizationController::class, 'generateCode']);
        Route::post('/relation-check', [RelationCheckerController::class, 'check']);
    });
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
});
