<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('tagline')->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_image_url', 500)->nullable();
            $table->string('profile_image_public_id')->nullable();
            $table->string('resume_url', 500)->nullable();
            $table->string('resume_public_id')->nullable();
            $table->integer('resume_downloads')->default(0);
            $table->string('github_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('email')->nullable();
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('profiles');
    }
};
