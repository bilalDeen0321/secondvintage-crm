<?php

namespace App\Models;

use App\Traits\Models\ModelHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    /** @use HasFactory<\Database\Factories\BrandFactory> */
    use HasFactory, ModelHelpers;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [];
    }

    /**
     * Boot the model and attach event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        //auto generate brand code
        static::creating(function (self $brand) {
            $brand->code = rand(0, 100);
        });
    }
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
