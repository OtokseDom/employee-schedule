<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductUnitController;
use App\Http\Controllers\Api\ProductVariationController;
use App\Http\Controllers\Api\StorageController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\UnitController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\WarehouseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    /* --------------------------------- Masters -------------------------------- */
    // Route::apiResource('/users', UserController::class);
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/product-variations', ProductVariationController::class);
    Route::apiResource('/customers', CustomerController::class);
    Route::apiResource('/suppliers', SupplierController::class);
    Route::apiResource('/units', UnitController::class);
    Route::apiResource('/branches', BranchController::class);
    Route::apiResource('/warehouses', WarehouseController::class);
    Route::apiResource('/storages', StorageController::class);
    Route::apiResource('/contacts', ContactController::class);
    Route::apiResource('/vehicles', VehicleController::class);

    /* ---------------------------- Master Relations ---------------------------- */
    Route::apiResource('/product-units', ProductUnitController::class);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
