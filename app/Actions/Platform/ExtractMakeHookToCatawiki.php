<?php

namespace App\Actions\Platform;

use App\Models\Status;
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
                'value' => $data->get('Catawiki_Auction_Type', 'Omega Watches'),
                'type' => 'select',
                'options' => [
                    'Antique Furniture',
                    'Antique Religious Decor',
                    'Art Nouveau & Art Deco Furniture',
                    'Automobilia',
                    'Automobilia Art & Posters',
                    'Automobilia Car Parts',
                    'Automobilia Literature',
                    'Automobilia Signs & Lightboxes',
                    'Aviation',
                    'Boho Chic',
                    'Bonsai Trees',
                    'Breitling Watches',
                    'Cartier Watches',
                    'Christmas Decor',
                    'Classic Home Decor',
                    'Clocks',
                    'Comic Figurines & Merchandise',
                    'Comics (Private Collection)',
                    'Comics (Risqué)',
                    'Comics in Dutch',
                    'Comics in French',
                    'Comics in Italian',
                    'Contemporary Design',
                    'Decorative Salvage',
                    'Designer Furniture',
                    'Disney Animation',
                    'Disney Comic Art',
                    'Disney Figures & Merchandise',
                    'English Country House',
                    'Exclusive Antiques',
                    'Exclusive Art Nouveau & Art Deco',
                    'Exclusive Automobilia',
                    'Exclusive Design',
                    'Exclusive Watches',
                    'Ferrari Automobilia',
                    'French Elegance',
                    'Garden Furniture & Decorations',
                    'Hergé / Tintin Comic Books',
                    'Hergé / Tintin Figures & Merchandise',
                    'Hollywood Glamour',
                    'Home Inspiration & Trends',
                    'IWC Watches',
                    'Industrial Design',
                    'International Comics',
                    'Japanese Figurines & Merchandise',
                    'Longines Watches',
                    'Mediterranean House',
                    'Modern Home Decor',
                    'Motobilia',
                    'New Seller Watches',
                    'Omega Watches',
                    'Pocket Watches',
                    'Porsche Automobilia',
                    'Premium Watches',
                    'Religious Decor',
                    'Rolex Watches',
                    'Seiko Watches',
                    'TAG Heuer Watches',
                    'Tudor Watches',
                    'US Comics',
                    'Unused Watches',
                    'Vintage Furniture',
                    'Vintage Watches',
                    'Watch Accessories',
                    'Zenith Watches'
                ]
            ],
            [
                'field' => 'Catawiki - Object type (18127)',
                'value' => $data->get('Catawiki_Object_Type', 'Watch'),
                'type' => 'select',
                'options' => [
                    'Automaton pocket watch',
                    'Chronograph pocket watch',
                    'Chronograph watch',
                    'Digital watch',
                    'Erotic pocket watch',
                    'Marriage watch',
                    'Mechanical watch',
                    'Pocket watch',
                    'Smart watch',
                    'Stopwatch',
                    'Watch'
                ]
            ],
            [
                'field' => 'Catawiki - Language',
                'value' => $data->get('Catawiki_Language', 'English'),
                'type' => 'select',
                'options' => [
                    'English',
                    'Dutch',
                    'French',
                    'German',
                    'Italian',
                    'Spanish',
                    'Portuguese',
                    'Polish'
                ]
            ],
            [
                'field' => 'Catawiki - Description',
                'value' => $data->get('Description', ''),
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
                'value' => $data->get('Catawiki_Period', '2020+'),
                'type' => 'select',
                'options' => [
                    '1850-1900',
                    '1900-1949',
                    '1950-1959',
                    '1960-1969',
                    '1970-1979',
                    '1980-1989',
                    '1990-1999',
                    '2000-2010',
                    '2010-2020',
                    '2020+',
                    'Earlier than 1850'
                ]
            ],
            [
                'field' => 'Catawiki - D: Movement',
                'value' => $data->get('Catawiki_Movement_type', 'Automatic'),
                'type' => 'select',
                'options' => [
                    'Automatic',
                    'Manual winding',
                    'Other',
                    'Quartz'
                ]
            ],
            [
                'field' => 'Catawiki - D: Case material',
                'value' => $data->get('Catawiki_Case_material', 'Stainless steel'),
                'type' => 'select',
                'options' => [
                    'Aluminium',
                    'Argentan',
                    'Bioceramic',
                    'Bronze',
                    'Carbon',
                    'Ceramic',
                    'Chromed',
                    'Copper',
                    'Gold',
                    'Gold/Steel',
                    'Gold-filled',
                    'Gold-plated',
                    'Gunmetal',
                    'Metal',
                    'Palladium',
                    'Pink gold',
                    'Plastic',
                    'Platinum',
                    'Polycarbon',
                    'Silver',
                    'Silverplated',
                    'Stainless steel',
                    'Steel',
                    'Tantalum',
                    'Titanium',
                    'Tungsten',
                    'White gold',
                    'Yellow gold'
                ]
            ],
            [
                'field' => 'Catawiki - D: Case diameter',
                'value' => $data->get('Catawiki_Case_diameter', ''),
                'type' => 'input'
            ],
            [
                'field' => 'Catawiki - D: Condition',
                'value' => $data->get('Catawiki_Condition', 'Very good - minor signs of wear'),
                'type' => 'select',
                'options' => [
                    'Fair - major signs of wear',
                    'Good - visible signs of wear',
                    'New',
                    'Unworn - no signs of wear',
                    'Very good - minor signs of wear'
                ]
            ],
            [
                'field' => 'Catawiki - D: Gender',
                'value' => $data->get('Catawiki_Gender', 'Men'),
                'type' => 'select',
                'options' => [
                    'Men',
                    'Unisex',
                    'Women'
                ]
            ],
            [
                'field' => 'Catawiki - D: Band material',
                'value' => $data->get('Catawiki_Band_material', 'Stainless Steel'),
                'type' => 'select',
                'options' => [
                    'Bronze',
                    'Ceramic',
                    'Gold/steel',
                    'Leather',
                    'Platinum',
                    'Resin',
                    'Rose gold',
                    'Rubber',
                    'Steel',
                    'Textile',
                    'Titanium',
                    'White gold',
                    'Yellow gold'
                ]
            ],
            [
                'field' => 'Catawiki - D: Band length (optional)',
                'value' => $data->get('Catawiki_Band_length', ''),
                'type' => 'select',
                'options' => [
                    'Very short (under 160 mm)',
                    'Short (160–170 mm)',
                    'Regular (180–200 mm)',
                    'Long (over 200 mm)'
                ]
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
                'type' => 'select',
                'options' => [
                    'Black',
                    'Blue',
                    'Bronze',
                    'Brown',
                    'Champagne',
                    'Gold',
                    'Green',
                    'Grey',
                    'Mother of pearl',
                    'Navy',
                    'Orange',
                    'Pink',
                    'Purple',
                    'Red',
                    'Salmon',
                    'Silver',
                    'Skeleton',
                    'Turquoise',
                    'White',
                    'Yellow'
                ]
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
                'value' => $data->get('Catawiki_Public_photo_URL', ''),
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
