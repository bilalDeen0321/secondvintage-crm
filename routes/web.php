<?php

use App\Http\Controllers\ProfileController;
use App\Http\Resources\UserResource;
use App\Http\Resources\WatchResource;
use App\Models\Batch;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Status;
use App\Models\User;
use App\Models\Watch;
use App\Services\Api\MakeAiHook;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

Route::get('welcome', fn() => Inertia::render('Welcome', [
    'locations' => Location::query()->pluck('name')->unique()->values(),
    'statuses' => Status::query()->pluck('name')->unique()->values(),
    'batches' => Batch::query()->pluck('name')->unique()->values(),
    'brands' => Brand::query()->pluck('name')->unique()->values(),
]));


Route::get('test', function () {

    $payload = [
        'AI_Action'       => 'generate_description',
        'SKU'             => 'OME-SMP-0001',
        'Name'            => 'Omega Speedmaster',
        'Brand'           => 'Omega',
        'Serial'          => '87654321',
        'Ref'             => '311.30.42.30.01.005',
        'Case_Size'       => '42mm',
        'Caliber'         => '1861',
        'Timegrapher'     => '+5s/day, 290 amplitude',
        'Image_URLs'      => [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Casio_OCEANUS_OCW-S1350PC-1AJR_01.JPG/500px-Casio_OCEANUS_OCW-S1350PC-1AJR_01.JPG'
        ],
        'Platform'        => 'Catawiki',
        'Status_Selected' => 'Draft',
        'AI_Instruction'  => 'Write a premium product description highlighting condition and value.',
    ];


    return MakeAiHook::init()->generateDescription($payload);
});
