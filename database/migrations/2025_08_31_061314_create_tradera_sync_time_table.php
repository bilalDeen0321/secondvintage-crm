<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tradera_sync_times', function (Blueprint $table) {
            $table->id();
            $table->timestamp('last_sync_time')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert default record
        DB::table('tradera_sync_times')->insert([
            'last_sync_time' => now()->subDays(17),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('tradera_sync_times');
    }
};
