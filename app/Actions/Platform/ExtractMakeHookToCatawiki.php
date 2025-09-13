<?php

namespace App\Actions\Platform;

use App\Models\Status;
use App\Models\Watch;
use App\Services\PlatformOption;
use App\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class ExtractMakeHookToCatawiki
{

    /**
     * Invoke the class instance.
     */
    public static function execute(Watch $watch, Collection $data)
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
                'value' => $data->get('Description', $watch->description),
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
                'type' => 'select',
                'options' => PlatformOption::external_reference_colour()
            ],
            [
                'field' => 'Catawiki - Auction Type (333) (optional)',
                'value' => $data->get('Catawiki_Auction_Type', ''),
                'type' => 'select',
                'options' => PlatformOption::auction_type()
            ],
            [
                'field' => 'Catawiki - Object type (18127)',
                'value' => $data->get('Catawiki_Object_Type', 'Watch'),
                'type' => 'select',
                'options' => PlatformOption::object_types()
            ],
            [
                'field' => 'Catawiki - Language',
                'value' => $data->get('Catawiki_Language', 'English'),
                'type' => 'select',
                'options' => PlatformOption::language()
            ],
            [
                'field' => 'Catawiki - Description',
                'value' => $data->get('Description', $watch->description),
                'type' => 'textarea'
            ],
            [
                'field' => 'Catawiki - D: Brand',
                'value' => $data->get('Catawiki_Brand'),
                'type' => 'select',
                'options' => PlatformOption::d_brand()
            ],
            [
                'field' => 'Catawiki - D: Model (optional)',
                'value' => $data->get('Catawiki_Model', ''),
                'type' => 'select',
                'options' => PlatformOption::d_model()
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
                'options' => ['Yes', 'No']
            ],
            [
                'field' => 'Catawiki - D: Period',
                'value' => $data->get('Catawiki_Period', ''),
                'type' => 'select',
                'options' => PlatformOption::d_period()
            ],
            [
                'field' => 'Catawiki - D: Movement',
                'value' => $data->get('Catawiki_Movement_type', 'Automatic'),
                'type' => 'select',
                'options' => PlatformOption::d_movement()
            ],
            [
                'field' => 'Catawiki - D: Case material',
                'value' => $data->get('Catawiki_Case_material'),
                'type' => 'select',
                'options' => PlatformOption::d_case_material()
            ],
            [
                'field' => 'Catawiki - D: Case diameter',
                'value' => $data->get('Catawiki_Case_diameter', ''),
                'type' => 'select',
                'options' => PlatformOption::d_case_diameter()
            ],
            [
                'field' => 'Catawiki - D: Condition',
                'value' => $data->get('Catawiki_Condition'),
                'type' => 'select',
                'options' => PlatformOption::d_condition(),
            ],
            [
                'field' => 'Catawiki - D: Gender',
                'value' => $data->get('Catawiki_Gender', 'Men'),
                'type' => 'select',
                'options' => PlatformOption::d_gender()
            ],
            [
                'field' => 'Catawiki - D: Band material',
                'value' => $data->get('Catawiki_Band_material'),
                'type' => 'select',
                'options' => PlatformOption::d_band_material()
            ],
            [
                'field' => 'Catawiki - D: Band length (optional)',
                'value' => $data->get('Catawiki_Band_length'),
                'type' => 'select',
                'options' => PlatformOption::d_band_length()
            ],
            [
                'field' => 'Catawiki - D: Repainted dial',
                'value' => $data->get('Catawiki_Repainted_Dial', 'No'),
                'type' => 'select',
                'options' => ['Yes', 'No']
            ],
            [
                'field' => 'Catawiki - D: Dial colour (optional)',
                'value' => $data->get('Catawiki_Dial_colour'),
                'type' => 'select',
                'options' => PlatformOption::d_dial_colour()
            ],
            [
                'field' => 'Catawiki - D: Original box included',
                'value' => $data->get('Catawiki_Original_box_included', 'No'),
                'type' => 'select',
                'options' => ['Yes', 'No']
            ],
            [
                'field' => 'Catawiki - D: Original papers included',
                'value' => $data->get('Catawiki_Original_papers_included', 'No'),
                'type' => 'select',
                'options' => ['Yes', 'No']
            ],
            [
                'field' => 'Catawiki - D: Original warranty included',
                'value' => $data->get('Catawiki_Original_warranty_included', 'No'),
                'type' => 'select',
                'options' => ['Yes', 'No']
            ],
            [
                'field' => 'Catawiki - D: Year (optional)',
                'value' => $data->get('Catawiki_Year'),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: Weight',
                'value' => $data->get('Catawiki_Weight'),
                'type' => 'select',
                'options' => PlatformOption::d_weight()
            ],
            [
                'field' => 'Catawiki - D: Width lug/ watch band',
                'value' => $data->get('Catawiki_Width_lug_watch_band'),
                'type' => 'select',
                'options' => PlatformOption::d_width_lug_watch_band()
            ],
            [
                'field' => 'Catawiki - D: In working order (optional)',
                'value' => $data->get('Catawiki_In_working_order', ''),
                'type' => 'select',
                'options' => ['Yes', 'No']
            ],
            [
                'field' => 'Catawiki - Public photo URL',
                'value' => $data->get('Catawiki_Public_photo_URL', self::getImageUrls($watch?->image_urls)),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Estimated lot value',
                'value' => $data->get('Catawiki_Estimated_lot_value', '1200'),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Reserve price (optional)',
                'value' => $data->get('Catawiki_Reserve_price'),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Start bidding from (optional)',
                'value' => $data->get('Catawiki_Start_bidding_from'),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Pick up (optional)',
                'value' => $data->get('Catawiki_Pick_up', 'No'),
                'type' => 'select',
                'options' => ['Yes', 'No']
            ],
            [
                'field' => 'Catawiki - Combined shipping (optional)',
                'value' => $data->get('Catawiki_Combined_shipping', 'No'),
                'type' => 'select',
                'options' => ['Yes', 'No']
            ],
            [
                'field' => 'Catawiki - Shipping costs -',
                'value' => $data->get('Catawiki_Shipping_Cost'),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Shipping costs - Europe',
                'value' => $data->get('Catawiki_Shipping_Cost_Europe'),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Shipping costs - Rest of World',
                'value' => $data->get('Catawiki_Shipping_Cost_Rest_of_World'),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Country specific shipping price (optional)',
                'value' => $data->get('Catawiki_Country_specific_shipping_price'),
                'type' => 'select',
                'options' => PlatformOption::shipping_country_name()
            ],
            [
                'field' => 'Catawiki - Shipping profile (optional)',
                'value' => $data->get('Catawiki_Shipping_Shipping_profile'),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - Message to Expert (optional)',
                'value' => $data->get('Catawiki_Shipping_Message_to_Expert'),
                'type' => 'textarea'
            ]
        ];
    }

    /**
     * format the watch image urls as expected by Catawiki
     */
    public static function getImageUrls($urls)
    {
        if (is_array($urls)) {
            return implode(';', $urls);
        }

        if (is_string($urls)) {
            return $urls;
        }

        return '';
    }
}
