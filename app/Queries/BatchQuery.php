<?php

namespace App\Queries;

use App\Enums\BatchStatus;
use App\Models\Batch;
use App\Models\Location;
use App\Models\User;
use App\Packages\Utils\Traits\CreateInstance;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class BatchQuery
{
    use CreateInstance;

    protected array $columns = [
        'name' => 'name',
        'status' => 'status',
        'tracking_number' => 'tracking_number',
        'origin' => 'origin',
        'destination' => 'destination',
        'location' => 'location',
        'created_by' => 'created_by',
        'created_at' => 'created_at',
        'shipped_at' => 'shipped_at',
        'delivered_at' => 'delivered_at',
        'watches_count' => 'watches_count',
    ];

    /**
     * Get the columns that may allow filters
     */
    public function getFiltersColumns(Request $request): array
    {
        return $request->only([
            'search', 
            'status', 
            'location', 
            'created_by', 
            'columns', 
            'direction'
        ]);
    }


    public function execute(Request $request)
    {
        $query = QueryBuilder::for(Batch::class)
            ->with(['location', 'createdBy', 'watches','watches.images', 'watches.brand'])
            ->withCount('watches');

        $query->orderBy('created_at', 'desc');

        // Apply filters
        $query
            ->when($request->filled('search'), function (Builder $q) use ($request) {
                $search = $request->input('search');
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('tracking_number', 'like', "%{$search}%")
                        ->orWhere('origin', 'like', "%{$search}%")
                        ->orWhere('destination', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('status') && $request->input('status') !== 'all', function (Builder $q) use ($request) {
                $statuses = Arr::wrap($request->input('status'));
                $q->whereIn('status', $statuses);
            });

        return $query;
    }

    public function getStatistics()
    {
        $allStatuses = BatchStatus::allStatuses();
        $actualCounts = Batch::query()
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
        $statistics = [];
        foreach ($allStatuses as $status) {
            $statistics[] = [
                'status' => $status->value,
                'count' => $actualCounts[$status->value] ?? 0
            ];
        }
        return collect($statistics);
    }

}
