<?php

use App\Models\User;
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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class, 'sold_by')->constrained();
            $table->timestamp('sold_date')->nullable();
            $table->foreignIdFor(Watch::class, 'watch_id')->constrained();

            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('currency', 3)->default('EUR');
            $table->decimal('price', 10, 2)->nullable();
            $table->string('buyer_name')->nullable();
            $table->string('buyer_company')->nullable();
            $table->string('buyer_email')->nullable();
            $table->text('buyer_address')->nullable();
            $table->string('buyer_city')->nullable();
            $table->string('buyer_country')->nullable();
            $table->string('buyer_postal_code')->nullable();
            $table->string('buyer_iso_code')->nullable(); 
            // Catawiki specific
            $table->string('currency')->nullable();
            $table->string('catawiki_object_number')->nullable();
            $table->string('catawiki_invoice_number')->nullable();
            $table->string('catawiki_invoice_url')->nullable();

            // Shipping cost fields
            $table->decimal('shipping_cost_original', 10, 2)->nullable();
            $table->string('shipping_cost_currency', 10)->nullable();
            $table->decimal('shipping_cost_currency_rate', 10, 6)->nullable();
            $table->decimal('shipping_cost_euro', 10, 2)->nullable();

            // Profit
            $table->decimal('profit_converted', 12, 2)->nullable();
             
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
