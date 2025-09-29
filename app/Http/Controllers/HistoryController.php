<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Queries\HistoryQuery;
use Maatwebsite\Excel\Facades\Excel; // if you use maatwebsite/excel
use Carbon\Carbon;
use App\Models\Sale;
use App\Models\Watch;
use Illuminate\Database\QueryException;

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
     * Import data from csv file.
     */

    public function import(Request $request)
    { 
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
        ]);

        $path = $request->file('file')->getRealPath();
        $rows = \PhpOffice\PhpSpreadsheet\IOFactory::load($path)
                    ->getActiveSheet()
                    ->toArray(null, true, true, true);

        $header = array_shift($rows); // remove headers
        $errors = [];
        $inserted = 0; 
        foreach ($rows as $i => $row) {
            
            try {
                $sku = $row['C']; // Reference label
                $customer = trim(($row['T'] ?? '') . ' ' . ($row['Company name'] ?? ''));
                $country = $row['AC'] ?? null;
                $salePrice =  $salePrice = (float) preg_replace('/[^\d.-]/', '', $row['AK'] ?? 0);
                $orderDate = !empty($row['P']) ? Carbon::parse($row['P']) : null; 
                 
                if (!$sku || !$salePrice) {
                $errors[] = "Row ".($i+2).": Missing SKU or Sale Price";
                continue;
                }

                $watch = Watch::where('sku', $sku)->whereNot('status', 'sold')->first();
                 if (!$watch) {
                    $errors[] = "Row ".($i+2).": Watch not found for SKU {$sku}";
                    continue;
                }
 
                // Example: using fixed EUR for now, later integrate currency API
                $currency = "EUR";
                $rate = (float) 1.0; 
                $salePriceEuro = $salePrice * $rate;
                // ---- Profit Calculation ----
                $costEuro = $watch->current_cost ?? 0;
                $profit   = $salePriceEuro - $costEuro;

                $salesArray  = [
                    'watch_id' => $watch->id, 
                    'buyer_country' => $country,
                    'original_price' => $salePrice,
                    'currency' => $currency,
                    // Catawiki fields
                    'catawiki_object_number'   => $row['Object number'] ?? null,
                    'catawiki_invoice_number'  => $row['Invoice number'] ?? null,
                    'catawiki_invoice_url'     => $row['Commission invoice URL'] ?? null,
                    // Shipping cost fields
                    'shipping_cost_original'   => $row['Shipping costs'] ?? null,
                    'shipping_cost_currency'   => $row['Shipping currency'] ?? 'EUR',
                    'shipping_cost_currency_rate' => 1.0, // TODO: integrate currency API
                    'shipping_cost_euro'       => $row['Shipping costs'] ?? null,
                    // Profit
                    'profit_converted'         => $profit,  // sale_price_euro - cost_euro
                    // Sale price in EUR
                    'price'                    => $salePrice * $rate,
                    // Buyer details
                    'buyer_name'               => $customer,
                    'buyer_email'              => $row['Email'] ?? null,
                    'buyer_address'            => trim(($row['Address 1'] ?? '').' '.($row['Address 2'] ?? '').' '.($row['Address 3'] ?? '')),
                    'buyer_city'               => $row['City'] ?? null, 
                    'buyer_postal_code'        => $row['Postal code'] ?? null,
                    'buyer_iso_code'           => $row['ISO code'] ?? null,
                     'sold_by'                 => 1,
                ]; 
                Sale::create($salesArray);
                $watch->status = 'sold';
                $watch->save();

                $inserted++;
            } catch (\Exception $e) { 
                $errors[] = "Row ".($i+2).": ".$e->getMessage();
            }
        } 
        return response()->json([
            'success' => "Imported {$inserted} sales successfully",
            'errorsList' => $errors,
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
