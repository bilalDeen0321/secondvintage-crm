<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testing extends Model
{
    // Fillable attributes
    protected $fillable = ['name', 'data', 'value'];

    // Cast 'data' attribute to array
    protected $casts = [
        'data' => 'array',
    ];
}
