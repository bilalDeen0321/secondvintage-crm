<?php

namespace App\Queries;

use App\Models\Sale;
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
            'last-6-months' => [$now->copy()->subMonths(6), $now->endOfDay()],
            'last-3-months' => [$now->copy()->subMonths(3), $now->endOfDay()],
            'last-30-days' => [$now->copy()->subDays(30), $now->endOfDay()],
            'last-7-days' => [$now->copy()->subDays(7), $now->endOfDay()],
            default => [null, null],
        };
    }

    protected function applyFilter($query, string $filter)
    {
        [$start, $end] = $this->getDateRange($filter);

        if ($start && $end) {
            return $query->whereBetween('created_at', [$start, $end]);
        }

        if ($start) {
            return $query->where('created_at', '>=', $start);
        }

        if ($end) {
            return $query->where('created_at', '<=', $end);
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
}
