<?php

namespace App\Actions\Platform;

use App\Models\Status;
use App\Packages\Utils\Traits\CreateInstance;
use App\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class ExtractMakeHookToCatawiki
{

    /**
     * Invoke the class instance.
     */
    public static function execute(Collection $data)
    {
        return [
            [
                'field' => 'Status',
                'value' => $data->get('Status_Selected', Status::DRAFT),
                'type' => 'select',
                'options' => Arr::map(Status::allStatuses(), fn($status) => Str::title($status))
            ],
            [
                'field' => 'Description',
                'value' => $data->get('Description', ''),
                'type' => 'textarea'
            ],
            [
                'field' => 'Catawiki - Your Reference Number (optional)',
                'value' => $data->get('Catawiki_Your_Reference_Number', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Your Reference Colour (optional)',
                'value' => $data->get('Catawiki_Your_Reference_Colour', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Auction Type (333) (optional)',
                'value' => $data->get('Catawiki_Auction_Type', '333'),
                'type' => 'select',
                'options' => [
                    '333',
                    '334',
                    '335'
                ]
            ],
            [
                'field' => 'Catawiki - Object type (18127)',
                'value' => $data->get('Catawiki_Object_Type', '18127'),
                'type' => 'select',
                'options' => [
                    '18127',
                    '18128',
                    '18129'
                ]
            ],
            [
                'field' => 'Catawiki - Language',
                'value' => $data->get('Catawiki_Language', 'English'),
                'type' => 'select',
                'options' => [
                    'English',
                    'Dutch',
                    'German',
                    'French'
                ]
            ],
            [
                'field' => 'Catawiki - Description',
                'value' => '',
                'type' => 'textarea'
            ],
            [
                'field' => 'Catawiki - D: Brand',
                'value' => $data->get('Catawiki_Brand', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: Model (optional)',
                'value' => $data->get('Catawiki_Model', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: Reference Number (optional)',
                'value' => $data->get('Catawiki_Reference_Number', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: Shipped Insured',
                'value' => $data->get('Catawiki_Shipped_Insured', 'Yes'),
                'type' => 'select',
                'options' => [
                    'Yes',
                    'No'
                ]
            ],
            [
                'field' => 'Catawiki - D: Period',
                'value' => $data->get('Catawiki_Period', '2020s'),
                'type' => 'select',
                'options' => [
                    '1950s',
                    '1960s',
                    '1970s',
                    '1980s',
                    '1990s',
                    '2000s',
                    '2010s',
                    '2020s'
                ]
            ],
            [
                'field' => 'Catawiki - D: Movement',
                'value' => $data->get('Catawiki_Movement_type', 'Automatic'),
                'type' => 'select',
                'options' => [
                    'Automatic',
                    'Manual',
                    'Quartz'
                ]
            ],
            [
                'field' => 'Catawiki - D: Case material',
                'value' => $data->get('Catawiki_Case_material', 'Stainless Steel'),
                'type' => 'select',
                'options' => [
                    'Stainless Steel',
                    'Gold',
                    'Rose Gold',
                    'Titanium',
                    'Ceramic'
                ]
            ],
            [
                'field' => 'Catawiki - D: Case diameter',
                'value' => $data->get('Catawiki_Case_diameter', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: Condition',
                'value' => $data->get('Catawiki_Condition', 'Very Good'),
                'type' => 'select',
                'options' => [
                    'New',
                    'Very Good',
                    'Good',
                    'Fair',
                    'Poor'
                ]
            ],
            [
                'field' => 'Catawiki - D: Gender',
                'value' => $data->get('Catawiki_Gender', 'Men'),
                'type' => 'select',
                'options' => [
                    'Men',
                    'Women',
                    'Unisex'
                ]
            ],
            [
                'field' => 'Catawiki - D: Band material',
                'value' => $data->get('Catawiki_Band_material', 'Stainless Steel'),
                'type' => 'select',
                'options' => [
                    'Stainless Steel',
                    'Leather',
                    'Rubber',
                    'Gold',
                    'Ceramic'
                ]
            ],
            [
                'field' => 'Catawiki - D: Band length (optional)',
                'value' => $data->get('Catawiki_Band length', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: Repainted dial',
                'value' => $data->get('Catawiki_Repainted_Dial', 'No'),
                'type' => 'select',
                'options' => [
                    'Yes',
                    'No'
                ]
            ],
            [
                'field' => 'Catawiki - D: Dial colour (optional)',
                'value' => $data->get('Catawiki_Dial_colour', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: Original box included',
                'value' => $data->get('Catawiki_Original_box_included', 'No'),
                'type' => 'select',
                'options' => [
                    'Yes',
                    'No'
                ]
            ],
            [
                'field' => 'Catawiki - D: Original papers included',
                'value' => $data->get('Catawiki_Original_papers_included', 'No'),
                'type' => 'select',
                'options' => [
                    'Yes',
                    'No'
                ]
            ],
            [
                'field' => 'Catawiki - D: Original warranty included',
                'value' => $data->get('Catawiki_Original_warranty_included', 'No'),
                'type' => 'select',
                'options' => [
                    'Yes',
                    'No'
                ]
            ],
            [
                'field' => 'Catawiki - D: Year (optional)',
                'value' => $data->get('Catawiki_Year', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: Weight',
                'value' => $data->get('Catawiki_Weight', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: Width lug/ watch band',
                'value' => $data->get('Catawiki_Width_lug_watch_band', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: In working order (optional)',
                'value' => $data->get('Catawiki_In_working_order', ''),
                'type' => 'select',
                'options' => [
                    'Yes',
                    'No'
                ]
            ],
            [
                'field' => 'Catawiki - Public photo URL',
                'value' => '',
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Estimated lot value',
                'value' => $data->get('Catawiki_Estimated_lot_value', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Reserve price (optional)',
                'value' => $data->get('Catawiki_Reserve_price', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Start bidding from (optional)',
                'value' => $data->get('Catawiki_Start_bidding_from', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Pick up (optional)',
                'value' => $data->get('Catawiki_Pick_up', 'No'),
                'type' => 'select',
                'options' => [
                    'Yes',
                    'No'
                ]
            ],
            [
                'field' => 'Catawiki - Combined shipping (optional)',
                'value' => $data->get('Catawiki_Combined_shipping', 'No'),
                'type' => 'select',
                'options' => ['Yes', 'No']
            ],
            [
                'field' => 'Catawiki - Shipping costs',
                'value' => $data->get('Catawiki_Shipping_Cost', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Shipping costs - Europe',
                'value' => $data->get('Catawiki_Shipping_Cost_Europe', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Shipping costs - Rest of World',
                'value' => $data->get('Catawiki_Shipping_Cost_Rest_of_World', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Country specific shipping price (optional)',
                'value' => $data->get('Catawiki_Country_specific_shipping_price', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Shipping profile (optional)',
                'value' => $data->get('Catawiki_Shipping_Shipping_profile', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Message to Expert (optional)',
                'value' => $data->get('Catawiki_Shipping_Message_to_Expert', ''),
                'type' => 'textarea'
            ]
        ];
    }
}
