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
        Schema::create('watch_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('watch_id')->constrained('watches')->onDelete('cascade');

            $table->string('action'); // e.g., created, updated, price_changed, etc.
            $table->text('details')->nullable(); // can hold JSON or description of change

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watch_logs');
    }
};
