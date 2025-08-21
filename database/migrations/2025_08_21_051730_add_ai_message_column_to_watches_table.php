<?php

use App\Models\Watch;
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
        Schema::table(Watch::tableName(), function (Blueprint $table) {
            $table->text('ai_message')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(Watch::tableName(), function (Blueprint $table) {
            $table->dropColumn('ai_message');
        });
    }
};
