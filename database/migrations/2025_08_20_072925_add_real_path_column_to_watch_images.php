<?php

use App\Models\Watch;
use App\Models\WatchImage;
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
        Schema::table(WatchImage::tableName(), function (Blueprint $table) {
            $table->text('real_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(WatchImage::tableName(), function (Blueprint $table) {
            $table->dropColumn('real_path');
        });
    }
};
