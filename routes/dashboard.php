<?php



use App\Http\Controllers\AgentWatchController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\BatchWatchController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Sale\ExportController;
use App\Http\Controllers\FullDataViewController;
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
use Inertia\Inertia;


/**
 * Web dashboard routes
 */


Route::resource('users/roles', RoleController::class);
Route::resource('users', UserController::class);

Route::post('watches/bulk-action', [WatchController::class, 'bulkActions'])->name('watches.bulk-actions');
Route::post('watches/{watch}/approve', [WatchController::class, 'approve'])->name('watches.approve');
Route::resource('watches', WatchController::class);


Route::prefix('platform-data')->name('platform-data.')->group(function () {
    Route::post('ai-fill/{watch}', [PlatformDataController::class, 'aiFill'])->name('ai-fill');
    Route::post('changes/{watch}', [PlatformDataController::class, 'changes'])->name('changes');
    Route::post('bulk-actions', [PlatformDataController::class, 'bulkActions'])->name('bulk-actions');
    Route::get('fetch/{watch}', [PlatformDataController::class, 'fetch'])->name('fetch');
    Route::post('save/{watch}', [PlatformDataController::class, 'save'])->name('save');
    Route::get('show/{watch}', [PlatformDataController::class, 'show'])->name('show');
    Route::put('approve/{watch}', [PlatformDataController::class, 'approve'])->name('approve');
});

Route::prefix('sales/exports')->name('sales.exports.')->group(function () {
    Route::post('catawiki', [ExportController::class, 'catawiki'])->name('catawiki');
});
Route::resource('sales', SaleController::class)->setParam('watch');


Route::resource('brands', BrandController::class);

/**
 * Batch routes
 */
Route::put('batches/{batch}/status', [BatchController::class, 'updateStatus'])->name('batches.status');
Route::resource('batches', BatchController::class);
Route::resource('batches.watches', BatchWatchController::class);

// Route::delete('{batch}/{watch}', [BatchController::class, 'removeWatch'])->name('removeWatch');

Route::resource('promote', PromoteController::class);
Route::resource('history', HistoryController::class);
Route::resource('performance', PerformanceController::class);
Route::resource('wishlist', WishlistController::class);
Route::resource('payments', PaymentController::class);
Route::resource('agent-watches', AgentWatchController::class);
Route::resource('sellers', SellerController::class);
Route::resource('invoices', InvoiceController::class);
Route::resource('tools', ToolController::class);
Route::resource('data', FullDataViewController::class);
Route::resource('settings', SettingController::class);
Route::resource('log', LogController::class);

//other routes
Route::get('/', [DashboardController::class, 'index'])->name('home');
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

//fallback route
Route::fallback(fn() => Inertia::render('NotFound'));
