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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();                 // e.g., 'company_name', 'dark_mode_enabled'
            $table->text('value')->nullable();              // Stores actual value (string, json, etc.)
            $table->string('type')->default('string');      // e.g., 'string', 'boolean', 'json', 'integer'
            $table->string('group')->nullable();            // e.g., 'general', 'appearance', 'integrations'
            $table->boolean('is_public')->default(true);    // Show in UI or not
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
