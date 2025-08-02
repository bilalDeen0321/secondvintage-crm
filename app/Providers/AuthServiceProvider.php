<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;


class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        \App\Models\Batch::class        => \App\Policies\BatchPolicy::class,
        \App\Models\Brand::class        => \App\Policies\BrandPolicy::class,
        \App\Models\Location::class     => \App\Policies\LocationPolicy::class,
        \App\Models\Log::class          => \App\Policies\LogPolicy::class,
        \App\Models\PlatformData::class => \App\Policies\PlatformDataPolicy::class,
        \App\Models\Setting::class      => \App\Policies\SettingPolicy::class,
        \App\Models\Stage::class        => \App\Policies\StagePolicy::class,
        \App\Models\Status::class       => \App\Policies\StatusPolicy::class,
        \App\Models\Transaction::class  => \App\Policies\TransactionPolicy::class,
        \App\Models\User::class         => \App\Policies\UserPolicy::class,
        \App\Models\WatchImage::class   => \App\Policies\WatchImagePolicy::class,
        \App\Models\WatchLog::class     => \App\Policies\WatchLogPolicy::class,
        \App\Models\Watch::class        => \App\Policies\WatchPolicy::class,
        \App\Models\WishList::class     => \App\Policies\WishListPolicy::class,
    ];


    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Additional gates can be defined here if needed
    }
}
