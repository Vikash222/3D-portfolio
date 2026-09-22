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
        Schema::table('profile_settings', function (Blueprint $table) {
            $table->string('hero_image_url')->nullable()->after('avatar_url');
            $table->string('gemini_api_key')->nullable()->after('code_commits');
            $table->text('ai_system_prompt')->nullable()->after('gemini_api_key');
            $table->text('ai_welcome_message')->nullable()->after('ai_system_prompt');
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->boolean('is_verified')->default(true)->after('rating');
            $table->string('linkedin_url')->nullable()->after('is_verified');
            $table->string('project_context')->nullable()->after('linkedin_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profile_settings', function (Blueprint $table) {
            $table->dropColumn([
                'hero_image_url',
                'gemini_api_key',
                'ai_system_prompt',
                'ai_welcome_message',
            ]);
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropColumn([
                'is_verified',
                'linkedin_url',
                'project_context',
            ]);
        });
    }
};
