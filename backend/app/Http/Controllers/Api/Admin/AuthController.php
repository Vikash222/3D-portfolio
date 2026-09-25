<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class AuthController extends Controller {
    use ApiResponse;
    public function login(Request $request) {
        $request->validate(['email' => 'required|email', 'password' => 'required']);
        $user = User::where('email', $request->email)->where('role', 'admin')->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error('Invalid credentials', 401);
        }
        $user->tokens()->delete();
        $token = $user->createToken('admin-token')->plainTextToken;
        $user->update(['last_login_at' => now()]);
        return $this->success(['user' => $user, 'token' => $token], 'Logged in');
    }
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Logged out');
    }
}
