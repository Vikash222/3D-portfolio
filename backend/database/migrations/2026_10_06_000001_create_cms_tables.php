<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Expand profiles table with CMS and settings columns
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('professional_name')->nullable()->after('name');
            $table->string('headline')->nullable()->after('tagline');
            $table->text('about_description')->nullable();
            $table->string('location')->nullable();
            $table->string('phone')->nullable();
            $table->string('availability_status')->default('Available for Hire');
            $table->json('hero_settings')->nullable();
            $table->json('about_stats')->nullable();
            $table->json('contact_info')->nullable();
            $table->json('seo_settings')->nullable();
            $table->json('theme_settings')->nullable();
            $table->json('sections_config')->nullable();
            $table->json('site_settings')->nullable();
        });

        // Expand projects table
        Schema::table('projects', function (Blueprint $table) {
            $table->string('category')->default('Web App')->after('description');
            $table->string('status')->default('published')->after('is_pinned'); // published, draft, archived
            $table->json('screenshots')->nullable();
            $table->string('video_url')->nullable();
            $table->json('features')->nullable();
            $table->unsignedBigInteger('views_count')->default(0);
        });

        // Expand skills table
        Schema::table('skills', function (Blueprint $table) {
            $table->string('category_name')->nullable();
            $table->unsignedTinyInteger('proficiency')->default(85);
            $table->boolean('is_enabled')->default(true);
        });

        // Expand messages table
        Schema::table('messages', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('subject')->nullable()->after('phone');
            $table->string('status')->default('new')->after('is_read'); // new, read, replied, archived, spam
            $table->text('reply_content')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->string('user_agent')->nullable();
        });

        // Experiences
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('position');
            $table->string('period')->nullable();
            $table->string('start_date')->nullable();
            $table->string('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->json('technologies')->nullable();
            $table->string('company_logo')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // Education
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->string('institution');
            $table->string('degree');
            $table->string('field_of_study')->nullable();
            $table->string('start_date')->nullable();
            $table->string('end_date')->nullable();
            $table->string('grade')->nullable();
            $table->text('description')->nullable();
            $table->string('institution_logo')->nullable();
            $table->string('certificate_url')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // Certificates
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('issuer');
            $table->string('issue_date')->nullable();
            $table->string('credential_id')->nullable();
            $table->string('credential_url')->nullable();
            $table->string('image_url')->nullable();
            $table->text('description')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // Achievements
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('date')->nullable();
            $table->string('image_url')->nullable();
            $table->string('external_link')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // Testimonials / Reviews
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('designation')->nullable();
            $table->string('company')->nullable();
            $table->string('avatar_url')->nullable();
            $table->text('content');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->boolean('is_approved')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // Blog / Posts
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('category')->default('Engineering');
            $table->json('tags')->nullable();
            $table->string('status')->default('published'); // draft, published, scheduled
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // Social Links
        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform');
            $table->string('username')->nullable();
            $table->string('url');
            $table->string('icon')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('display_order')->default(0);
            $table->unsignedBigInteger('clicks_count')->default(0);
            $table->timestamps();
        });

        // Media Library
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url', 500);
            $table->string('path', 500);
            $table->string('category')->default('other'); // profile, projects, certificates, gallery, hero, blog, other
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->string('dimensions')->nullable();
            $table->string('mime_type')->nullable();
            $table->timestamps();
        });

        // Navigation Items
        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url');
            $table->string('icon')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // Activity Logs
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('user_name')->default('Admin');
            $table->string('action'); // login, update_profile, create_project, delete_skill, etc.
            $table->text('details')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });

        // Admin Notifications
        Schema::create('admin_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->string('type')->default('info'); // message, review, system, milestone
            $table->string('link')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // Analytics / Visitor Logs
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('ip_hash')->nullable();
            $table->string('page')->default('/');
            $table->string('referrer')->nullable();
            $table->string('device_type')->default('desktop');
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->string('country')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('analytics_events');
        Schema::dropIfExists('admin_notifications');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('navigation_items');
        Schema::dropIfExists('media');
        Schema::dropIfExists('social_links');
        Schema::dropIfExists('blogs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('educations');
        Schema::dropIfExists('experiences');
    }
};
