<?php

namespace App\Jobs;

use App\Models\Watch;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AddTraderaWatchItemJob implements ShouldQueue
{
    use Queueable;

    protected $watch;
    protected $userId;
    protected $token;

    /**
     * Create a new job instance.
     */
    public function __construct(Watch $watch, int $userId, string $token)
    {
        $this->watch = $watch;
        $this->userId = $userId;
        $this->token = $token;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $appId  = config('services.tradera.app_id');
        $appKey = config('services.tradera.app_key');

        // Build the ShopItemData XML
        $item = $this->watch;
        $soapBody = <<<XML
                    <?xml version="1.0" encoding="utf-8"?>
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                                xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Header>
                        <AuthenticationHeader xmlns="http://api.tradera.com">
                        <AppId>{$appId}</AppId>
                        <AppKey>{$appKey}</AppKey>
                        </AuthenticationHeader>
                        <AuthorizationHeader xmlns="http://api.tradera.com">
                        <UserId>{$this->userId}</UserId>
                        <Token>{$this->token}</Token>
                        </AuthorizationHeader>
                        <ConfigurationHeader xmlns="http://api.tradera.com">
                        <Sandbox>1</Sandbox>
                        <MaxResultAge>0</MaxResultAge>
                        </ConfigurationHeader>
                    </soap:Header>
                    <soap:Body>
                        <AddShopItem xmlns="http://api.tradera.com">
                        <shopItemData>
                            <ActivateDate>{$item->created_at->toIso8601ZuluString()}</ActivateDate>
                            <CategoryId>{$item->category_id}</CategoryId>
                            <Title>{$item->name}</Title>
                            <Description>{$item->description}</Description>
                            <Price>{$item->current_cost}</Price>
                            <Quantity>{$item->quantity}</Quantity>
                        </shopItemData>
                        </AddShopItem>
                    </soap:Body>
                    </soap:Envelope>
                    XML;

        $response = Http::withHeaders([
            'Content-Type' => 'text/xml; charset=utf-8',
            'SOAPAction'   => 'http://api.tradera.com/AddShopItem',
        ])->post('https://api.tradera.com/v3/RestrictedService.asmx', $soapBody);

        if ($response->successful()) {
            $xml = simplexml_load_string($response->body());
            $ns = $xml->getNamespaces(true);
            $body = $xml->children($ns['soap'])->Body;
            $resp = $body->children()->AddShopItemResponse->AddShopItemResult;
            $requestId = (string) $resp->RequestId;
            $itemId    = (string) $resp->ItemId;

            // Save to your watch model or log
            $item->update([
                'tradera_request_id' => $requestId,
                'tradera_item_id'    => $itemId,
                'tradera_status'     => 'pending',
            ]);

            // Optionally dispatch a job to poll GetRequestResults
        } else {
            $status = $response->status();
            // Handle rate-limiting or errors
            if ($status == 429) {
                $this->release(now()->addSeconds(300)); // Retry after delay
            } else {
                // Log error
                Log::error('Tradera AddShopItem failed', [
                    'watch_id' => $item->id,
                    'status'   => $status,
                    'body'     => $response->body(),
                ]);
            }
        }
    }
}
