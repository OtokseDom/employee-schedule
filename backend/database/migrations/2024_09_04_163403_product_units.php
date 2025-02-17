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
        Schema::create('product_units', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_variation_id')->nullable(true);
            $table->unsignedBigInteger('unit_id');
            $table->boolean('is_base'); //if true, factor should be 1
            $table->double('factor');
            $table->double('base_qty')->nullable(true);
            $table->double('cost_price')->nullable(true);
            $table->double('selling_price');
            $table->double('sale_price')->nullable(true);
            $table->timestamps();

            // Define foreign key constraints
            $table->foreign('product_variation_id')->references('id')->on('product_variations')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('unit_id')->references('id')->on('units')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_units');
    }
};
