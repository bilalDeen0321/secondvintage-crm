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
        Schema::create('watch_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('watch_id')->constrained('watches')->onDelete('cascade');
            $table->text('filename')->nullable();
            $table->text('public_url')->nullable();
            $table->text('thumbnail')->nullable();
            $table->integer('order_index')->default(0);
            $table->boolean('use_for_ai')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watch_images');
    }
};
