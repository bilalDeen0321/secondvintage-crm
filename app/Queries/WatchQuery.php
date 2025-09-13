<?php

namespace App\Queries;

use App\Models\Batch;
use App\Models\Brand;
use App\Models\Currency;
use App\Models\Location;
use App\Models\Status;
use App\Models\Watch;
use App\Packages\Utils\Traits\CreateInstance;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class WatchQuery
{
    use CreateInstance;

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
     * Get the columns that may alllow filters
     */
    public function getFiltersColumns(Request $request)
    {
        return $request->only(['search', 'status', 'brand', 'location', 'columns', 'direction']);
    }


    /**
     * execute the query
     * 
     * @return \Illuminate\Database\Eloquent\Builder<\App\Models\Watch>
     */
    public function execute(Request $request)
    {
        // Map frontend column names to database columns if needed
        $columns = [
            'name' => 'name',
            'sku' => 'sku',
            'brand' => 'brand',
            'status' => 'status',
            'location'          => 'location',
            'created_at'        => 'created_at',
            'current_cost'      => 'current_cost',
            'original_cost'     => 'original_cost',
        ];

        $query = QueryBuilder::for(Watch::class);

        $column = $request->input('order.column', 'created_at');
        $dir    = $request->input('order.dir', 'desc');

        if ($column && isset($columns[$column])) {
            $query->orderBy($columns[$column], $dir);
        }

        $query
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

        // Get paginated results
        // $watches = $query->paginate($request->input('per_page', 10))->withQueryString();
        return $query;
    }


    public function getCounts(): array
    {
        $watchCount = ['all' => Watch::count()];
        foreach (Status::allStatuses() as $status) {
            $watchCount[$status] = Watch::where('status', $status)->count();
        }
        return $watchCount;
    }

    /**
     * Get curd data for watch module
     */
    /**
     * The controller's actions data for watch management.
     */
    public function crudData()
    {
        return [
            'currencies' => Currency::query()->latest()->get(),
            'locations' => Location::query()->latest()->pluck('name')->unique()->values(),
            'statuses' => Status::query()->latest()->pluck('name')->unique()->values(),
            'batches' => Batch::query()->orderBy('name')->pluck('name')->unique()->values(),
            'brands' => Brand::query()->orderBy('name')->pluck('name')->unique()->values(),
        ];
    }
}
