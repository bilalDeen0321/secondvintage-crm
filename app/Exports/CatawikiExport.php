<?php

namespace App\Exports;

use App\Models\PlatformData;
use App\Models\Watch;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class CatawikiExport implements FromCollection, WithHeadings, WithMapping, WithChunkReading, WithCustomCsvSettings
{
    /**
     * The attributes to be headers.
     */
    protected $headers = [
        "Your Reference Number (optional)",
        "Your Reference Colour (optional)",
        "Auction Type (333) (optional)",
        "Object type (18127)",
        "Language",
        "Description",
        "D: Brand",
        "D: Model (optional)",
        "D: Reference Number (optional)",
        "D: Shipped Insured",
        "D: Period",
        "D: Movement",
        "D: Case material",
        "D: Case diameter",
        "D: Condition",
        "D: Gender",
        "D: Band material",
        "D: Band length (optional)",
        "D: Repainted dial",
        "D: Dial colour (optional)",
        "D: Original box included",
        "D: Original papers included",
        "D: Original warranty included",
        "D: Year (optional)",
        "D: Weight",
        "D: Width lug/ watch band",
        "D: In working order (optional)",
        "Public photo URL",
        "Estimated lot value",
        "Reserve price (optional)",
        "Start bidding from (optional)",
        "Pick up (optional)",
        "Combined shipping (optional)",
        "Shipping costs -",
        "Shipping costs - Europe",
        "Shipping costs - Rest of World",
        "Country specific shipping price (optional)",
        "Shipping profile (optional)",
        "Message to Expert (optional)"
    ];

    /**
     * The watch IDs to be exported.
     */
    protected $watchIds;

    /**
     * Constructor to initialize watch IDs.
     */
    public function __construct(array $watchIds)
    {
        $this->watchIds = $watchIds;
    }

    /**
     * Define the headers for the export.
     */
    public function headings(): array
    {
        return $this->headers;
    }

    /**
     * Define the chunk size for reading data.
     */
    public function chunkSize(): int
    {
        return 100; // Adjust the chunk size as needed
    }

    /**
     * Define custom CSV settings.
     */
    public function getCsvSettings(): array
    {
        return [
            'enclosure'   => '',   // no forced quotes
            'line_ending' => "\n", // Unix style like your older export
        ];
    }

    /**
     * Default values for certain fields if not provided in platform data.
     */
    protected $defaults = [
        'Catawiki - Object type (18127)'       => 'Watch',
        'Catawiki - Language'                  => 'English',
        'Catawiki - D: Condition'              => 'Good - with signs of wear',
        'Catawiki - D: Gender'                 => 'Men',
        'Catawiki - Estimated lot value'       => '1200', // fallback minimal value
        // 'Catawiki - Public photo URL'          => 'http://yourdomain.com/default-image.png',
    ];


    /**
     * Fetch the collection of watches to be exported.
     */
    public function collection(): Collection
    {
        return PlatformData::query()
            ->with('watch:id,description')
            ->where('name', PlatformData::CATAWIKI)
            ->whereIn('watch_id',  $this->watchIds)
            ->get();
    }

    public function map($row): array
    {
        /** @var \App\Models\PlatformData */
        $platform = $row;

        // Convert platform data array to associative array for easier access
        $dataMap = [];
        if (is_array($platform->data)) {
            foreach ($platform->data as $item) {
                if (isset($item['field']) && isset($item['value'])) {
                    $dataMap[$item['field']] = $item['value'];
                }
            }
        }

        // Helper function to get platform data value
        $getValue = function ($field) use ($dataMap) {

            if (!empty($dataMap[$field])) {
                return $dataMap[$field];
            }

            // Use fallback if defined
            return $this->defaults[$field] ?? '';
        };

        return [
            $getValue('Catawiki - Your Reference Number (optional)'),
            $getValue('Catawiki - Your Reference Colour (optional)'),
            $getValue('Catawiki - Auction Type (333) (optional)'),
            $getValue('Catawiki - Object type (18127)'),
            $getValue('Catawiki - Language'),
            $getValue('Catawiki - Description'),
            $getValue('Catawiki - D: Brand'),
            $getValue('Catawiki - D: Model (optional)'),
            $getValue('Catawiki - D: Reference Number (optional)'),
            $getValue('Catawiki - D: Shipped Insured'),
            $getValue('Catawiki - D: Period'),
            $getValue('Catawiki - D: Movement'),
            $getValue('Catawiki - D: Case material'),
            $getValue('Catawiki - D: Case diameter'),
            $getValue('Catawiki - D: Condition'),
            $getValue('Catawiki - D: Gender'),
            $getValue('Catawiki - D: Band material'),
            $getValue('Catawiki - D: Band length (optional)'),
            $getValue('Catawiki - D: Repainted dial'),
            $getValue('Catawiki - D: Dial colour (optional)'),
            $getValue('Catawiki - D: Original box included'),
            $getValue('Catawiki - D: Original papers included'),
            $getValue('Catawiki - D: Original warranty included'),
            $getValue('Catawiki - D: Year (optional)'),
            $getValue('Catawiki - D: Weight'),
            $getValue('Catawiki - D: Width lug/ watch band'),
            $getValue('Catawiki - D: In working order (optional)'),
            $getValue('Catawiki - Public photo URL'),
            $getValue('Catawiki - Estimated lot value'),
            $getValue('Catawiki - Reserve price (optional)'),
            $getValue('Catawiki - Start bidding from (optional)'),
            $getValue('Catawiki - Pick up (optional)'),
            $getValue('Catawiki - Combined shipping (optional)'),
            $getValue('Catawiki - Shipping costs -'),
            $getValue('Catawiki - Shipping costs - Europe'),
            $getValue('Catawiki - Shipping costs - Rest of World'),
            $getValue('Catawiki - Country specific shipping price (optional)'),
            $getValue('Catawiki - Shipping profile (optional)'),
            $getValue('Catawiki - Message to Expert (optional)')
        ];
    }
}
