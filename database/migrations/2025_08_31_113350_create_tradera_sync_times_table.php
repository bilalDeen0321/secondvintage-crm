<?php

use App\Models\TraderaSyncTime;
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
        Schema::create(TraderaSyncTime::tableName(), function (Blueprint $table) {
            $table->id();
            // Store the last sync time
            $table->dateTime('tst_sync_time')->nullable();
            $table->string('close')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(TraderaSyncTime::tableName());
    }
};
