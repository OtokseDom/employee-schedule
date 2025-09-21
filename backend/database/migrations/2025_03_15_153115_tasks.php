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
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('status_id')->nullable()->constrained('task_statuses')->onDelete('set null')->onUpdate('cascade');
            $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('set null')->onUpdate('cascade');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null')->onUpdate('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('tasks')->onDelete('set null')->onUpdate('cascade');
            // $table->foreignId('assignee_id')->nullable()->constrained('users')->onDelete('set null')->onUpdate('cascade');
            $table->string('title');
            $table->longText('description')->nullable();
            $table->text('expected_output')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->double('days_estimate')->nullable(); // in days
            $table->double('days_taken')->nullable(); // in days
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->double('time_estimate')->nullable(); // in hours
            $table->double('time_taken')->nullable(); // in hours
            $table->double('delay')->nullable(); // in hours
            $table->double('delay_days')->nullable(); // in hours
            $table->text('delay_reason')->nullable();
            $table->integer('performance_rating')->nullable();
            $table->text('remarks')->nullable();
            $table->enum('priority', ['Low', 'Medium', 'High', 'Urgent', 'Critical'])->nullable();
            $table->integer('position'); //kanban
            $table->timestamps();
            $table->unique(['project_id', 'status_id', 'position']);
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
