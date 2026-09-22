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
        // Conversations table (between Client User and Admin)
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('subject')->nullable();
            $table->string('status')->default('active'); // active, archived, closed
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
        });

        // 1-on-1 Messages inside a conversation
        Schema::create('client_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
            $table->enum('sender_type', ['client', 'admin'])->default('client');
            $table->unsignedBigInteger('sender_id')->nullable();
            $table->text('message');
            $table->string('attachment_url')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_messages');
        Schema::dropIfExists('conversations');
    }
};
