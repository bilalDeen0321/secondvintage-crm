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
            $table->string('tracking_number')->nullable();
            $table->string('origin')->nullable();
            $table->string('status')->nullable()->default('shipped');
            $table->text('notes')->nullable();
            $table->string('destination')->default('Denmark');

            $table->dateTime('shipped_date')->nullable();
            $table->string('estimated_delivery')->nullable();
            $table->string('actual_delivery')->nullable();
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
