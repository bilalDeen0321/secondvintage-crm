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
            LocationSeeder::class,
            CurrencySeeder::class,
            BrandSeeder::class,
            StatusSeeder::class,
            RolePermissionSeeder::class,
            WatchSeeder::class,
            StageSeeder::class,
            BatchSeeder::class,
            WatchImageSeeder::class,
            WishlistSeeder::class,
            TransactionSeeder::class,
            LogSeeder::class,
            WatchLogSeeder::class,
            PlatformDataSeeder::class,
            SaleSeeder::class,
        ]);
    }
}
