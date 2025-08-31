<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Watch;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class SalesHistoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:salesHistory');
    }

    public function index(Request $request)
    {
        $query = Sale::with(['watch', 'creator'])
            ->orderBy('sale_date', 'desc');

        // Apply filters
        if ($request->filled('from_date')) {
            $query->whereDate('sale_date', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('sale_date', '<=', $request->to_date);
        }

        if ($request->filled('platform') && $request->platform !== 'All') {
            $query->where('platform', $request->platform);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('watch', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        $sales = $query->paginate(50);

        // Calculate statistics
        $stats = [
            'total_sales' => $sales->total(),
            'total_revenue' => Sale::sum('sale_converted_price'),
            'total_profit' => $this->calculateTotalProfit(),
            'platform_breakdown' => $this->getPlatformBreakdown()
        ];

        return Inertia::render('SalesHistory/Index', [
            'sales' => $sales,
            'stats' => $stats,
            'filters' => $request->only(['from_date', 'to_date', 'platform', 'search'])
        ]);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        try {
            $file = $request->file('file');
            $spreadsheet = IOFactory::load($file->getPathname());
            $sheet = $spreadsheet->getActiveSheet();
            $data = $sheet->toArray();

            // Skip header row
            unset($data[0]);

            $insertedRows = 0;
            $skippedRows = 0;

            foreach ($data as $row) {
                $skuCode = $row[2] ?? null;
                $buyerName = $row[19] ?? null;
                $salePrice = preg_replace('/[^\d.]/', '', $row[36] ?? '0');
                $saleDate = $row[11] ?? null;

                if (!$skuCode || !$saleDate || strtotime($saleDate) === false) {
                    $skippedRows++;
                    continue;
                }

                // Find watch by SKU
                $watch = Watch::where('sku', $skuCode)
                    ->where('sold_status', 0)
                    ->first();

                if ($watch) {
                    // Mark watch as sold
                    $watch->update(['sold_status' => 1]);

                    // Create sale record
                    Sale::create([
                        'watch_id' => $watch->id,
                        'customer_name' => $buyerName,
                        'sale_currency' => 'EUR',
                        'sale_currency_price' => $salePrice,
                        'sale_converted_price' => $salePrice,
                        'sale_date' => Carbon::parse($saleDate),
                        'platform' => 'Catawiki',
                        'created_by' => Auth::id()
                    ]);

                    $insertedRows++;
                } else {
                    $skippedRows++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "{$insertedRows} sales imported successfully, {$skippedRows} skipped (SKU not found)",
                'inserted' => $insertedRows,
                'skipped' => $skippedRows
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function export(Request $request): JsonResponse
    {
        // Implementation for CSV export
        $query = Sale::with(['watch'])
            ->orderBy('sale_date', 'desc');

        // Apply same filters as index
        if ($request->filled('from_date')) {
            $query->whereDate('sale_date', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('sale_date', '<=', $request->to_date);
        }

        if ($request->filled('platform') && $request->platform !== 'All') {
            $query->where('platform', $request->platform);
        }

        $sales = $query->get();

        $csvData = [];
        $csvData[] = [
            'Invoice No',
            'Sale Date',
            'Customer',
            'SKU Code',
            'Watch Name',
            'Platform',
            'Purchase Price',
            'Sale Price',
            'Profit',
            'Profit Margin %'
        ];

        foreach ($sales as $sale) {
            $csvData[] = [
                $sale->invoice_number,
                $sale->sale_date->format('Y-m-d'),
                $sale->customer_name,
                $sale->watch->sku ?? '',
                $sale->watch->name ?? '',
                $sale->platform,
                number_format($sale->watch->acquisition_cost ?? 0, 2),
                number_format($sale->sale_converted_price, 2),
                number_format($sale->profit, 2),
                number_format($sale->profit_margin, 2)
            ];
        }

        $filename = 'sales_export_' . now()->format('Y-m-d_H-i-s') . '.csv';
        $filePath = storage_path('app/public/' . $filename);

        $fp = fopen($filePath, 'w');
        foreach ($csvData as $row) {
            fputcsv($fp, $row);
        }
        fclose($fp);

        return response()->json([
            'success' => true,
            'download_url' => asset('storage/' . $filename)
        ]);
    }

    private function calculateTotalProfit(): float
    {
        return Sale::with('watch')
            ->get()
            ->sum(function ($sale) {
                return $sale->profit;
            });
    }

    private function getPlatformBreakdown(): array
    {
        return Sale::selectRaw('platform, COUNT(*) as count, SUM(sale_converted_price) as revenue')
            ->groupBy('platform')
            ->get()
            ->toArray();
    }
}
