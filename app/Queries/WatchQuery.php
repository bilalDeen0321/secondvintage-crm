<?php

namespace App\Queries;

use App\Models\Status;
use App\Models\Watch;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class WatchQuery
{

    protected array $columns = [
        'name' => 'name',
        'sku' => 'sku',
        'brand' => 'brand',
        'status' => 'status',
        'location'          => 'location',
        'created_at'        => 'created_at',
        'current_cost'      => 'current_cost',
        'original_cost'     => 'original_cost',
    ];


    /**
     * execute the query
     * 
     * @return \Illuminate\Database\Eloquent\Builder<\App\Models\Watch>
     */
    public function execute(Request $request): \Spatie\QueryBuilder\QueryBuilder
    {
        $query = QueryBuilder::for(Watch::class);

        $column = $request->input('order.column', 'created_at');
        $dir    = $request->input('order.dir', 'desc');

        if ($column && isset($columns[$column])) {
            $query->orderBy($columns[$column], $dir);
        }

        return $query
            ->when($request->filled('search'), function (Builder $q) use ($request) {
                $search = $request->input('search');
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        // ->orWhere('original_cost', 'like', "%{$search}%")
                        ->orWhereHas('brand', function ($brandQuery) use ($search) {
                            $brandQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->filled('brand'), function (Builder $q) use ($request) {
                $brands = Arr::wrap($request->input('brand'));
                $q->whereHas('brand', fn($brandQuery) => $brandQuery->whereIn('name', $brands));
            })
            ->when($request->filled('batch'), function (Builder $q) use ($request) {
                $batches = Arr::wrap($request->input('batch'));
                $q->whereHas('batch', fn($batchQuery) => $batchQuery->whereIn('name', $batches));
            })
            ->when($request->filled('status'), function (Builder $q) use ($request) {
                $statuses = Arr::wrap($request->input('status'));
                $q->whereIn('status', $statuses);
            })
            ->when($request->filled('location'), function (Builder $q) use ($request) {
                $locations = Arr::wrap($request->input('location'));
                $q->whereIn('location', $locations);
            });
    }


    public function getWatchCounts(): array
    {
        $watchCount = ['all' => Watch::count()];
        foreach (Status::allStatuses() as $status) {
            $watchCount[$status] = Watch::where('status', $status)->count();
        }
        return $watchCount;
    }
}
