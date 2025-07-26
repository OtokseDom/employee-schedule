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
        Schema::create('task_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('task_id')->constrained('tasks')->onDelete('cascade')->onUpdate('cascade');
            $table->enum('status', ['Pending', 'In Progress', 'For Review', 'Completed', 'Delayed', 'Cancelled', 'On Hold']);
            $table->foreignId('changed_by')->constrained('users')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamp('changed_at')->useCurrent();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_histories');
    }
};
