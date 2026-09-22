<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Message;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get aggregate KPIs and recent items for Admin dashboard.
     */
    public function stats(): JsonResponse
    {
        $totalMessages = Message::count();
        $unreadMessages = Message::where('is_read', false)->count();
        $totalProjects = Project::count();
        $totalSkills = Skill::count();
        $totalExperience = Experience::count();

        $recentMessages = Message::orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'stats' => [
                'total_messages' => $totalMessages,
                'unread_messages' => $unreadMessages,
                'total_projects' => $totalProjects,
                'total_skills' => $totalSkills,
                'total_experience' => $totalExperience,
            ],
            'recent_messages' => $recentMessages,
        ]);
    }
}
