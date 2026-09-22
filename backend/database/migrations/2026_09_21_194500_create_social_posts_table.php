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
        Schema::create('social_posts', function (Blueprint $table) {
            $table->id();
            $table->string('platform', 30); // 'instagram', 'linkedin', 'github', 'twitter'
            $table->string('post_url', 500);
            $table->string('title')->nullable();
            $table->text('caption')->nullable();
            $table->string('image_url', 500)->nullable();
            $table->string('author_name', 100)->default('Vikash Kumar');
            $table->json('metrics')->nullable(); // likes, comments, shares, etc.
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_posts');
    }
};
