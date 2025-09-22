<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Queries\DashboardQuery;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:dashboard');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(DashboardQuery $query)
    {
        $filter = request()->input('filter', 'all-time');
        
        return Inertia::render('Dashboard', [
            'filters' => $query->allFilters(),
            'selectedFilter' => $filter,
            'metrics' => $query->getDashboardMetrics($filter),
            'recentActivity' => $query->getRecentActivity($filter),
            'brands_profit' => $query->getTopBrandsByProfit($filter),
            'profitable_countries' => $query->getTopProfitableCountries($filter),
            'revenueData' => $query->getRevenueData($filter),
            'watchInventoryBrandDistribution' => $query->getWatchInventoryByBrand($filter),
            'watchesSoldPerMonth' => $query->getWatchesSoldPerMonth($filter),
            'platformSalesDistribution' => $query->getSalesByPlatform($filter),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
