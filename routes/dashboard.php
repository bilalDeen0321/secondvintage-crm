<?php

/**
 * Web dashboard routes
 */

use App\Http\Controllers\AgentWatchController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\PlatformDataController;
use App\Http\Controllers\PromoteController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ToolController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WatchController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;


Route::get('/', [DashboardController::class, 'index'])->name('home');
Route::resource('dashboard', DashboardController::class)->only(['index']);
Route::resource('users/roles', RoleController::class);
Route::resource('users', UserController::class);
Route::resource('watches', WatchController::class);
Route::resource('sales', SaleController::class);
Route::resource('batch', BatchController::class);
Route::resource('promote', PromoteController::class);
Route::resource('history', HistoryController::class);
Route::resource('performance', PerformanceController::class);
Route::resource('wishlist', WishlistController::class);
Route::resource('payments', PaymentController::class);
Route::resource('agent-watches', AgentWatchController::class);
Route::resource('sellers', SellerController::class);
Route::resource('invoices', InvoiceController::class);
Route::resource('tools', ToolController::class);
Route::resource('data', PlatformDataController::class);
Route::resource('settings', SettingController::class);
Route::resource('log', LogController::class);
