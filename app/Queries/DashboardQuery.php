<?php

namespace App\Queries;

use Carbon\Carbon;
use App\Models\Log;
use App\Models\Sale;
use App\Models\Watch;
use Carbon\CarbonPeriod;
use App\Models\PlatformData;
use Illuminate\Support\Facades\DB;

class DashboardQuery
{
    public function allFilters(): array 
    {
        return [
            'all-time'      => 'All Time',
            'this-year'     => 'This Year',
            'last-year'     => 'Last Year',
            'last-6-months' => '6 Months',
            'last-3-months' => '3 Months',
            'last-month'    => 'Last Month',
            'this-month'    => 'This Month',
        ];
    }

    private function getDateRange(string $filter): array
    {
        $now = now();

        return match ($filter) {
            'all-time' => [null, null],
            'this-year' => [$now->copy()->startOfYear(), $now->endOfDay()], // , $now]
            'last-year' => [$now->copy()->subYear()->startOfYear(), $now->copy()->subYear()->endOfYear()],
            'last-6-months' => [$now->copy()->subMonths(6), $now->endOfDay()], // , $now]
            'last-3-months' => [$now->copy()->subMonths(3), $now->endOfDay()], // , $now]
            'last-month' => [$now->copy()->subMonth()->startOfMonth(),$now->copy()->subMonth()->endOfMonth()],
            'this-month' => [$now->copy()->startOfMonth(), $now->endOfMonth()], // , $now]
            default => [null, null],
        };
    }

    protected function applyFilter($query, string $filter)
    {
        $range = $this->getDateRange($filter);
        [$start, $end] = $range;

        if ($start && $end) {
            return $query->whereBetween('created_at', [$start, $end]);
        } elseif ($start) {
            return $query->where('created_at', '>=', $start);
        } elseif ($end) {
            return $query->where('created_at', '<=', $end);
        }

        return $query; // No filter for 'all-time'
    }
    
    public function getDashboardMetrics(string $filter = 'all-time'): array
    {
        // Base queries
        $salesQuery   = Sale::query();
        $salesQuery   = $this->applyFilter($salesQuery, $filter);
        $watchesQuery = Watch::query();
        $watchesQuery = $this->applyFilter($watchesQuery, $filter);

        // Global
        $totalRevenue   = $salesQuery->sum('price');
        $totalInventory = $watchesQuery->sum(DB::raw('original_cost * 1.0'));
        $totalWatches   = $watchesQuery->count();
        $inStock        = (clone $watchesQuery)->where('location', 'Denmark')->count();
        $listed         = (clone $watchesQuery)->where('status', 'listed')->count();
        $soldThisMonth  = $this->applyFilter(Sale::query(), 'this-month')->count();

        // Denmark
        $denmarkWatches = (clone $watchesQuery)->where('location', 'Denmark');
        $denmarkInventory = $denmarkWatches->sum(DB::raw('original_cost * 1.0'));
        $denmarkCount     = $denmarkWatches->count();

        // External (not Denmark)
        $externalWatches = (clone $watchesQuery)->where('location', '!=', 'Denmark');
        $externalInventory = $externalWatches->sum(DB::raw('original_cost * 1.0'));
        $externalCount     = $externalWatches->count();

        // Get readable label for duration (filter)
        $filterLabels = $this->allFilters();
        $durationLabel = $filterLabels[$filter];

        return [
            'total_revenue' => [
                'value' => round($totalRevenue, 0),
                'label' => "{$durationLabel} total",
            ],
            'total_inventory' => [
                'value' => round($totalInventory, 0),
                'watches' => $totalWatches,
            ],
            'denmark_inventory' => [
                'value' => round($denmarkInventory, 0),
                'watches' => $denmarkCount,
            ],
            'external_inventory' => [
                'value' => round($externalInventory, 0),
                'watches' => $externalCount,
            ],
            'total_watches' => $totalWatches,
            'in_stock'      => $inStock,
            'listed'        => $listed,
            'sold_this_month' => $soldThisMonth,
        ];
    }

    public function getTopBrandsByProfit(string $filter = 'this-year')
    {
        $query = Sale::query()
            ->select(
                'brands.name',
                DB::raw('COUNT(sales.id) AS sales_count'),
                DB::raw('SUM(sales.price) AS total_revenue'),
                DB::raw('SUM(sales.price - watches.original_cost) AS total_profit')
            )
            ->join('watches', 'sales.watch_id', '=', 'watches.id')
            ->join('brands', 'watches.brand_id', '=', 'brands.id')
            ->groupBy('brands.id', 'brands.name');

        // Apply date filter safely
        if ($filter !== 'all-time') {
            [$start, $end] = $this->getDateRange($filter);
            if ($start && $end) {
                $query->whereBetween('sales.created_at', [$start, $end]);
            }
        }

        return $query->orderByDesc('total_profit')->limit(5)->get();
    }


    public function getTopProfitableCountries($filter = 'all-time')
    {
        $query = Sale::select(
            'buyer_country',
            DB::raw('COUNT(*) as sales_count'),
            DB::raw('SUM(price) as revenue'),
            DB::raw('SUM(price - COALESCE(original_price, 0)) as profit')
        )
        ->groupBy('buyer_country');
        $query = $this->applyFilter($query, $filter);
        return $query->orderByDesc('profit')->limit(5)->get();
    }

    /**
     * Get monthly revenue, profit, and watches sold data for charts, aligned with filter.
     * Fills zeros for months with no data.
     */
    public function getRevenueData(string $filter = 'all-time'): array
    {  
        [$start, $end] = $this->getDateRange($filter);

        // Fetch aggregated sales data
        $salesData = Sale::selectRaw("
                DATE_FORMAT(MIN(created_at), '%Y-%m') as month_key,
                DATE_FORMAT(MIN(created_at), '%b') as month,
                SUM(price) as revenue,
                SUM(price - COALESCE(original_price, 0)) as profit,
                COUNT(*) as watches
            ")
            ->when($start, fn($q) => $q->where('created_at', '>=', $start))
            ->when($end, fn($q) => $q->where('created_at', '<=', $end))
            ->groupByRaw("YEAR(created_at), MONTH(created_at)")
            ->orderByRaw("MIN(created_at)")
            ->get()
            ->keyBy('month_key')
            ->toArray();

        // Generate all months in the range using CarbonPeriod
        $months = [];
        $period = CarbonPeriod::create(Carbon::parse($start ?? Sale::min('created_at'))->startOfMonth(), '1 month', Carbon::parse($end ?? now())->endOfMonth());

        foreach ($period as $date) {
            $monthKey = $date->format('Y-m');
            $months[$monthKey] = [
                'month' => $date->format('M Y'),
                'revenue' => 0.0,
                'profit' => 0.0,
                'watches' => 0,
            ];
        }

        // Merge actual sales data
        foreach ($salesData as $key => $data) {
            if (isset($months[$key])) {
                $months[$key] = [
                    'month' => $data['month'],
                    'revenue' => (float) ($data['revenue'] ?? 0),
                    'profit' => (float) ($data['profit'] ?? 0),
                    'watches' => (int) ($data['watches'] ?? 0),
                ];
            }
        }

        return array_values($months); // Re-index for chart
    }

    /**
     * Get watch inventory distribution by brand for donut chart.
     * Dynamically selects top 5 brands by count, consolidates rest into "Others".
     */
    public function getWatchInventoryByBrand(string $filter = 'this-month'): array
    {  
        [$start, $end] = $this->getDateRange($filter);

        // Get ranked brands with dynamic filter
        $brands = DB::select("
            WITH ranked_brands AS (
                SELECT 
                    b.name AS brand,
                    COUNT(w.id) AS count,
                    ROUND(
                        (COUNT(w.id) / (
                            SELECT COUNT(*) 
                            FROM watches w2
                            WHERE (? IS NULL OR w2.created_at >= ?)
                            AND (? IS NULL OR w2.created_at <= ?)
                        )) * 100, 1
                    ) AS percentage,
                    RANK() OVER (ORDER BY COUNT(w.id) DESC) AS rnk
                FROM watches w
                LEFT JOIN brands b ON b.id = w.brand_id
                WHERE (? IS NULL OR w.created_at >= ?)
                AND (? IS NULL OR w.created_at <= ?)
                GROUP BY b.name
            )
            SELECT brand, count, percentage, rnk
            FROM ranked_brands
            WHERE rnk <= 5
            UNION ALL
            SELECT 'Others', SUM(count), ROUND(
                (SUM(count) / (
                    SELECT COUNT(*) 
                    FROM watches w2
                    WHERE (? IS NULL OR w2.created_at >= ?)
                    AND (? IS NULL OR w2.created_at <= ?)
                )) * 100, 1
            ), NULL
            FROM ranked_brands
            WHERE rnk > 5",
            [
                $start, $start, $end, $end, // Denominator subquery 1
                $start, $start, $end, $end, // Main WHERE
                $start, $start, $end, $end  // Denominator subquery 2
            ]
        );

        if (empty($brands)) {
            return [];
        }

        $brandData = [];
        foreach ($brands as $brand) {
            $brandData[] = [
                'brand' => $brand->brand,
                'count' => (int) $brand->count,
                'percentage' => (float) $brand->percentage,
                'color' => $this->getBrandColor($brand->brand),
            ];
        }

        return $brandData;
    }

    /**
     * Get color for a brand based on chartConfig or default.
     */
    protected function getBrandColor(string $brandName): string
        {
            $brandColors = [
                'Seiko' => '#58D68D',
                'Rolex' => '#3b82f6',
                'Omega' => '#5DADE2',
                'TAG Heuer' => '#ef4444',
                'Breitling' => '#8b5cf6',
                'IWC'     => '#AF7AC5',
                'Tudor'   => '#76B041',
                'Cartier' => '#4B9CD3',
                'Longines'=> '#9B59B6',
                'Others'  => '#FF6F61', 
            ];

            // Normalize brand names (trim/case-insensitive)
            $key = trim($brandName);

            // Return predefined color or fallback to "Others"
            return $brandColors[$key] ?? $brandColors['Others'];
        }

    public function getWatchesSoldPerMonth(string $filter = 'last-6-months'): array
    {
        [$start, $end] = $this->getDateRange($filter);

        // Handle "all-time"
        if (!$start && !$end) {
            $start = Sale::min('created_at');
            $end   = now();
        }

        $rows = DB::select("
            WITH RECURSIVE months AS (
                SELECT DATE_FORMAT(?,'%Y-%m-01') AS month_start
                UNION ALL
                SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
                FROM months
                WHERE month_start < ?
            )
            SELECT 
                DATE_FORMAT(m.month_start, '%b') AS month,
                COALESCE(COUNT(s.id), 0) AS watches,
                COALESCE(SUM(s.price), 0) AS value,
                COALESCE(SUM(s.original_price), 0) AS original_value
            FROM months m
            LEFT JOIN sales s 
                ON DATE_FORMAT(s.created_at, '%Y-%m') = DATE_FORMAT(m.month_start, '%Y-%m')
                AND s.created_at BETWEEN ? AND ?
            GROUP BY m.month_start
            ORDER BY m.month_start
        ", [$start, $end, $start, $end]);

        return array_map(fn($row) => [
            'month'          => $row->month,
            'watches'        => (int) $row->watches,
            'value'          => (float) $row->value,
            'original_value' => (float) $row->original_value,
        ], $rows);
    }

    public function getSalesByPlatform(string $filter = 'all-time'): array
    {
        $query = Sale::query()
            ->selectRaw('w.platform as platform, COUNT(sales.id) as sales')
            ->join('watches as w', 'sales.watch_id', '=', 'w.id');

        // Apply reusable filters (date, seller, etc.)
        // $query = $this->applyFilter($query, $filter);

        // Only apply date filter if start/end are not null
        [$start, $end] = $this->getDateRange($filter);
        if ($start && $end) {
            $query->whereBetween('sales.created_at', [$start, $end]);
        }

        $platformSales = $query
            ->groupBy('w.platform')
            ->orderByDesc('sales')
            ->get();

        $total = $platformSales->sum('sales');

        if ($total === 0) {
            return [];
        }

        $unknownSales = $platformSales->whereNull('platform')->sum('sales');
        $knownStats   = $platformSales->whereNotNull('platform')->sortByDesc('sales')->values();

        $top         = $knownStats->take(3);
        $othersSales = $knownStats->skip(3)->sum('sales');

        $result = collect();

        $colorMap = [
            PlatformData::CATAWIKI     => '#3b82f6',
            PlatformData::TRADERA      => '#10b981',
            PlatformData::EBAY_FIXED   => '#8b5cf6',
            PlatformData::EBAY_AUCTION => '#ec4899',
            PlatformData::CHRONO24     => '#f97316',
            PlatformData::WEBSHOP      => '#22d3ee',
        ];

        foreach ($top as $row) {
            $slug  = $row->platform;
            $label = PlatformData::toLabel($slug);
            $result->push([
                'platform'   => $label,
                'slug'       => $slug,
                'sales'      => (int) $row->sales,
                'percentage' => round(($row->sales / $total) * 100, 1),
                'color'      => $colorMap[$slug] ?? '#f59e0b',
            ]);
        }

        if ($knownStats->count() > 3 || $othersSales > 0) {
            $result->push([
                'platform'   => 'Others',
                'slug'       => 'others',
                'sales'      => (int) $othersSales,
                'percentage' => round(($othersSales / $total) * 100, 1),
                'color'      => '#ef4444',
            ]);
        }

        $result->push([
            'platform'   => 'Unknown',
            'slug'       => 'unknown',
            'sales'      => (int) $unknownSales,
            'percentage' => round(($unknownSales / $total) * 100, 1),
            'color'      => '#9ca3af',
        ]);

        return $result->values()->toArray();
    }

    /** 
     * Get recent activity feed from logs table for dashboard.
     */
    public function getRecentActivity(string $filter = 'last-month', int $limit = 5): array
    {
        $query = Log::query()
            ->with('user') 
            ->orderBy('created_at', 'desc');
        $query = $this->applyFilter($query, $filter);

        $logs = $query->limit($limit)->get();

        $activities = $logs->map(function ($log) {
            return [
                'message' => $log->message ?? 'Activity logged',
                'timestamp' => $log->created_at->diffForHumans(),
                'category' => $log->category,
            ];
        })->values()->all();

        return $activities;
    }
}
