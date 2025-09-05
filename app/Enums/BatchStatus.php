<?php

namespace App\Enums;

enum BatchStatus: string
{
    case PREPARING = 'preparing';
    case SHIPPED = 'shipped';
    case IN_TRANSIT = 'in_transit';
    case CUSTOMS = 'customs';
    case DELIVERED = 'delivered';

    public static function allStatuses(): array
    {
        return [
            self::PREPARING,
            self::SHIPPED,
            self::IN_TRANSIT,
            self::CUSTOMS,
            self::DELIVERED,
        ];
    }

    public function label(): string
    {
        return match ($this) {
            self::PREPARING => 'Preparing',
            self::SHIPPED => 'Shipped',
            self::IN_TRANSIT => 'In Transit',
            self::CUSTOMS => 'Customs',
            self::DELIVERED => 'Delivered',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PREPARING => 'bg-primary ',
            self::SHIPPED => 'bg-blue-500 ',
            self::IN_TRANSIT => 'bg-secondary text-black',
            self::CUSTOMS => 'bg-orange-400 text-white',
            self::DELIVERED => 'bg-green-500 text-white',
        };
    }
}
