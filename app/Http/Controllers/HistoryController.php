<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Queries\HistoryQuery;

class HistoryController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:salesHistory');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(HistoryQuery $query)
    {
        $filter = request()->input('filter', 'all-time');

        return Inertia::render('SalesHistory', [
            'filters' => $query->allFilters(),
            'totalSales' => $query->getTotalSales($filter),
            'totalRevenue' => $query->getTotalRevenue($filter),
            'totalProfit' => $query->getTotalProfit($filter),
            'avgProfitMargin' => $query->getAvgProfitMargin($filter),
            'monthlyData' => $query->getMonthlyRevenueProfit($filter),
            'profitPerPlatform' => $query->getProfitPerPlatform($filter),
            'monthlySalesCount' => $query->getMonthlySalesCount($filter),
            'salesByPlatform' => $query->getSalesByPlatform($filter),
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
