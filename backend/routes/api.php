<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ProductUnitController;
use App\Http\Controllers\Api\ScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    /* --------------------------------- Masters -------------------------------- */
    Route::apiResource('/schedule', ScheduleController::class);
    Route::apiResource('/employee', EmployeeController::class);
    Route::apiResource('/event', EventController::class);

    /* ---------------------------- Master Relations ---------------------------- */
    Route::apiResource('/product-units', ProductUnitController::class);
    Route::get('/schedule-by-employee/{employeeId}', [ScheduleController::class, 'getScheduleByEmployee']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);