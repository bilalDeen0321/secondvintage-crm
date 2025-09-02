<?php

namespace App\Services\Api;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Exception;

class TraderaApiExtended
{
    private $appId;
    private $appKey;
    private $userId;
    private $token;
    private $apiUrl;

    /**
     * Create the service instance.
     */
    public function __construct()
    {
        $this->appId = config('services.tradera.app_id');
        $this->appKey = config('services.tradera.app_key');
        $this->userId = config('services.tradera.user_id');
        $this->token = config('services.tradera.token');
        $this->apiUrl = 'https://api.tradera.com/v3/orderservice.asmx';
    }

    public function privateClient()
    {
        $client = new \SoapClient("https://api.tradera.com/v3/RestrictedService.asmx?WSDL");

        // Add headers (Authentication + Authorization)
        $headers = [
            new \SoapHeader("http://api.tradera.com", "AuthenticationHeader", [
                'AppId' => $this->appId,
                'AppKey' => $this->appKey
            ]),
            new \SoapHeader("http://api.tradera.com", "AuthorizationHeader", [
                'UserId' => $this->userId,
                'Token'  => $this->token
            ]),
            new \SoapHeader("http://api.tradera.com", "ConfigurationHeader", [
                'Sandbox' => 0,        // 0 = live, 1 = sandbox
                'MaxResultAge' => 1000
            ]),
        ];

        return $client->__setSoapHeaders($headers);
    }

    /**
     * Convert currency using session exchange rates
     */
    public function convertCurrency($amount, $currency)
    {
        $exchangeRates = session('exchange_rates', []);

        if (isset($exchangeRates[$currency]) && $exchangeRates[$currency] != 0) {
            return $amount / $exchangeRates[$currency];
        }

        return false;
    }

    /**
     * Sync orders from Tradera API
     */
    public function syncOrders()
    {
        try {
            $fromDate = $this->getLastSyncTime();
            $toDate = now()->toISOString();

            $orders = $this->getSellerOrders($fromDate, $toDate);

            if (empty($orders)) {
                return ['success' => true, 'message' => 'No new orders found'];
            }

            $processedCount = $this->processOrders($orders);

            return [
                'success' => true,
                'message' => "Processed {$processedCount} orders successfully"
            ];
        } catch (Exception $e) {
            Log::error('Tradera sync failed: ' . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Get last sync time from database
     * If no record, default to 17 days ago
     * Return in ISO 8601 format with timezone
     */
    private function getLastSyncTime()
    {
        $syncRecord = DB::table('tradera_sync_time')
            ->where('tst_id', 1)
            ->where('close', 1)
            ->where('status', 1)
            ->first();

        if (!$syncRecord) {
            return Carbon::now()->subDays(17)->toISOString();
        }

        $fromDate = Carbon::parse($syncRecord->tst_sync_time)
            ->subHours(2);

        return $fromDate->format('Y-m-d\TH:i:s.v') . $fromDate->format('P');
    }


    /**
     * Fetch seller orders from Tradera API
     */
    private function getSellerOrders($fromDate, $toDate)
    {
        $soapRequest = $this->buildSoapRequest($fromDate, $toDate);

        $response = Http::withHeaders([
            'Content-Type' => 'text/xml; charset=utf-8',
            'SOAPAction' => '"http://api.tradera.com/GetSellerOrders"'
        ])->withBody($soapRequest, 'text/xml')
            ->post($this->apiUrl);

        if (!$response->successful()) {
            throw new Exception('API request failed: ' . $response->status());
        }

        return $this->parseOrdersResponse($response->body());
    }


    /**
     * Build SOAP request XML
     */
    private function buildSoapRequest($fromDate, $toDate)
    {
        return <<<XML
                <?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                            xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Header>
                    <AuthenticationHeader xmlns="http://api.tradera.com">
                    <AppId>{$this->appId}</AppId>
                    <AppKey>{$this->appKey}</AppKey>
                    </AuthenticationHeader>
                    <AuthorizationHeader xmlns="http://api.tradera.com">
                    <UserId>{$this->userId}</UserId>
                    <Token>{$this->token}</Token>
                    </AuthorizationHeader>
                    <ConfigurationHeader xmlns="http://api.tradera.com">
                    <Sandbox>0</Sandbox>
                    <MaxResultAge>0</MaxResultAge>
                    </ConfigurationHeader>
                </soap:Header>
                <soap:Body>
                    <GetSellerOrders xmlns="http://api.tradera.com">
                    <request>
                        <FromDate>{$fromDate}</FromDate>
                        <ToDate>{$toDate}</ToDate>
                        <QueryDateMode>CreatedDate</QueryDateMode>
                    </request>
                    </GetSellerOrders>
                </soap:Body>
                </soap:Envelope>
                XML;
    }


    /**
     * Parse SOAP response and extract orders
     */
    private function parseOrdersResponse($response)
    {
        $xml = simplexml_load_string($response);
        $xml->registerXPathNamespace('soap', 'http://schemas.xmlsoap.org/soap/envelope/');
        $xml->registerXPathNamespace('ns', 'http://api.tradera.com');

        $result = $xml->xpath('//ns:GetSellerOrdersResult');

        if (empty($result)) {
            return [];
        }

        $array = json_decode(json_encode($result[0]), true);
        $sellerOrders = $array['SellerOrders'] ?? [];

        if (empty($sellerOrders)) {
            return [];
        }

        $orders = $sellerOrders['SellerOrder'] ?? [];

        // Handle single order case
        if (isset($orders['OrderId'])) {
            $orders = [$orders];
        }

        return $orders;
    }

    private function processOrders($orders)
    {
        $processedCount = 0;
        $lastOrderTime = null;

        foreach ($orders as $order) {
            if ($this->processOrder($order)) {
                $processedCount++;
                $lastOrderTime = $order['CreatedDate'];
            }
        }

        if ($lastOrderTime) {
            $this->updateSyncTime($lastOrderTime);
        }

        return $processedCount;
    }


    /**
     * Process individual order
     */
    private function processOrder($order)
    {
        $item = $order['Items']['SellerOrderItem'];

        if (!isset($item['OwnReferences']['string'])) {
            return false;
        }

        $skuCode = $item['OwnReferences']['string'];
        $watch = $this->findWatchBySku($skuCode);

        if (!$watch) {
            return false;
        }

        DB::beginTransaction();

        try {
            // Mark watch as sold
            DB::table('watches')
                ->where('w_id', $watch->w_id)
                ->update(['sold_status' => 1]);

            // Create sale record
            $convertedPrice = $this->convertCurrency($item['UnitPrice'], 'SEK');
            $saleDate = Carbon::parse($order['CreatedDate'])->addSecond();

            DB::table('sale')->insert([
                'w_id' => $watch->w_id,
                'customer_name' => $order['ShipTo']['Name'],
                's_currency' => 'SEK',
                's_currency_price' => $item['UnitPrice'],
                's_converted_price' => $convertedPrice,
                'sale_date' => $saleDate->format('Y-m-d H:i:s.v'),
                'created_by' => 1
            ]);

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Failed to process order: ' . $e->getMessage());
            return false;
        }
    }

    private function findWatchBySku($skuCode)
    {
        return DB::table('watches')
            ->where('bar_code', $skuCode)
            ->where('close', 1)
            ->where('status', 1)
            ->first();
    }

    private function updateSyncTime($lastOrderTime)
    {
        $dateObj = Carbon::parse($lastOrderTime)->addSecond();
        $mysqlDatetime = $dateObj->format('Y-m-d H:i:s.v');

        DB::table('tradera_sync_time')
            ->where('tst_id', 1)
            ->update(['tst_sync_time' => $mysqlDatetime]);
    }
}
