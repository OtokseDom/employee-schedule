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
        Schema::create('task_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->onDelete('cascade'); // delete images when task is deleted
            $table->string('filename');   // stored filename on server or S3
            $table->string('original_name')->nullable(); // original file name (optional)
            $table->string('mime_type')->nullable(); // image/jpeg, image/png
            $table->integer('size')->nullable(); // file size in bytes
            $table->text('url')->nullable(); // if you’re storing in cloud/CDN
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_images');
    }
};
