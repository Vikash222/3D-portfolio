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
        // Pricing Packages (Freelance Tiers)
        Schema::create('pricing_packages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->decimal('price_inr', 10, 2);
            $table->string('tagline')->nullable();
            $table->json('features')->nullable();
            $table->integer('delivery_days')->default(7);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Project Requests from Clients
        Schema::create('project_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('category')->default('Full-Stack Web App');
            $table->foreignId('template_project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->string('budget_range')->nullable();
            $table->string('timeline')->nullable();
            $table->text('description');
            $table->json('features_json')->nullable();
            $table->string('status')->default('submitted'); // submitted, in_review, accepted, in_progress, completed, rejected
            $table->string('payment_status')->default('unpaid'); // unpaid, token_paid, fully_paid
            $table->timestamps();
        });

        // Razorpay Payments & Receipts
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('project_request_id')->nullable()->constrained('project_requests')->nullOnDelete();
            $table->string('razorpay_order_id')->index();
            $table->string('razorpay_payment_id')->nullable()->index();
            $table->string('razorpay_signature')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('INR');
            $table->string('status')->default('created'); // created, authorized, captured, failed
            $table->string('package_name')->nullable();
            $table->string('receipt')->nullable();
            $table->json('notes')->nullable();
            $table->timestamps();
        });

        // Add Razorpay keys to profile_settings table if not present
        if (Schema::hasTable('profile_settings')) {
            Schema::table('profile_settings', function (Blueprint $table) {
                if (!Schema::hasColumn('profile_settings', 'razorpay_key_id')) {
                    $table->string('razorpay_key_id')->nullable()->after('instagram');
                }
                if (!Schema::hasColumn('profile_settings', 'razorpay_key_secret')) {
                    $table->string('razorpay_key_secret')->nullable()->after('razorpay_key_id');
                }
                if (!Schema::hasColumn('profile_settings', 'freelance_status')) {
                    $table->string('freelance_status')->default('Available for Hire')->after('razorpay_key_secret');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('project_requests');
        Schema::dropIfExists('pricing_packages');

        if (Schema::hasTable('profile_settings')) {
            Schema::table('profile_settings', function (Blueprint $table) {
                if (Schema::hasColumn('profile_settings', 'razorpay_key_id')) {
                    $table->dropColumn(['razorpay_key_id', 'razorpay_key_secret', 'freelance_status']);
                }
            });
        }
    }
};
