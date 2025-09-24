<?php

namespace App\Queries;

use Carbon\Carbon;
use App\Models\Sale;
use App\Models\Watch;
use Carbon\CarbonPeriod;
use App\Models\PlatformData;
use Illuminate\Support\Facades\DB;

class HistoryQuery
{
    const LAST_30_DAYS = 'last-30-days';

    public function allFilters(): array 
    {
        return [
            'all-time'      => 'All Time',
            'this-year'     => 'This Year',
            'last-year'     => 'Last Year',
            'last-6-months' => '6 Months',
            'last-3-months' => '3 Months',
            'last-30-days'  => 'Last 30 Days',
            'last-7-days'   => 'Last 7 Days',
        ];
    }

    private function getDateRange(string $filter): array
    {
        $now = now();

        return match ($filter) {
            'all-time' => [null, null],
            'this-year' => [$now->copy()->startOfYear(), $now->endOfDay()],
            'last-year' => [$now->copy()->subYear()->startOfYear(), $now->copy()->subYear()->endOfYear()],
            'last-6-months' => [$now->copy()->subMonths(5), $now->endOfDay()],
            'last-3-months' => [$now->copy()->subMonths(2), $now->endOfDay()],
            'last-30-days' => [$now->copy()->subDays(30), $now->endOfDay()],
            'last-7-days' => [$now->copy()->subDays(7), $now->endOfDay()],
            default => [null, null],
        };
    }

    protected function applyFilter($query, string $filter, string $prefix = '')
    {
        [$start, $end] = $this->getDateRange($filter);
        $column = $prefix ? "{$prefix}.created_at" : "created_at";

        if ($start && $end) {
            return $query->whereBetween($column, [$start, $end]);
        }

        if ($start) {
            return $query->where($column, '>=', $start);
        }

        if ($end) {
            return $query->where($column, '<=', $end);
        }

        return $query; // No filter for 'all-time'
    }

    private function calculatePercentageChange(float $current, float $previous): float
    {
        if ($previous == 0) {
            return $current == 0 ? 0 : 100; // 0 -> 0 is 0%, 0 -> positive is 100%
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    public function getTotalSales(string $filter = 'all-time'): array
    {
        $totalSales = $this->applyFilter(Sale::query(), $filter)->count();
        $last30DaysSales = $this->applyFilter(Sale::query(), self::LAST_30_DAYS)->count();

        return [
            'value' => $totalSales,
            'change' => $this->calculatePercentageChange($totalSales, $last30DaysSales),
        ];
    }

    public function getTotalRevenue(string $filter = 'all-time'): array
    {
        $totalRevenue = $this->applyFilter(Sale::query(), $filter)->sum('price');
        $last30DaysRevenue = $this->applyFilter(Sale::query(), self::LAST_30_DAYS)->sum('price');

        return [
            'value' => round($totalRevenue, 0),
            'change' => $this->calculatePercentageChange($totalRevenue, $last30DaysRevenue),
        ];
    }

    public function getTotalProfit(string $filter = 'all-time'): array
    {
        $saleQuery = Sale::query()->select(DB::raw('SUM(price - COALESCE(original_price, 0)) as profit'));

        $totalProfit = $this->applyFilter($saleQuery, $filter)->value('profit') ?? 0;
        $last30DaysProfit = $this->applyFilter($saleQuery, self::LAST_30_DAYS)->value('profit') ?? 0;

        return [
            'value' => round($totalProfit, 0),
            'change' => $this->calculatePercentageChange($totalProfit, $last30DaysProfit),
        ];
    }

    public function getAvgProfitMargin(string $filter = 'all-time'): array
    {
        $saleQuery = Sale::query()
                ->select(DB::raw('AVG((price - COALESCE(original_price, 0)) / price * 100) as avg_margin'))
                ->whereNotNull('price')
                ->where('price', '>', 0);

        $avgProfitMargin = $this->applyFilter($saleQuery, $filter)->value('avg_margin') ?? 0;
        $last30DaysMargin = $this->applyFilter($saleQuery, self::LAST_30_DAYS)->value('avg_margin') ?? 0;

        return [
            'value' => round($avgProfitMargin, 1),
            'change' => $this->calculatePercentageChange($avgProfitMargin, $last30DaysMargin),
        ];
    }

    /**
     * Fetch monthly revenue and profit data.
     */
    public function getMonthlyRevenueProfit(string $filter = 'all-time'): array
    {
        // Build query
        $query = Sale::query()
            ->join('watches', 'sales.watch_id', '=', 'watches.id')
            ->select(
                DB::raw("YEAR(sales.created_at) as year"),
                DB::raw("MONTH(sales.created_at) as month_num"),
                DB::raw("DATE_FORMAT(MIN(sales.created_at), '%b %Y') as month"), // full format, will trim later
                DB::raw("SUM(sales.price) as revenue"),
                DB::raw("SUM(sales.price - COALESCE(watches.original_cost, 0)) as profit")
            )
            ->groupBy(DB::raw("YEAR(sales.created_at), MONTH(sales.created_at)"))
            ->orderBy(DB::raw("YEAR(sales.created_at)"))
            ->orderBy(DB::raw("MONTH(sales.created_at)"));

        // Apply date filter
        $query = $this->applyFilter($query, $filter, 'sales');
        $results = $query->get()->toArray();

        // Ensure all months are represented
        $start = null;
        $end = now();

        if ($filter === 'all-time') {
            $minDate = Sale::min('created_at');
            $start = $minDate ? Carbon::parse($minDate)->startOfMonth() : now()->startOfYear();
        } else {
            [$rangeStart, $rangeEnd] = $this->getDateRange($filter);
            $start = $rangeStart?->copy()->startOfMonth() ?? Sale::min('created_at');
            $end = $rangeEnd?->copy()->endOfMonth() ?? now();
        }

        $period = CarbonPeriod::create($start, '1 month', $end);

        // Decide label format
        $labelFormat = $filter === 'all-time' ? 'M Y' : 'M';

        // Build default structure for all months in range
        $allMonths = [];
        foreach ($period as $date) {
            $key = $date->format('Y-m');
            $allMonths[$key] = [
                'month'   => $date->format($labelFormat),
                'revenue' => 0,
                'profit'  => 0,
            ];
        }

        // Fill with actual results
        foreach ($results as $result) {
            $key = sprintf('%04d-%02d', $result['year'], $result['month_num']);
            if (isset($allMonths[$key])) {
                $monthLabel = $filter === 'all-time'
                    ? $result['month']                                   // already "M Y"
                    : date('M', strtotime($result['month']));            // trim to "M"

                $allMonths[$key] = [
                    'month'   => $monthLabel,
                    'revenue' => (float) $result['revenue'],
                    'profit'  => (float) $result['profit'],
                ];
            }
        }

        return array_values($allMonths);
    }

    /**
     * Fetch monthly profit per platform data.
     */
    public function getProfitPerPlatform(string $filter = 'all-time'): array
    {
        $query = Sale::query()
            ->selectRaw("
                YEAR(sales.created_at) as year,
                MONTH(sales.created_at) as month_num,
                COALESCE(w.platform, 'unknown') as platform,
                SUM(sales.price - COALESCE(w.original_cost, 0)) as profit
            ")
            ->join('watches as w', 'sales.watch_id', '=', 'w.id');

        // Apply date filters
        [$start, $end] = $this->getDateRange($filter);
        if ($start && $end) {
            $query->whereBetween('sales.created_at', [$start, $end]);
        } elseif ($start) {
            $query->where('sales.created_at', '>=', $start);
        } elseif ($end) {
            $query->where('sales.created_at', '<=', $end);
        }

        $rows = $query
            ->groupByRaw('YEAR(sales.created_at), MONTH(sales.created_at), COALESCE(w.platform, \'unknown\')')
            ->orderByRaw('YEAR(sales.created_at), MONTH(sales.created_at)')
            ->get();

        if ($rows->isEmpty()) {
            return [];
        }

        // Collect unique platforms from results (so we only add what actually exists)
        $platforms = $rows->pluck('platform')->unique()->values()->all();

        // Determine period from query results
        $startDate = $rows->min(fn ($r) => Carbon::create($r->year, $r->month_num, 1));
        $endDate   = $rows->max(fn ($r) => Carbon::create($r->year, $r->month_num, 1));
        $period    = CarbonPeriod::create($startDate, '1 month', $endDate);

        // Build result skeleton: all months + all platforms = 0
        $result = [];
        foreach ($period as $date) {
            $key   = $date->format('Y-m');

            $monthLabel = $filter === 'all-time' ? $date->format('M Y') : $date->format('M');

            $entry = ['month' => $monthLabel];

            foreach ($platforms as $platform) {
                $label = PlatformData::toLabel($platform);
                $entry[$label] = 0;
            }
            
            $result[$key] = $entry;
        }

        // Fill actual profits
        foreach ($rows as $row) {
            $key   = sprintf('%04d-%02d', $row->year, $row->month_num);
            $label = PlatformData::toLabel($row->platform);
            if (isset($result[$key][$label])) {
                $result[$key][$label] = (int) ($row->profit ?? 0);
            }
        }

        return array_values($result);
    }


    /**
     * Fetch sales records with watch details and derived fields.
     */
    public function getSalesRecords(string $filter = 'all-time', array $filters = []): array
    {
        $query = Sale::query()
            ->join('watches', 'sales.watch_id', '=', 'watches.id')
            ->leftJoin('brands', 'watches.brand_id', '=', 'brands.id')
            ->select(
                'sales.id',
                'watches.name as watchName',
                'brands.name as brand',
                'watches.sku',
                'sales.price as salePrice',
                'watches.original_cost as acquisitionCost',
                DB::raw('ROUND((sales.price - COALESCE(watches.original_cost, 0)), 2) as profit'),
                DB::raw('ROUND(((sales.price - COALESCE(watches.original_cost, 0)) / sales.price * 100), 1) as profitMargin'),
                'sales.created_at as saleDate',
                'sales.platform',
                'sales.buyer_name as buyer',
                'sales.buyer_country as country',
                'sales.payment_method as paymentMethod',
                'sales.status'
            );

        // Apply date filter
        $query = $this->applyFilter($query, $filter);

        // Apply additional filters (e.g., platform, status)
        if (!empty($filters['platform']) && $filters['platform'] !== 'All') {
            $query->where('sales.platform', $filters['platform']);
        }
        if (!empty($filters['status']) && $filters['status'] !== 'All') {
            $query->where('sales.status', $filters['status']);
        }
        if (!empty($filters['search'])) {
            $searchTerm = strtolower($filters['search']);
            $query->where(function ($q) use ($searchTerm) {
                $q->where('watches.name', 'like', "%{$searchTerm}%")
                  ->orWhere('brands.name', 'like', "%{$searchTerm}%")
                  ->orWhere('watches.sku', 'like', "%{$searchTerm}%");
            });
        }

        // Order by sale date by default
        $query->orderBy('sales.created_at', 'desc');

        // Fetch and format results
        return $query->get()->map(function ($sale) {
            return [
                'id' => $sale->id,
                'watchName' => $sale->watchName,
                'brand' => $sale->brand,
                'sku' => $sale->sku,
                'salePrice' => (float) $sale->salePrice,
                'acquisitionCost' => (float) $sale->acquisitionCost,
                'profit' => (float) $sale->profit,
                'profitMargin' => (float) $sale->profitMargin,
                'saleDate' => $sale->saleDate->toDateString(),
                'platform' => $sale->platform,
                'buyer' => $sale->buyer,
                'country' => $sale->country,
                'paymentMethod' => $sale->paymentMethod,
                'status' => $sale->status,
            ];
        })->all();
    }
}
