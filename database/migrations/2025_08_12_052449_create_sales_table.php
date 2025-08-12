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
            $table->foreignIdFor('sold_by', User::class)->constrained();
            $table->foreignIdFor('watch_id', Watch::class)->constrained();

            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('currency', 3)->default('EUR');
            $table->decimal('price', 10, 2)->nullable();
            $table->string('buyer_name')->nullable();
            $table->string('buyer_email')->nullable();
            $table->text('buyer_address')->nullable();
            $table->string('buyer_city')->nullable();
            $table->string('buyer_country')->nullable();
            $table->string('buyer_postal_code')->nullable();
            $table->string('buyer_iso_code')->nullable();
            $table->string('condition')->nullable();
            $table->string('gender')->nullable();
            $table->string('movement')->nullable();
            $table->string('case_material')->nullable();
            $table->string('dial_color')->nullable();
            $table->boolean('original_box')->default(false);
            $table->boolean('original_papers')->default(false);
            $table->boolean('original_warranty')->default(false);
            $table->boolean('working_order')->default(true);
            $table->boolean('repainted_dial')->default(false);
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
