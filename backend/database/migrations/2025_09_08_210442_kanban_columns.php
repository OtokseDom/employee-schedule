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
        Schema::create('kanban_columns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('task_status_id')->constrained('task_statuses')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('position');
            $table->timestamps();
            $table->unique(['organization_id', 'project_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kanban_columns');
    }
};
