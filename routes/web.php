<?php

use App\Http\Controllers\ProfileController;
use App\Http\Resources\UserResource;
use App\Http\Resources\WatchResource;
use App\Models\User;
use App\Models\Watch;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

Route::get('test', function () {
    $watches = Watch::with(['brand', 'status', 'batch', 'location', 'images'])->get();
    return WatchResource::collection($watches);
});


Route::get('login-now', function (Request $request) {

    if (app()->environment('production')) return;

    abort_if($request->ip() != '127.0.0.1', 403);

    Auth::login(User::query()->first(), true);

    return redirect()->route('home');
});

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'title'     => 'Welcome',
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ])->withViewData('title', 'Welcome');
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
