<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\PendingResourceRegistration;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        PendingResourceRegistration::macro('setParam', function (string $param) {
            /** @var \Illuminate\Routing\PendingResourceRegistration $this */
            return $this->parameters([
                $this->name => $param,
            ]);
        });

        PendingResourceRegistration::macro('namePrefix', function (string $prefix) {
            /** @var \Illuminate\Routing\PendingResourceRegistration $this */
            return $this->names([
                'index' => $prefix . 'index',
                'create' => $prefix . 'create',
                'store' => $prefix . 'store',
                'show' => $prefix . 'show',
                'edit' => $prefix . 'edit',
                'update' => $prefix . 'update',
                'destroy' => $prefix . 'destroy',
            ]);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::automaticallyEagerLoadRelationships();

        Vite::prefetch(concurrency: 3);

        JsonResource::withoutWrapping();
    }
}
