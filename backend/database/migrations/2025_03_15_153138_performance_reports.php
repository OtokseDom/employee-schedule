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
        Schema::create('performance_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->integer('total_tasks')->default(0);
            $table->integer('tasks_on_time')->default(0);
            $table->integer('tasks_delayed')->default(0);
            $table->integer('tasks_pending')->default(0);
            $table->integer('tasks_completed')->default(0);
            $table->integer('tasks_in_progress')->default(0);
            $table->integer('tasks_cancelled')->default(0);
            $table->integer('tasks_on_hold')->default(0);
            $table->date('assessment_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_reports');
    }
};