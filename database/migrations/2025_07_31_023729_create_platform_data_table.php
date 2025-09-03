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
            $table->string('name'); // e.g., "eBay", "Chrono24", etc.
            $table->longText('data')->nullable(); // Holds platform-specific fields
            $table->string('status')->default('pending'); // e.g., listed, sold, failed, etc.
            $table->string('message')->nullable(); // e.g., listed, sold, failed, etc.
            $table->timestamps();

            $table->unique(['watch_id', 'name']);
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
