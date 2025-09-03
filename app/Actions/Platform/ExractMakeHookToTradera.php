<?php

namespace App\Actions\Platform;

use App\Models\Status;
use App\Models\Watch;
use App\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Sleep;

class ExractMakeHookToTradera
{
    /**
     * Invoke the class instance.
     */
    public static function execute(Collection $data, Watch $watch): array
    {
        Sleep::for(3)->seconds();

        return [
            [
                'field' => 'Status',
                'value' => $data->get('Status_Selected', $watch->status),
                'type' => 'select',
                'options' => Arr::map(Status::allStatuses(), fn($status) => Str::title($status))
            ],
            [
                'field' => 'Description',
                'value' => $data->get('Description', $watch->description),
                'type' => 'textarea'
            ],
            [
                'field' => 'Name',
                'value' => $data->get('Name', $watch->name),
                'type' => 'input'
            ],
            [
                'field' => 'SKU',
                'value' => $data->get('SKU', $watch->sku),
                'type' => 'input'
            ],
            [
                'field' => 'Brand',
                'value' => $data->get('Brand', $watch->brand),
                'type' => 'input'
            ],
            [
                'field' => 'Location',
                'value' => $data->get('Location', $watch->location),
                'type' => 'input'
            ],
            [
                'field' => 'Buy It Now Price',
                'value' => $data->get('Buy_It_Now_Price', $watch->current_cost),
                'type' => 'number'
            ],
            [
                'field' => 'Starting Bid',
                'value' => $data->get('Starting_Bid', ''),
                'type' => 'number'
            ],
            [
                'field' => 'Listing Duration',
                'value' => $data->get('Listing_Duration', '10 days'),
                'type' => 'select',
                'options' => [
                    '3 days',
                    '5 days',
                    '7 days',
                    '10 days'
                ]
            ],
            [
                'field' => 'Payment Methods',
                'value' => $data->get('Payment_Methods', 'PayPal, Bank Transfer'),
                'type' => 'input'
            ],
            [
                'field' => 'Shipping Cost',
                'value' => $data->get('Shipping_Cost', ''),
                'type' => 'number'
            ],
            [
                'field' => 'Listing Fee',
                'value' => $data->get('Listing_Fee', ''),
                'type' => 'number'
            ],
            [
                'field' => 'Final Value Fee',
                'value' => $data->get('Final_Value_Fee', '8%'),
                'type' => 'input'
            ],
            [
                'field' => 'Category ID',
                'value' => $data->get('Category_ID', '1234567'),
                'type' => 'input'
            ]
        ];
    }
}
