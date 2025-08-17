<?php

use App\Models\Log;
use App\Models\User;
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
        Schema::dropIfExists(Log::tableName());
        Schema::create(Log::tableName(), function (Blueprint $table) {
            $table->id();
            $table->string('level')->default('info');
            $table->string('category')->nullable();
            $table->text('message')->nullable();
            $table->longText('context')->nullable();
            $table->foreignIdFor(User::class, 'user_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(Log::tableName());
    }
};
