<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class FileUploadService
{
    /**
     * Upload a file into public/storage/{folder}
     * Returns the relative path to store in DB: "storage/{folder}/{filename.ext}"
     *
     * @param UploadedFile $file
     * @param string $folder
     * @return string
     */
    public static function upload(UploadedFile $file, string $folder = 'uploads'): string
    {
        $folderPath = public_path("storage/{$folder}");

        // create dir if not exists
        if (!File::exists($folderPath)) {
            File::makeDirectory($folderPath, 0755, true);
        }

        // create unique filename
        $extension = strtolower($file->getClientOriginalExtension());
        $fileName = time() . '_' . Str::random(8) . '.' . $extension;

        // move file to public/storage/{folder}
        $file->move($folderPath, $fileName);

        // return DB-storable relative path
        return "storage/{$folder}/{$fileName}";
    }

    /**
     * Delete a previously uploaded file (safe).
     * Accepts the stored relative path (e.g. storage/wishlist_images/xxx.jpg)
     *
     * @param string|null $relativePath
     * @return bool
     */
    public static function delete(?string $relativePath): bool
    {
        if (!$relativePath) {
            return false;
        }

        $fullPath = public_path($relativePath);

        if (File::exists($fullPath)) {
            return (bool) File::delete($fullPath);
        }

        return false;
    }
}
