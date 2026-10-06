<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    ProjectController, SkillController,
    ContactController, ProfileController,
    PortfolioController
};
use App\Http\Controllers\Api\Admin\{
    AuthController, AdminProjectController,
    AdminSkillController, AdminMessageController,
    AdminProfileController, AdminDashboardController,
    AdminContentController
};

// PUBLIC ROUTES
Route::prefix('v1')->group(function () {
    Route::get('/portfolio', [PortfolioController::class, 'index']);
    Route::post('/analytics/event', [PortfolioController::class, 'trackEvent'])->middleware('throttle:60,1');
    Route::post('/socials/{id}/click', [PortfolioController::class, 'trackSocialClick']);
    Route::post('/testimonials', [PortfolioController::class, 'submitReview'])->middleware('throttle:5,60');

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::get('/skills', [SkillController::class, 'index']);
    Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,60');
    Route::get('/resume/download', [ProfileController::class, 'downloadResume']);
});

// ADMIN AUTH
Route::prefix('v1/admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// ADMIN PROTECTED
Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Dashboard, Analytics & Global Search
    Route::get('/stats', [AdminDashboardController::class, 'stats']);
    Route::get('/analytics', [AdminDashboardController::class, 'analytics']);
    Route::get('/search', [AdminDashboardController::class, 'search']);
    Route::get('/backup/export', [AdminDashboardController::class, 'exportBackup']);
    Route::post('/backup/restore', [AdminDashboardController::class, 'restoreBackup']);
    Route::get('/activity-logs', [AdminDashboardController::class, 'activityLogs']);
    Route::get('/notifications', [AdminDashboardController::class, 'notifications']);
    Route::patch('/notifications/{id}/read', [AdminDashboardController::class, 'markNotificationRead']);
    Route::post('/notifications/read-all', [AdminDashboardController::class, 'markAllNotificationsRead']);
    Route::get('/users', [AdminDashboardController::class, 'users']);
    Route::patch('/users/{id}/role', [AdminDashboardController::class, 'updateUserRole']);

    // Profile & Settings
    Route::get('/profile', [AdminProfileController::class, 'show']);
    Route::put('/profile', [AdminProfileController::class, 'update']);
    Route::post('/profile/image', [AdminProfileController::class, 'uploadImage']);
    Route::post('/profile/resume', [AdminProfileController::class, 'uploadResume']);

    // Projects
    Route::apiResource('/projects', AdminProjectController::class);
    Route::patch('/projects/{id}/pin', [AdminProjectController::class, 'togglePin']);
    Route::patch('/projects/{id}/order', [AdminProjectController::class, 'updateOrder']);
    Route::patch('/projects/{id}/status', [AdminProjectController::class, 'updateStatus']);

    // Skills
    Route::apiResource('/skills', AdminSkillController::class);
    Route::patch('/skills/{id}/order', [AdminSkillController::class, 'updateOrder']);
    Route::patch('/skills/{id}/toggle', [AdminSkillController::class, 'toggleEnabled']);

    // Experiences
    Route::get('/experiences', [AdminContentController::class, 'experiences']);
    Route::post('/experiences', [AdminContentController::class, 'storeExperience']);
    Route::put('/experiences/{id}', [AdminContentController::class, 'updateExperience']);
    Route::delete('/experiences/{id}', [AdminContentController::class, 'deleteExperience']);

    // Education
    Route::get('/educations', [AdminContentController::class, 'educations']);
    Route::post('/educations', [AdminContentController::class, 'storeEducation']);
    Route::put('/educations/{id}', [AdminContentController::class, 'updateEducation']);
    Route::delete('/educations/{id}', [AdminContentController::class, 'deleteEducation']);

    // Certificates
    Route::get('/certificates', [AdminContentController::class, 'certificates']);
    Route::post('/certificates', [AdminContentController::class, 'storeCertificate']);
    Route::put('/certificates/{id}', [AdminContentController::class, 'updateCertificate']);
    Route::delete('/certificates/{id}', [AdminContentController::class, 'deleteCertificate']);

    // Achievements
    Route::get('/achievements', [AdminContentController::class, 'achievements']);
    Route::post('/achievements', [AdminContentController::class, 'storeAchievement']);
    Route::put('/achievements/{id}', [AdminContentController::class, 'updateAchievement']);
    Route::delete('/achievements/{id}', [AdminContentController::class, 'deleteAchievement']);

    // Testimonials / Reviews
    Route::get('/testimonials', [AdminContentController::class, 'testimonials']);
    Route::post('/testimonials', [AdminContentController::class, 'storeTestimonial']);
    Route::put('/testimonials/{id}', [AdminContentController::class, 'updateTestimonial']);
    Route::delete('/testimonials/{id}', [AdminContentController::class, 'deleteTestimonial']);
    Route::patch('/testimonials/{id}/approve', [AdminContentController::class, 'toggleApproveTestimonial']);
    Route::patch('/testimonials/{id}/feature', [AdminContentController::class, 'toggleFeatureTestimonial']);

    // Blogs
    Route::get('/blogs', [AdminContentController::class, 'blogs']);
    Route::post('/blogs', [AdminContentController::class, 'storeBlog']);
    Route::put('/blogs/{id}', [AdminContentController::class, 'updateBlog']);
    Route::delete('/blogs/{id}', [AdminContentController::class, 'deleteBlog']);

    // Social Links
    Route::get('/socials', [AdminContentController::class, 'socials']);
    Route::post('/socials', [AdminContentController::class, 'storeSocial']);
    Route::put('/socials/{id}', [AdminContentController::class, 'updateSocial']);
    Route::delete('/socials/{id}', [AdminContentController::class, 'deleteSocial']);

    // Navigation Items
    Route::get('/navigation', [AdminContentController::class, 'navigation']);
    Route::post('/navigation', [AdminContentController::class, 'storeNavigation']);
    Route::put('/navigation/{id}', [AdminContentController::class, 'updateNavigation']);
    Route::delete('/navigation/{id}', [AdminContentController::class, 'deleteNavigation']);

    // Media Library
    Route::get('/media', [AdminContentController::class, 'media']);
    Route::post('/media/upload', [AdminContentController::class, 'uploadMedia']);
    Route::delete('/media/{id}', [AdminContentController::class, 'deleteMedia']);

    // Messages / Inbox
    Route::get('/messages', [AdminMessageController::class, 'index']);
    Route::get('/messages/export', [AdminMessageController::class, 'export']);
    Route::patch('/messages/{id}/read', [AdminMessageController::class, 'markRead']);
    Route::patch('/messages/{id}/status', [AdminMessageController::class, 'updateStatus']);
    Route::post('/messages/{id}/reply', [AdminMessageController::class, 'reply']);
    Route::delete('/messages/{id}', [AdminMessageController::class, 'destroy']);
});
