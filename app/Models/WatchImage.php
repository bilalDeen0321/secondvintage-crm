<?php

namespace App\Models;

use App\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class WatchImage extends Model
{
    /** @use HasFactory<\Database\Factories\WatchImageFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'watch_id',
        'filename',
        'public_url',
        'thumbnail',
        'order_index',
        'user_for_ai'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [];
    }

    /**
     * Get the watch that owns this image
     */
    public function watch()
    {
        return $this->belongsTo(Watch::class);
    }


    /**
     * Save a base64 image for a given watch
     */
    public static function storeBase64Image(Watch $watch, string $base64Image): ?self
    {
        if (!Str::startsWith($base64Image, 'data:image')) {
            return null;
        }

        // Extract base64
        [$type, $data] = explode(';', $base64Image);
        [, $data] = explode(',', $data);
        $data = base64_decode($data);

        // Detect extension
        $extension = Str::contains($type, 'jpeg') ? 'jpg' : (Str::contains($type, 'png') ? 'png' : 'jpg');

        // Determine next sequence number (padded to 3 digits)
        $nextIndex = $watch->images()->count() + 1;
        $sequence  = str_pad($nextIndex, 3, '0', STR_PAD_LEFT);

        // Build filename
        $fileName = 'watches/images/' . $watch->sku . '_' . $sequence . '.' . $extension;

        // Store file
        Storage::disk('public')->put($fileName, $data);

        // Create DB record
        return $watch->images()->create([
            'filename'   => basename($fileName),
            'public_url' => $fileName,
            'order_index' => $nextIndex,
        ]);
    }
}
