<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class EnsureIsAdmin {
    public function handle(Request $request, Closure $next) {
        if ($request->user() && in_array($request->user()->role, ['admin', 'super_admin', 'editor', 'moderator', 'viewer'])) {
            return $next($request);
        }
        return response()->json(['success' => false, 'message' => 'Forbidden: Admin access required'], 403);
    }
}
