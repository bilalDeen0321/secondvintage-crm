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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->enum('type', ['payment', 'deposit']);
            $table->enum('payment_type', ['watches', 'shipping', 'watchmaker', 'fee', 'bonus']);
            $table->enum('status', ['unpaid', 'paid_not_received', 'refunded']);

            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('USD');

            $table->foreignId('watch_id')->nullable()->constrained('watches')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
