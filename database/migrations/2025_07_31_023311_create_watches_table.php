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
        Schema::create('watches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('sku')->unique();
            $table->string('name');
            $table->foreignId('brand_id')->constrained()->onDelete('cascade');
            $table->string('serial_number')->nullable();
            $table->string('reference')->nullable();
            $table->string('case_size')->nullable();
            $table->string('caliber')->nullable();
            $table->string('timegrapher')->nullable();
            $table->decimal('original_cost', 12, 2)->nullable();
            $table->decimal('current_cost', 12, 2)->nullable();
            $table->foreignId('status_id')->constrained()->onDelete('cascade');
            $table->foreignId('stage_id')->constrained()->onDelete('cascade');
            $table->foreignId('batch_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('location_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('agent_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('seller_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('description')->nullable();
            $table->text('ai_instructions')->nullable();
            $table->string('description_thread_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['sku', 'status_id', 'stage_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watches');
    }
};
