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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade')->onUpdate('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('expected_output')->nullable();
            $table->foreignId('assignee_id')->nullable()->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->enum('status', ['Pending', 'In Progress', 'Completed', 'Delayed', 'Cancelled', 'On Hold'])->default('pending');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->double('time_estimate')->nullable(); // in hours
            $table->double('time_taken')->nullable(); // in hours
            $table->double('delay')->nullable(); // in hours
            $table->text('delay_reason')->nullable();
            $table->integer('performance_rating')->default(0);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
