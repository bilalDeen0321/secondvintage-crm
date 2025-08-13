<?php

namespace App\Traits\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @var \Illuminate\Database\Eloquent\Model $this;
 * @var \Illuminate\Database\Eloquent\Model self;
 * @var \Illuminate\Database\Eloquent\Model static;
 */
trait ModelHelpers
{

    /**
     * Create a new model instance
     */
    public static function instance(): static
    {
        return app(static::class);
    }

    /**
     * Get the table name statically from the model.
     */
    public static function tableName(): string
    {
        // Create a temporary instance to get table name
        return (new static)->getTable();
    }

    /**
     * Get the route key name statically from the model.
     */
    public static function routeKeyName(): string
    {
        return (new static)->getRouteKeyName();
    }

    /**
     * Get the route key value from the model instance.
     */
    public function routeKey()
    {
        return $this->getRouteKey();
    }

    /**
     * Get the fillable attributes statically from the model.
     */
    // public static function tableColumns(): array
    // {
    //     return (new static)->getFillable();
    // }
}
