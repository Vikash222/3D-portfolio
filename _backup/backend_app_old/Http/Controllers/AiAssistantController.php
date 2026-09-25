<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use App\Models\ProfileSetting;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiAssistantController extends Controller
{
    /**
     * Handle incoming AI chat query with Google Gemini API & fallback knowledge base.
     */
    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array',
        ]);

        $userMessage = $request->input('message');
        $history = $request->input('history', []);

        // Retrieve database records for grounded context
        $profile = ProfileSetting::first();
        $skills = Skill::orderBy('sort_order')->get();
        $projects = Project::orderBy('sort_order')->get();
        $experiences = Experience::orderBy('sort_order')->get();
        $services = Service::orderBy('sort_order')->get();
        $testimonials = Testimonial::where('is_verified', true)->get();

        $knowledgeContext = $this->buildKnowledgeContext($profile, $skills, $projects, $experiences, $services, $testimonials);

        // Check if user has configured a Google Gemini API Key in Admin CMS or .env
        $apiKey = $profile?->gemini_api_key ?: env('GEMINI_API_KEY');

        if (!empty($apiKey)) {
            try {
                $aiResponse = $this->callGeminiApi($apiKey, $userMessage, $history, $knowledgeContext, $profile);
                if ($aiResponse) {
                    return response()->json([
                        'reply' => $aiResponse,
                        'source' => 'gemini-api',
                    ]);
                }
            } catch (\Exception $e) {
                // Fall back gracefully to internal knowledge matcher
            }
        }

        // Fallback: Smart embedded knowledge responder
        $fallbackReply = $this->generateKnowledgeFallbackReply($userMessage, $profile, $skills, $projects, $experiences, $services);

        return response()->json([
            'reply' => $fallbackReply,
            'source' => 'knowledge-base',
            'has_api_key' => !empty($apiKey),
        ]);
    }

    /**
     * Call Google Gemini API with system instructions and user prompt.
     */
    protected function callGeminiApi(string $apiKey, string $userMessage, array $history, string $knowledgeContext, ?ProfileSetting $profile): ?string
    {
        $customPrompt = $profile?->ai_system_prompt ?: "You are Vikash Kumar's AI Twin and Portfolio Assistant. Vikash is a Computer Science Engineering student at IKGPTU Main Campus, Kapurthala, full-stack developer, and AI enthusiast. Answer the visitor's questions accurately based on the provided knowledge base about Vikash. Match the user's language (English, Hindi, or Hinglish). Encourage visitors to get in touch.";

        $systemInstruction = "{$customPrompt}\n\n[OFFICIAL PORTFOLIO KNOWLEDGE BASE]:\n{$knowledgeContext}";

        // Format contents
        $contents = [];

        // Add relevant history items
        foreach (array_slice($history, -4) as $h) {
            if (!empty($h['text'])) {
                $role = ($h['sender'] ?? 'user') === 'user' ? 'user' : 'model';
                $contents[] = [
                    'role' => $role,
                    'parts' => [['text' => $h['text']]],
                ];
            }
        }

        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $userMessage]],
        ];

        // Call Gemini 3.6 Flash / Latest Flash models
        $models = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];

        foreach ($models as $m) {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$m}:generateContent?key={$apiKey}";
            
            $response = Http::timeout(15)->post($url, [
                'system_instruction' => [
                    'parts' => [['text' => $systemInstruction]],
                ],
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 600,
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $replyText = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                if ($replyText) {
                    return trim($replyText);
                }
            }
        }

        return null;
    }

    /**
     * Assemble structured knowledge context string from database records.
     */
    protected function buildKnowledgeContext($profile, $skills, $projects, $experiences, $services, $testimonials): string
    {
        $context = "NAME: " . ($profile->name ?? 'Vikash Kumar') . "\n";
        $context .= "ROLE: " . ($profile->title ?? 'Computer Science Engineering Student | Full-Stack Developer | AI Enthusiast') . "\n";
        $context .= "EDUCATION: B.Tech Computer Science & Engineering (2nd Year / 4th Sem) at I.K. Gujral Punjab Technical University (IKGPTU), Main Campus, Kapurthala, Punjab (Batch 2024-2028)\n";
        $context .= "PREVIOUS SCHOOLING: Delhi Public School (DPS) - 12th PCM (Completed 2024); Aryan Residential Public School - 10th (Completed 2022)\n";
        $context .= "ORIGIN / LOCATION: From Bihar, India; currently studying in Jalandhar / Kapurthala, Punjab\n";
        $context .= "PASSIONS: NSS volunteering, flood relief donations, cricket, badminton, tech trends\n";
        $context .= "TAGLINE: " . ($profile->tagline ?? '') . "\n";
        $context .= "BIO: " . ($profile->bio ?? '') . "\n";
        $context .= "LEADERSHIP: Core Member & Student Coordinator at National Service Scheme (NSS), IKGPTU. Event registrations, communication workflows, and student logistics.\n";
        $context .= "EMAIL: " . ($profile->email ?? 'heyvikash@icloud.com') . "\n";
        $context .= "PHONE / WHATSAPP: " . ($profile->phone ?? '+91-7493929836') . "\n";
        $context .= "GITHUB: https://github.com/Vikash222/ (16+ active open-source repositories)\n";
        $context .= "INSTAGRAM: https://www.instagram.com/mrvikash7493/\n";
        $context .= "LINKEDIN: https://www.linkedin.com/in/vikash-kumar-ab436131a/\n\n";

        $context .= "TECHNICAL SKILLS:\n";
        foreach ($skills as $s) {
            $context .= "- {$s->name} ({$s->category}): {$s->proficiency}% proficiency, {$s->level} level\n";
        }

        $context .= "\nFEATURED PROJECTS:\n";
        foreach ($projects as $p) {
            $stack = is_array($p->tech_stack) ? implode(', ', $p->tech_stack) : '';
            $context .= "- {$p->title} ({$p->category}): {$p->short_description}. Stack: {$stack}. GitHub: {$p->github_url}\n";
        }

        $context .= "\nEXPERIENCE & LEADERSHIP:\n";
        foreach ($experiences as $e) {
            $context .= "- {$e->role} at {$e->company} ({$e->period}): {$e->description}\n";
        }

        $context .= "\nSERVICES OFFERED:\n";
        foreach ($services as $srv) {
            $context .= "- {$srv->title}: {$srv->description}\n";
        }

        return $context;
    }

    /**
     * Fallback response generator if Gemini API key is missing or unreachable.
     */
    protected function generateKnowledgeFallbackReply(string $query, $profile, $skills, $projects, $experiences, $services): string
    {
        $q = strtolower($query);

        if (preg_match('/\b(hi|hello|hey|namaste|greetings)\b/i', $q) && !preg_match('/\b(who|what|where|how|tell|project|college|study|school|skill|work)\b/i', $q)) {
            return "Hi there! 👋 I am Vikash Kumar's AI Assistant. Vikash is a 2nd-year B.Tech CSE student at IKGPTU Kapurthala, full-stack developer, and NSS coordinator. Ask me anything about his projects, technical stack, college journey, or internship availability!";
        }

        if (str_contains($q, 'study') || str_contains($q, 'college') || str_contains($q, 'university') || str_contains($q, 'ptu') || str_contains($q, 'degree') || str_contains($q, 'education') || str_contains($q, 'school') || str_contains($q, 'year')) {
            return "Vikash is currently in his **2nd Year (4th Semester)** pursuing **B.Tech in Computer Science & Engineering (2024 - 2028)** at **I.K. Gujral Punjab Technical University (IKGPTU), Main Campus, Kapurthala, Punjab**. He completed his 12th (PCM) at **Delhi Public School (DPS)** in 2024 and 10th at **Aryan Residential Public School** in 2022. He is originally from Bihar, India.";
        }

        if (str_contains($q, 'nss') || str_contains($q, 'leadership') || str_contains($q, 'activity') || str_contains($q, 'coordinator')) {
            return "Vikash is a **Core Member and Student Coordinator of NSS at IKGPTU Main Campus**. He coordinates student registrations, event logistics, digital Google Forms/Sheets workflows, QR-based check-ins, and participates actively in flood relief donations, blood donation drives, and tree plantation campaigns.";
        }

        if (str_contains($q, 'hostel') || str_contains($q, 'kavach') || str_contains($q, 'attendance')) {
            return "The **Hostel Attendance & Management System (Hostel Kavach)** is one of Vikash's primary projects! It features GPS/geofenced attendance to prevent proxy marking, multi-role portals (Student, Warden, Caretaker, Mess Clerk, Dean), inventory tracking, and complaint resolution using Node.js, Express, SQLite, and Flutter/Web.";
        }

        if (str_contains($q, 'gate') || str_contains($q, 'smartgate') || str_contains($q, 'entry')) {
            return "**SmartGate** is Vikash's campus gate entry automation platform designed for IKGPTU. It features student self-service temporary QR entry passes and security-guard manual scan workflows built with PHP, Laravel/Node, MySQL, and Leaflet maps.";
        }

        if (str_contains($q, 'resume') || str_contains($q, 'forge')) {
            return "**Resume Forge AI** is an AI-powered ATS-friendly resume creator built with TypeScript, Next.js, and Gemini/OpenAI APIs, deployed on Vercel. It allows students to generate, customize, and export high-impact resumes.";
        }

        if (str_contains($q, 'booking') || str_contains($q, 'smart booking')) {
            return "**Smart Booking System** is Vikash's live online reservation app deployed on Firebase Hosting (https://smart-booking-system-2bcc9.web.app/). Built with React, Tailwind CSS, and Firebase Firestore.";
        }

        if (str_contains($q, 'project') || str_contains($q, 'work') || str_contains($q, 'portfolio') || str_contains($q, 'github')) {
            return "Vikash has 16+ open-source repositories on GitHub (@Vikash222). His flagship systems include:\n1. **Hostel Attendance & Management System** (Geofenced campus check-in)\n2. **Smart Booking System** (Live Firebase app)\n3. **Resume Forge AI** (AI ATS resume builder on Vercel)\n4. **SmartGate / Gate Entry Automation** (Campus security QR gateway)\n5. **SurvilAI-2** (CCTV AI Computer Vision)\n6. **NetworkScannerProject** (Cybersecurity port scanner)";
        }

        if (str_contains($q, 'skill') || str_contains($q, 'tech') || str_contains($q, 'stack') || str_contains($q, 'language')) {
            return "Vikash's core technical stack includes:\n- **Languages**: C++, JavaScript (ES6+), Python, PHP, SQL\n- **Frontend**: React.js, Next.js, Vite, Tailwind CSS, HTML5, CSS3\n- **Backend**: Node.js, Express.js, Laravel, REST APIs\n- **Databases**: MySQL, SQLite, Firebase Firestore\n- **Tools**: Git & GitHub, VS Code, Vercel, Leaflet, Razorpay, EmailJS";
        }

        if (str_contains($q, 'learning') || str_contains($q, 'dsa') || str_contains($q, 'future')) {
            return "Vikash is actively sharpening his problem-solving skills in **Data Structures & Algorithms in C++**, Object-Oriented Programming, Database Management Systems (DBMS), System Design, and Cybersecurity.";
        }

        if (str_contains($q, 'hire') || str_contains($q, 'contact') || str_contains($q, 'call') || str_contains($q, 'email') || str_contains($q, 'reach') || str_contains($q, 'internship') || str_contains($q, 'phone') || str_contains($q, 'whatsapp')) {
            $email = $profile?->email ?? 'heyvikash@icloud.com';
            $phone = $profile?->phone ?? '+91-7493929836';
            return "Vikash is actively looking for software development internships and project collaborations! You can reach him directly via email at **{$email}**, phone/WhatsApp at **{$phone}**, or connect via LinkedIn and Instagram (@mrvikash7493).";
        }

        return "Vikash Kumar is a 2nd-year B.Tech Computer Science Engineering student at IKGPTU Kapurthala and a full-stack developer. Would you like to know about his projects like Hostel Kavach or Smart Booking, his NSS leadership, or his technical skills in React & C++?";
    }
}
