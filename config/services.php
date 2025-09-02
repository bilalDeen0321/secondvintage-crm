<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /**
     * Make.com config
     */
    'make_hook' => [
        'url' => env('MAKE_HOOK_URL', 'https://hook.eu2.make.com/hryg6tsac65fa8ad15b0yap6pw7vhtn2'),
        'key' => env('MAKE_HOOK_KEY', 'phm_4h9s8fdA27kLmEwQPz3XvYtB60NcUgT1'),
    ],

    'tradera' => [
        'endpoint' => 'https://api.tradera.com/v3',
        'app_id' => (int)  env('TRADERA_APP_ID'),
        'app_key' => (string) env('TRADERA_APP_KEY'),
        'user_id' =>  (int) env('TRADERA_USER_ID'),
        'token' => (string) env('TRADERA_TOKEN'),
        'sandbox' => (int) env('TRADERA_SANDBOX', 0),

        //aditional for auth token fetch
        'public_key' => (string) env('TRADERA_PUBLIC_KEY'), // for fetching token
    ],

];
