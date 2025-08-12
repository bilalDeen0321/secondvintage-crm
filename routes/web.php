<?php

use App\Http\Controllers\ProfileController;
use App\Http\Resources\UserResource;
use App\Http\Resources\WatchResource;
use App\Models\User;
use App\Models\Watch;
use App\Services\Api\MakeAiHook;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

Route::get('test', function () {
    return route('api.make-ai-hooks.description', ['watch' => 1]);
});
