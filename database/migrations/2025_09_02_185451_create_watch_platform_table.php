<?php

use App\Models\WatchPlatform;
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
        Schema::create(WatchPlatform::tableName(), function (Blueprint $table) {
            $table->id();
            $table->foreignId('watch_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('status')->default(WatchPlatform::STATUS_DEFAULT);
            $table->string('message')->nullable(); // To store any error or status messages
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(WatchPlatform::tableName());
    }
};
