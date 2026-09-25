<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->enum('category', ['Languages', 'Web', 'Tools', 'Concepts']);
            $table->unsignedTinyInteger('proficiency_level')->default(3);
            $table->string('icon', 100)->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
            $table->index('category');
        });
    }
    public function down() {
        Schema::dropIfExists('skills');
    }
};
