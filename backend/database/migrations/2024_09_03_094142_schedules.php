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
        // Old Calendar Schema
        // Schema::create('schedules', function (Blueprint $table) {
        //     $table->id();
        //     $table->unsignedBigInteger('event_id');
        //     $table->unsignedBigInteger('user_id');
        //     $table->dateTime('date');
        //     $table->time('shift_start');
        //     $table->time('shift_end');
        //     $table->string('status');
        //     $table->timestamps();

        //     // Define foreign key constraints
        //     $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade')->onUpdate('cascade');
        //     $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        // });

        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('assignee')->nullable(); // Foreign key to users table
            $table->string('status');
            $table->timestamps();

            // Add unique constraint for title and start_date
            $table->unique(['title', 'start_date', 'assignee'], 'unique_schedule_title_start_date_assignee');

            // Define foreign key constraints
            $table->foreign('assignee')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });

        // id: 3,
        // title: "Client Meeting",
        // category: "Meeting",
        // startDate: "2025-04-15",
        // endDate: "2025-04-15",
        // startTime: "11:00",
        // endTime: "12:00",
        // description: "Discuss project requirements with client",
        // assignee: 2,
        // status: "Scheduled",
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};