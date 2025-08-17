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
        return  [
            ['code' => "EUR", 'name' => "Euro", 'symbol' => "€", 'rate' => 1.0],
            ['code' => "USD", 'name' => "US Dollar", 'symbol' => "$", 'rate' => 1.1],
            ['code' => "GBP", 'name' => "British Pound", 'symbol' => "£", 'rate' => 0.85],
            ['code' => "CHF", 'name' => "Swiss Franc", 'symbol' => "CHF", 'rate' => 0.95],
            ['code' => "JPY", 'name' => "Japanese Yen", 'symbol' => "¥", 'rate' => 165],
            ['code' => "CAD", 'name' => "Canadian Dollar", 'symbol' => "C$", 'rate' => 1.45],
            ['code' => "AUD", 'name' => "Australian Dollar", 'symbol' => "A$", 'rate' => 1.65],
            ['code' => "SEK", 'name' => "Swedish Krona", 'symbol' => "kr", 'rate' => 11.5],
            ['code' => "NOK", 'name' => "Norwegian Krone", 'symbol' => "kr", 'rate' => 11.8],
            ['code' => "DKK", 'name' => "Danish Krone", 'symbol' => "kr", 'rate' => 7.4636],
            ['code' => "CNY", 'name' => "Chinese Yuan", 'symbol' => "¥", 'rate' => 7.85],
            ['code' => "SGD", 'name' => "Singapore Dollar", 'symbol' => "S$", 'rate' => 1.48],
            ['code' => "HKD", 'name' => "Hong Kong Dollar", 'symbol' => "HK$", 'rate' => 8.6],
            ['code' => "VND", 'name' => "Vietnamese Dong", 'symbol' => "₫", 'rate' => 30587],
        ];;
    }
}
