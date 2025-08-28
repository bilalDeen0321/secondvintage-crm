<?php

namespace App\Packages\Utils\Traits;

trait CreateInstance
{

    /**
     * Store the instance for stateless cached per argument based
     */
    protected static array $instances = [];

    /**
     * Create a static new class instance with container
     */
    public static function make(...$args): static
    {

        if (empty($args)) return app(static::class);

        $ref = new \ReflectionClass(static::class);
        $ctor = $ref->getConstructor();
        $params = [];

        if ($ctor) {
            foreach ($ctor->getParameters() as $i => $p) {
                if (array_key_exists($i, $args)) {
                    $params[$p->getName()] = $args[$i];
                }
            }
        }

        return app()->makeWith(static::class, $params);
    }

    /**
     * Create a static new class instance.
     */
    public static function init(...$args): static
    {
        // create the class cached key
        $key = md5(json_encode($args, JSON_THROW_ON_ERROR | JSON_PARTIAL_OUTPUT_ON_ERROR));

        if (! isset(static::$instances[$key])) {
            static::$instances[$key] = new static(...$args);
        }

        return static::$instances[$key];
    }
}
