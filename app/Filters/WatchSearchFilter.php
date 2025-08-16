<?php

namespace App\Filters;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class WatchSearchFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $query->where(function ($q) use ($value) {
            $q->where('name', 'like', "%{$value}%")
                ->orWhere('sku', 'like', "%{$value}%")
                ->orWhere('location', 'like', "%{$value}%")
                ->orWhereHas('brand', fn($b) => $b->where('name', 'like', "%{$value}%"));
        });
    }
}
