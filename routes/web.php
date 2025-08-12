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
