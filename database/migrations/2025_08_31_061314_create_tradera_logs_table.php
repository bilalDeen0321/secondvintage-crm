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
        Schema::create('tradera_logs', function (Blueprint $table) {
            $table->id();
            $table->string('action')->index(); // 'create_listing', 'sync_orders', 'auth'
            $table->string('status')->index(); // 'pending', 'success', 'error'
            $table->foreignId('watch_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

            // Request data
            $table->json('request_payload')->nullable();
            $table->text('request_url')->nullable();
            $table->json('request_headers')->nullable();

            // Response data
            $table->json('response_data')->nullable();
            $table->integer('response_status')->nullable();
            $table->text('response_body')->nullable();

            // Tradera specific data
            $table->string('tradera_item_id')->nullable()->index();
            $table->string('tradera_order_id')->nullable()->index();
            $table->string('tradera_user_id')->nullable();
            $table->text('tradera_token')->nullable();

            // Error handling
            $table->text('error_message')->nullable();
            $table->json('error_details')->nullable();

            // Timing
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_ms')->nullable(); // Duration in milliseconds

            // Additional metadata
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->json('metadata')->nullable(); // For any additional data

            $table->timestamps();

            // Indexes for better performance
            $table->index(['action', 'status']);
            $table->index(['created_at']);
            $table->index(['watch_id', 'action']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tradera_logs');
    }
};
