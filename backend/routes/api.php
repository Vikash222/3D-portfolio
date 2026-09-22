<?php

use App\Http\Controllers\Admin\AdminConversationController;
use App\Http\Controllers\Admin\AdminPricingController;
use App\Http\Controllers\Admin\AdminProjectTemplateController;
use App\Http\Controllers\Admin\AiSettingsController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\FileUploadController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\SocialPostController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\AiAssistantController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Client\ClientConversationController;
use App\Http\Controllers\Client\ClientProjectRequestController;
use App\Http\Controllers\Client\RazorpayPaymentController;
use App\Http\Controllers\PublicPortfolioController;
use App\Http\Controllers\SocialFeedController;
use App\Http\Controllers\TwoFactorController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/health', function () {
    try {
        \DB::connection()->getPdo();
        $dbStatus = 'connected';
    } catch (\Exception $e) {
        $dbStatus = 'error: ' . $e->getMessage();
    }

    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toIso8601String(),
        'database' => $dbStatus,
        'environment' => config('app.env'),
        'version' => '1.0.0',
    ]);
});

Route::get('/portfolio', [PublicPortfolioController::class, 'index']);
Route::get('/pricing-packages', [PublicPortfolioController::class, 'pricingPackages']);
Route::get('/project-templates', [PublicPortfolioController::class, 'projectTemplates']);
Route::get('/social-feed', [SocialFeedController::class, 'index']);
Route::post('/contact', [PublicPortfolioController::class, 'contact']);
Route::post('/chat/assistant', [AiAssistantController::class, 'chat']);

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'googleAuth']);
Route::post('/auth/microsoft', [AuthController::class, 'microsoftAuth']);
Route::post('/auth/2fa/verify', [AuthController::class, 'verify2Fa']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Current User & Logout
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Client Inquiries
    Route::get('/client/inquiries', [AuthController::class, 'myInquiries']);

    // Client Live 1-on-1 Conversation with Vikash
    Route::get('/client/conversation', [ClientConversationController::class, 'getActiveConversation']);
    Route::post('/client/conversation/message', [ClientConversationController::class, 'sendMessage']);
    Route::post('/client/conversation/mark-read', [ClientConversationController::class, 'markAsRead']);

    // Client Project Requests & Template Chooser
    Route::get('/client/project-requests', [ClientProjectRequestController::class, 'index']);
    Route::post('/client/project-requests', [ClientProjectRequestController::class, 'store']);
    Route::get('/client/project-requests/{projectRequest}', [ClientProjectRequestController::class, 'show']);

    // Razorpay Payments & Receipts
    Route::post('/client/payment/order', [RazorpayPaymentController::class, 'createOrder']);
    Route::post('/client/payment/verify', [RazorpayPaymentController::class, 'verifyPayment']);
    Route::get('/client/payments', [RazorpayPaymentController::class, 'myPayments']);
    Route::post('/admin/payments/{payment}/approve', [RazorpayPaymentController::class, 'approvePayment']);
    Route::post('/admin/payments/{payment}/reject', [RazorpayPaymentController::class, 'rejectPayment']);
    Route::post('/admin/razorpay/test-connection', [RazorpayPaymentController::class, 'testConnection']);

    // Admin File Uploads (Images, Snaps, Resume PDF)
    Route::post('/admin/upload', [FileUploadController::class, 'upload']);

    // Two-Factor Authentication (Microsoft Authenticator TOTP)
    Route::post('/admin/2fa/setup', [TwoFactorController::class, 'setup']);
    Route::post('/admin/2fa/confirm', [TwoFactorController::class, 'confirm']);
    Route::post('/admin/2fa/disable', [TwoFactorController::class, 'disable']);
    Route::post('/admin/2fa/recovery-codes', [TwoFactorController::class, 'regenerateRecoveryCodes']);

    // Dashboard Overview
    Route::get('/admin/stats', [DashboardController::class, 'stats']);

    // Contact Messages Inbox
    Route::get('/admin/messages', [MessageController::class, 'index']);
    Route::get('/admin/messages/{message}', [MessageController::class, 'show']);
    Route::patch('/admin/messages/{message}/toggle-read', [MessageController::class, 'toggleRead']);
    Route::patch('/admin/messages/{message}/status', [MessageController::class, 'updateStatus']);
    Route::delete('/admin/messages/{message}', [MessageController::class, 'destroy']);
    Route::post('/admin/messages/bulk', [MessageController::class, 'bulkAction']);

    // Content Management (100% Fully Editable CMS)
    Route::apiResource('admin/projects', ProjectController::class);
    Route::apiResource('admin/skills', SkillController::class);
    Route::apiResource('admin/experience', ExperienceController::class);
    Route::apiResource('admin/services', ServiceController::class);
    Route::apiResource('admin/testimonials', TestimonialController::class);
    Route::apiResource('admin/social-posts', SocialPostController::class);
    Route::patch('admin/social-posts/{socialPost}/toggle-pin', [SocialPostController::class, 'togglePin']);

    // Profile Settings
    Route::get('/admin/profile', [ProfileController::class, 'show']);
    Route::put('/admin/profile', [ProfileController::class, 'update']);

    // Admin Live Conversations & Dual Reply System
    Route::get('/admin/conversations', [AdminConversationController::class, 'index']);
    Route::get('/admin/conversations/{conversation}', [AdminConversationController::class, 'show']);
    Route::post('/admin/conversations/{conversation}/message', [AdminConversationController::class, 'sendMessage']);
    Route::post('/admin/conversations/reply-to-inquiry', [AdminConversationController::class, 'replyToInquiry']);
    Route::get('/admin/client-project-requests', [AdminConversationController::class, 'listProjectRequests']);
    Route::patch('/admin/client-project-requests/{projectRequest}', [AdminConversationController::class, 'updateProjectRequest']);
    Route::delete('/admin/client-project-requests/{projectRequest}', [AdminConversationController::class, 'deleteProjectRequest']);

    // Admin Freelance Pricing Packages & Project Builder Templates
    Route::apiResource('admin/pricing-packages', AdminPricingController::class);
    Route::apiResource('admin/project-templates', AdminProjectTemplateController::class);

    // AI Assistant Configuration
    Route::get('/admin/ai-settings', [AiSettingsController::class, 'show']);
    Route::put('/admin/ai-settings', [AiSettingsController::class, 'update']);
    Route::post('/admin/ai-settings/test', [AiSettingsController::class, 'testConnection']);
});
