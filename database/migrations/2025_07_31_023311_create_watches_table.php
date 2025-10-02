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
            $table->string('wrist_size')->nullable();
            $table->string('caliber')->nullable();
            $table->string('timegrapher')->nullable();

            $table->decimal('original_cost', 12, 2)->nullable();
            $table->decimal('current_cost', 12, 2)->nullable(); 
            $table->decimal('cost_currency_rate ', 12, 2)->nullable();
            $table->string('cost_euro')->nullable();
            $table->string('currency')->default('DKK');


            $table->text('ai_instructions')->nullable();
            $table->string('ai_thread_id')->nullable();
            $table->string('ai_status')->nullable();
            $table->string('ai_message')->nullable();
            $table->json('ai_selected_images')->nullable(); // Images selected for AI processing
            $table->string('platform')->nullable();

            $table->string('status')->default(Status::DRAFT);
            $table->text('notes')->nullable();
            $table->string('stage')->nullable();
            $table->string('location')->default(Location::DEFAULT_COUNTRY);

            $table->foreignId('user_id')->constrained(); // Owner/Creator
            $table->foreignId('batch_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('agent_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('seller_id')->nullable()->constrained('users')->nullOnDelete();

            // Catawiki references
            $table->string('salesdata_customer')->nullable();
            $table->string('salesdata_catawiki_object_number')->nullable();
            $table->string('salesdata_catawiki_invoice_number')->nullable();
            $table->string('salesdata_catawiki_invoice_url')->nullable();

            // Customer info
            $table->string('salesdata_name')->nullable();
            $table->string('salesdata_company_name')->nullable();
            $table->string('salesdata_address_line_1')->nullable();
            $table->string('salesdata_address_line_2')->nullable();
            $table->string('salesdata_address_line_3')->nullable();
            $table->string('salesdata_postal_code')->nullable();
            $table->string('salesdata_city')->nullable();
            $table->string('salesdata_country')->nullable();
            $table->string('salesdata_iso_country_code', 10)->nullable();

            // Sale details
            $table->decimal('salesdata_shipping_costs', 10, 2)->nullable();
            $table->decimal('salesdata_sold_price', 10, 2)->nullable();
            $table->string('salesdata_sold_price_currency', 10)->nullable();
            $table->decimal('salesdata_sold_price_currency_rate', 10, 6)->nullable();
            $table->decimal('salesdata_sold_price_euro', 10, 2)->nullable();
            $table->timestamp('salesdata_sold_payment_date')->nullable();

            // Shipping cost details
            $table->decimal('salesdata_shipping_cost_original', 10, 2)->nullable();
            $table->string('salesdata_shipping_cost_currency', 10)->nullable();
            $table->decimal('salesdata_shipping_cost_currency_rate', 10, 6)->nullable();
            $table->decimal('salesdata_shipping_cost_euro', 10, 2)->nullable();

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
        Schema::dropIfExists('watches');
    }
};
