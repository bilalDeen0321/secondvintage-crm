<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Currency::query()->delete();
        Currency::query()->insert($this->data());
    }


    protected function data()
    {
        return [
            ['code' => "EUR", 'name' => "Euro", 'symbol' => "€", 'rate' => 1.0],
            ['code' => "USD", 'name' => "US Dollar", 'symbol' => "$", 'rate' => 1.159],
            ['code' => "GBP", 'name' => "British Pound", 'symbol' => "£", 'rate' => 0.864],
            ['code' => "CHF", 'name' => "Swiss Franc", 'symbol' => "CHF", 'rate' => 0.937],
            ['code' => "JPY", 'name' => "Japanese Yen", 'symbol' => "¥", 'rate' => 172.1],
            ['code' => "CAD", 'name' => "Canadian Dollar", 'symbol' => "C$", 'rate' => 1.611],
            ['code' => "AUD", 'name' => "Australian Dollar", 'symbol' => "A$", 'rate' => 1.805],
            ['code' => "SEK", 'name' => "Swedish Krona", 'symbol' => "kr", 'rate' => 11.16],
            ['code' => "NOK", 'name' => "Norwegian Krone", 'symbol' => "kr", 'rate' => 11.84],
            ['code' => "DKK", 'name' => "Danish Krone", 'symbol' => "kr", 'rate' => 7.46],
            ['code' => "CNY", 'name' => "Chinese Yuan", 'symbol' => "¥", 'rate' => 8.40],
            ['code' => "SGD", 'name' => "Singapore Dollar", 'symbol' => "S$", 'rate' => 1.495],
            ['code' => "HKD", 'name' => "Hong Kong Dollar", 'symbol' => "HK$", 'rate' => 9.05],
            ['code' => "BDT", 'name' => "Bangladeshi Taka", 'symbol' => "৳", 'rate' => 141.01],
            ['code' => "VND", 'name' => "Vietnamese Dong", 'symbol' => "₫", 'rate' => 30587],
        ];
    }
}
