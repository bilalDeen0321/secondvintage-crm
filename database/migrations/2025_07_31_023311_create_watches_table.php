<?php

use App\Models\Location;
use App\Models\Status;
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
            $table->string('sku')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('reference')->nullable();
            $table->string('case_size')->nullable();
            $table->string('caliber')->nullable();
            $table->string('timegrapher')->nullable();

            $table->decimal('original_cost', 12, 2)->nullable();
            $table->decimal('current_cost', 12, 2)->nullable();
            $table->string('currency')->default('DKK');

            $table->text('ai_instructions')->nullable();
            $table->string('ai_thread_id')->nullable();
            $table->json('ai_selected_images')->nullable(); // Images selected for AI processing

            $table->string('status')->default(Status::DRAFT);
            $table->text('notes')->nullable();
            $table->string('stage')->nullable();
            $table->string('location')->default(Location::DEFAULT_COUNTRY);

            $table->foreignId('user_id')->constrained(); // Owner/Creator
            $table->foreignId('batch_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('agent_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('seller_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
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
