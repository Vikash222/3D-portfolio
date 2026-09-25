<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    ProjectController, SkillController,
    ContactController, ProfileController
};
use App\Http\Controllers\Api\Admin\{
    AuthController, AdminProjectController,
    AdminSkillController, AdminMessageController,
    AdminProfileController
};

// PUBLIC ROUTES
Route::prefix('v1')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::get('/skills', [SkillController::class, 'index']);
    Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:3,60');
    Route::get('/resume/download', [ProfileController::class, 'downloadResume']);
});

// ADMIN AUTH
Route::prefix('v1/admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// ADMIN PROTECTED
Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/stats', [AdminProfileController::class, 'stats']);
    Route::get('/profile', [AdminProfileController::class, 'show']);
    Route::put('/profile', [AdminProfileController::class, 'update']);
    Route::post('/profile/image', [AdminProfileController::class, 'uploadImage']);
    Route::post('/profile/resume', [AdminProfileController::class, 'uploadResume']);
    Route::apiResource('/projects', AdminProjectController::class);
    Route::patch('/projects/{id}/pin', [AdminProjectController::class, 'togglePin']);
    Route::patch('/projects/{id}/order', [AdminProjectController::class, 'updateOrder']);
    Route::apiResource('/skills', AdminSkillController::class);
    Route::patch('/skills/{id}/order', [AdminSkillController::class, 'updateOrder']);
    Route::get('/messages', [AdminMessageController::class, 'index']);
    Route::patch('/messages/{id}/read', [AdminMessageController::class, 'markRead']);
    Route::delete('/messages/{id}', [AdminMessageController::class, 'destroy']);
});
