<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    /** @use HasFactory<\Database\Factories\SaleFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'sold_by',
        'watch_id',
        'original_price',
        'currency',
        'price',
        'buyer_name',
        'buyer_email',
        'buyer_address',
        'buyer_city',
        'buyer_country',
        'buyer_postal_code',
        'buyer_iso_code',
        'condition',
        'gender',
        'movement',
        'case_material',
        'dial_color',
        'original_box',
        'original_papers',
        'original_warranty',
        'working_order',
        'repainted_dial',
    ];
}
