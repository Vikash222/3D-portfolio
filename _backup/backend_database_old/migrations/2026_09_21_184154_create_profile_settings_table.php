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
        Schema::create('profile_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('Vikash Kumar');
            $table->string('title')->default('Senior Full-Stack & AI Systems Engineer');
            $table->text('tagline')->nullable();
            $table->text('bio')->nullable();
            $table->json('about_details')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('resume_url')->nullable();
            $table->string('email')->default('vikash@example.com');
            $table->string('phone')->nullable();
            $table->string('location')->default('India / Remote Worldwide');
            $table->string('github')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('twitter')->nullable();
            $table->string('status_badge')->default('Available for Opportunities');
            $table->integer('years_experience')->default(5);
            $table->integer('projects_completed')->default(42);
            $table->integer('satisfied_clients')->default(28);
            $table->string('code_commits')->default('15K+');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_settings');
    }
};
