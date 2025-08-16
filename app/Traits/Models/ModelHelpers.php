<?php

namespace App\Traits\Models;

/**
 * Model trait helpers
 * 
 * @mixin \Illuminate\Database\Eloquent\Model
 */
trait ModelHelpers
{

    /**
     * Create a new static instance
     * 
     * @return \Illuminate\Database\Eloquent\Model
     */
    public static function instance()
    {
        return app(static::class);
    }

    /**
     * Get the table name statically from the model.
     */
    public static function tableName(): string
    {
        return static::instance()->getTable();
    }

    /**
     * Get the route key name statically from the model.
     */
    public static function routeKeyName(): string
    {
        return static::instance()->getRouteKeyName();
    }

    /**
     * Get the fillable attributes statically from the model.
     */
    public static function fields(): array
    {
        return static::instance()->getFillable();
    }

    /**
     * Get model find by route key
     */
    public static function findByKey(string|int $key): static|null
    {
        return static::where(static::routeKeyName(), $key)->first();
    }
}
