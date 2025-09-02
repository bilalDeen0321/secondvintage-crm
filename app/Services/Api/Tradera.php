<?php


namespace App\Services\Api;

use App\Packages\Utils\Traits\CreateInstance;

class Tradera
{
    use CreateInstance;


    protected int $appId;
    protected string $appKey;
    protected string $userId;
    protected string $token;
    protected int $sandbox;

    protected string $public_key;
    protected string $service_key;

    /**
     * Create the service instance.
     */
    public function __construct()
    {
        $this->appId = config('services.tradera.app_id');
        $this->appKey = config('services.tradera.app_key');
        $this->userId = config('services.tradera.user_id');
        $this->token = config('services.tradera.token');
        $this->sandbox = config('services.tradera.sandbox', 0); // 1 = sandbox, 0 = live

        $this->public_key = config('services.tradera.public_key');
    }


    /**
     * Get Tradera user login url
     */
    public function getAuthorizationUrl()
    {
        $appId = $this->appId; // Application Id
        $publicKey = $this->public_key; // Public key
        $sandbox = 1; // Sandbox = 1 for <testing></testing>
        $url = "https://api.tradera.com/tokenlogin.aspx?appId={$appId}&pkey={$publicKey}&sandbox={$sandbox}";
        return $url;
    }

    /**
     * Handle Tradera callback
     */
    public function handleCallback($request)
    {
        // Log the received data
        \App\Models\Log::info('Tradera-Webhook-Received', 'data', json_encode($request->all()));
        return $request->all();
    }


    /**
     * Search items on Tradera
     */
    public function getSearchResutls()
    {

        // WSDL URL for PublicService
        $wsdl = 'https://api.tradera.com/v3/PublicService.asmx?WSDL';

        // SOAP Headers
        $authHeader = new \SoapHeader('http://api.tradera.com', 'AuthenticationHeader', [
            'AppId' => $this->appId,
            'AppKey' => $this->appKey
        ]);

        $configHeader = new \SoapHeader('http://api.tradera.com', 'ConfigurationHeader', [
            'Sandbox' => $this->sandbox,
            'MaxResultAge' => 0
        ]);

        $client = new \SoapClient($wsdl, [
            'trace' => 1,
            'exceptions' => true,
        ]);

        // Attach headers
        $client->__setSoapHeaders([$authHeader, $configHeader]);

        // Parameters for GetSearchResult
        $params = [
            'query' => 'rolex',
            'categoryId' => 1000985,
            'pageNumber' => 1,
            'orderBy' => 'PriceDescending'
        ];

        // Make the SOAP call
        $response = $client->__soapCall('GetSearchResult', [$params]);

        // Convert result to array
        $result = json_decode(json_encode($response), true);

        file_put_contents(base_path('/docs/data/tradera-search.json'), json_encode($result, JSON_PRETTY_PRINT));

        return $result;
    }

    /**
     * Add a watch item to Tradera shop
     */
    public function addItem()
    {
        $appId = $this->appId;
        $appKey = $this->appKey;
        $userId = $this->userId;
        $token = $this->token;
        $sandbox = $this->sandbox; // 1 = sandbox, 0 = live

        $soapRequest = <<<XML
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <AuthenticationHeader xmlns="http://api.tradera.com">
      <AppId>$appId</AppId>
      <AppKey>$appKey</AppKey>
    </AuthenticationHeader>
    <AuthorizationHeader xmlns="http://api.tradera.com">
      <UserId>$userId</UserId>
      <Token>$token</Token>
    </AuthorizationHeader>
    <ConfigurationHeader xmlns="http://api.tradera.com">
      <Sandbox>0</Sandbox>
      <MaxResultAge>0</MaxResultAge>
    </ConfigurationHeader>
  </soap:Header>
  <soap:Body>
    <AddItem xmlns="http://api.tradera.com">
      <itemRequest>
        <Title>Test created by saeed</Title>
        <CategoryId>1000985</CategoryId>
        <Duration>14</Duration>
        <StartPrice>574900</StartPrice>
        <BuyItNowPrice>574900</BuyItNowPrice>
        <Description>Vi säljer en Rolex Day-Date 40 …</Description>
        <PaymentOptionIds>
          <int>1</int>
        </PaymentOptionIds>
        <ShippingOptions>
          <ItemShipping>
            <ShippingOptionId>6</ShippingOptionId>
            <ShippingProviderId>6</ShippingProviderId>
            <Cost>0</Cost>
            <ShippingWeight>0</ShippingWeight>
            <ShippingProductId>0</ShippingProductId>
          </ItemShipping>
        </ShippingOptions>
        <ItemType>2</ItemType>
        <AutoCommit>true</AutoCommit>
        <DescriptionLanguageCodeIso2>sv</DescriptionLanguageCodeIso2>
      </itemRequest>
    </AddItem>
  </soap:Body>
</soap:Envelope>
XML;

        $ch = curl_init('https://api.tradera.com/v3/RestrictedService.asmx');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: text/xml; charset=utf-8',
            'SOAPAction: "http://api.tradera.com/AddItem"'
        ]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $soapRequest);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);


        dd($ch);
    }
}
