<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('platform_data', function (Blueprint $table) {
            $table->id();

            $table->foreignId('watch_id')->constrained('watches')->onDelete('cascade');

            $table->enum('platform', ['Catawiki', 'Tradera', 'eBay', 'Chrono24']);
            $table->json('data')->nullable(); // Holds platform-specific fields
            $table->string('status')->default('pending'); // e.g., listed, sold, failed, etc.

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_data');
    }
};
