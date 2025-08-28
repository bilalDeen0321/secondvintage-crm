<?php

namespace App\Packages\Utils;

use App\Support\Str;

class Path
{
    /**
     * Join multiple path segments into a single normalized path.
     */
    public static function join(string ...$segments): string
    {
        $path = join(DIRECTORY_SEPARATOR, $segments);
        return static::normalize($path);
    }

    /**
     * Normalize slashes in a path (convert \\ to / and remove duplicate slashes).
     */
    public static function normalize(string $path): string
    {
        $path = str_replace('\\', '/', $path);
        $path = str_replace('./', '', $path);
        return preg_replace('#/+#', '/', $path);
    }

    /**
     * Resolve a path to its absolute form (if exists).
     */
    public static function real(string $path): ?string
    {
        $real = realpath($path);
        return $real !== false ? static::normalize($real) : null;
    }

    /**
     * Replace part of a path (first occurrence).
     */
    public static function replaceFirst(string $search, string $replace, string $path): string
    {
        return Str::replaceFirst($search, $replace, $path);
    }

    /**
     * Replace part of a path (all occurrences).
     */
    public static function replace(string $search, string $replace, string $path): string
    {
        return str_replace($search, $replace, $path);
    }

    /**
     * Get the directory name of a path.
     */
    public static function dirname(string $path): string
    {
        return dirname($path);
    }

    /**
     * Get the filename (with extension).
     */
    public static function basename(string $path): string
    {
        return basename($path);
    }

    /**
     * Get the filename without extension.
     */
    public static function filename(string $path): string
    {
        return pathinfo($path, PATHINFO_FILENAME);
    }

    /**
     * Get the file extension.
     */
    public static function extension(string $path): string
    {
        return pathinfo($path, PATHINFO_EXTENSION);
    }

    /**
     * Check if path is absolute.
     */
    public static function isAbsolute(string $path): bool
    {
        return Str::startsWith($path, ['/', '\\']) || preg_match('/^[A-Za-z]:[\/\\\\]/', $path);
    }

    /**
     * Get the current dir name
     */
    public static function current(string ...$segments)
    {
        // debug_backtrace gives us the file where Path::current() was invoked
        $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1)[0]['file'] ?? __FILE__;
        $dir   = dirname($trace);

        return static::join($dir, ...$segments);
    }
}
