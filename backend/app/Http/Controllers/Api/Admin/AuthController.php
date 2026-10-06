<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller {
    use ApiResponse;

    public function login(Request $request) {
        $request->validate(['email' => 'required|email', 'password' => 'required']);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error('Invalid credentials', 401);
        }
        if (!in_array($user->role, ['admin', 'super_admin', 'editor', 'moderator', 'viewer'])) {
            return $this->error('Unauthorized account level', 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('admin-token')->plainTextToken;
        $user->update(['last_login_at' => now()]);

        ActivityLog::create([
            'user_id' => $user->id,
            'user_name' => $user->name,
            'action' => 'login',
            'details' => 'Admin successfully logged in',
            'ip_address' => $request->ip(),
        ]);

        return $this->success(['user' => $user, 'token' => $token], 'Logged in');
    }

    public function me(Request $request) {
        return $this->success($request->user());
    }

    public function logout(Request $request) {
        if ($request->user()) {
            ActivityLog::create([
                'user_id' => $request->user()->id,
                'user_name' => $request->user()->name,
                'action' => 'logout',
                'details' => 'Admin logged out',
                'ip_address' => $request->ip(),
            ]);
            $request->user()->currentAccessToken()->delete();
        }
        return $this->success(null, 'Logged out');
    }
}
