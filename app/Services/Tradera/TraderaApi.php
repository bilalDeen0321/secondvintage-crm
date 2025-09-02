<?php

namespace App\Services\Tradera;

use App\Models\Watch;
use App\Packages\Utils\Traits\CreateInstance;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use SoapClient;
use Exception;

class TraderaApi
{
    use CreateInstance;

    protected $client;

    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $wsdl = "https://api.tradera.com/v3/RestrictedService.asmx?WSDL";

        $this->client = new SoapClient($wsdl, [
            'trace' => 1,
            'exceptions' => true,
        ]);
    }


    /**
     * Add a watch item to Tradera shop
     */
    public function addShopItem(array $shopItemData)
    {
        try {
            $headers = [
                new \SoapHeader("http://api.tradera.com", "AuthenticationHeader", [
                    "AppId"  => config('services.tradera.app_id'),
                    "AppKey" => config('services.tradera.app_key'),
                ]),
                new \SoapHeader("http://api.tradera.com", "AuthorizationHeader", [
                    "UserId" => config('services.tradera.user_id'),
                    "Token"  => config('services.tradera.token'),
                ]),
                new \SoapHeader("http://api.tradera.com", "ConfigurationHeader", [
                    "Sandbox"      => 0,   // 1 = sandbox, 0 = live
                    "MaxResultAge" => 60,
                ]),
            ];

            $this->client->__setSoapHeaders($headers);

            $response = $this->client->AddShopItem([
                "shopItemData" => $shopItemData
            ]);

            return $response;
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
