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
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // $table->foreignId('location_id')->constrained('locations')->onDelete('restrict');
            // $table->foreignId('status_id')->constrained('statuses')->onDelete('restrict');
            // $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('destination')->default('Denmark');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};
