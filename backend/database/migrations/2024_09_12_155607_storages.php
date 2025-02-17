<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('storages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('warehouse_id');
            $table->string('name');
            $table->string('code');
            $table->integer('type');
            $table->text('description')->nullable(true);
            $table->string('capacity')->nullable(true);
            $table->string('dimension')->nullable(true);
            $table->string('weight_capacity')->nullable(true);
            $table->integer('status');
            $table->timestamps();

            $table->foreign('warehouse_id')->references('id')->on('warehouses')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('storages');
    }
};
