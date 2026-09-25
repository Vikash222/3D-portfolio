<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description', 500);
            $table->text('long_description')->nullable();
            $table->json('tech_tags')->nullable();
            $table->string('thumbnail_url', 500)->nullable();
            $table->string('thumbnail_public_id')->nullable();
            $table->string('github_link')->nullable();
            $table->string('live_link')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
            $table->index(['is_pinned', 'display_order']);
        });
    }
    public function down() {
        Schema::dropIfExists('projects');
    }
};
