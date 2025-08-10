<?php

namespace Database\Seeders;

use App\Models\{User, Brand, Location, Status, Stage, Batch, Watch, Wishlist, Transaction, Log, WatchLog, PlatformData};
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            // UserSeeder::class,
            // BrandSeeder::class,
            // LocationSeeder::class,
            // StatusSeeder::class,
            // StageSeeder::class,
            // BatchSeeder::class,
            // WatchSeeder::class,
            // WatchImageSeeder::class,
            // WishlistSeeder::class,
            // TransactionSeeder::class,
            // LogSeeder::class,
            // WatchLogSeeder::class,
            // PlatformDataSeeder::class,
        ]);

        // User::factory()->count(10)->create();
        // // Role::factory()->count(5)->create();
        // Brand::factory()->count(10)->create();
        // Location::factory()->count(5)->create();
        // Status::factory()->count(4)->create();
        // Stage::factory()->count(4)->create();
        // Batch::factory()->count(3)->create();
        // Watch::factory()->count(50)->create();
        // WishList::factory()->count(10)->create();
        // Transaction::factory()->count(20)->create();
        // Log::factory()->count(30)->create();
        // WatchLog::factory()->count(50)->create();
        // PlatformData::factory()->count(20)->create();
    }
}
