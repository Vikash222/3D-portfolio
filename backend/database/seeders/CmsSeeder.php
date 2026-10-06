<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{
    Profile, Project, Skill, Experience, Education, Certificate,
    Achievement, Testimonial, Blog, SocialLink, NavigationItem,
    AdminNotification, ActivityLog, AnalyticsEvent, Message
};

class CmsSeeder extends Seeder {
    public function run(): void {
        // 1. Profile with full CMS configuration
        Profile::updateOrCreate(
            ['email' => 'connect@mrvikash.in'],
            [
                'name' => 'Vikash Kumar',
                'professional_name' => 'Vikash Kumar',
                'tagline' => 'Full-Stack Developer & AI Systems Engineer',
                'headline' => 'Architecting scalable web and mobile applications with intelligent AI models.',
                'bio' => 'Passionate software engineer pursuing B.Tech CSE at IKGPTU. Specializing in high-performance web systems, modern React ecosystems, and deep learning integrations.',
                'about_description' => 'I focus on building resilient loop architectures, headless CMS engines, and full-stack platforms. Whether reverse-engineering complex software or fine-tuning AI copilots, I thrive on high-impact engineering.',
                'location' => 'Punjab, India',
                'phone' => '+91 98765 43210',
                'availability_status' => 'Open for Summer 2025 Roles',
                'profile_image_url' => '/assets/vikash-hero.jpg',
                'resume_url' => '/assets/resume.pdf',
                'resume_downloads' => 42,
                'github_url' => 'https://github.com/Vikash222',
                'linkedin_url' => 'https://linkedin.com/in/mrvikash-kumar',
                'hero_settings' => [
                    'badge' => 'CSE STUDENT · 2026',
                    'title_prefix' => "Hi, I'm",
                    'highlight_name' => 'Vikash',
                    'tagline' => 'Architecting scalable web and mobile applications, integrated with intelligent AI models.',
                    'primary_btn_text' => 'Explore Work',
                    'primary_btn_link' => '#projects',
                    'secondary_btn_text' => 'Download Resume',
                    'secondary_btn_link' => '#contact',
                    'status_subtext' => 'Top Freelancer · Full-Stack & AI · 2+ Years Exp',
                    'show_availability' => true,
                ],
                'about_stats' => [
                    ['label' => 'GPA', 'value' => '8.5', 'unit' => ''],
                    ['label' => 'Projects', 'value' => '15+', 'unit' => 'Completed'],
                    ['label' => 'Code Commits', 'value' => '1,200+', 'unit' => 'GitHub'],
                    ['label' => 'System Uptime', 'value' => '99.9%', 'unit' => 'Live SLA'],
                ],
                'contact_info' => [
                    'email' => 'connect@mrvikash.in',
                    'phone' => '+91 98765 43210',
                    'location' => 'Jalandhar / Kapurthala, Punjab, India',
                    'response_time' => '2-4 hrs',
                    'available_for' => 'Internships, Freelance, Collaborations',
                    'enable_form' => true,
                ],
                'seo_settings' => [
                    'meta_title' => 'Vikash Kumar | Full-Stack & AI Systems Portfolio',
                    'meta_description' => 'Official portfolio of Vikash Kumar. B.Tech CSE student at IKGPTU, Full-Stack developer & AI engineer.',
                    'keywords' => 'Vikash Kumar, Mr Vikash, Full Stack Developer, IKGPTU, React, Laravel, AI Engineer',
                    'og_title' => 'Vikash Kumar | Portfolio',
                    'og_description' => 'Architecting scalable web and mobile systems.',
                    'canonical_url' => 'https://mrvikash.in',
                ],
                'theme_settings' => [
                    'mode' => 'dark',
                    'primary_color' => '#DDA75B',
                    'accent_color' => '#8A9A86',
                    'background_color' => '#121214',
                    'card_background' => '#1a1a1e',
                    'border_radius' => '12px',
                    'font_family' => 'sans',
                ],
                'sections_config' => [
                    ['id' => 'hero', 'name' => 'Hero Section', 'enabled' => true, 'order' => 1],
                    ['id' => 'about', 'name' => 'About Me', 'enabled' => true, 'order' => 2],
                    ['id' => 'skills', 'name' => 'Skills & Toolkit', 'enabled' => true, 'order' => 3],
                    ['id' => 'projects', 'name' => 'Featured Projects', 'enabled' => true, 'order' => 4],
                    ['id' => 'experience', 'name' => 'Experience Timeline', 'enabled' => true, 'order' => 5],
                    ['id' => 'education', 'name' => 'Education & Academics', 'enabled' => true, 'order' => 6],
                    ['id' => 'certificates', 'name' => 'Certificates', 'enabled' => true, 'order' => 7],
                    ['id' => 'testimonials', 'name' => 'Testimonials', 'enabled' => true, 'order' => 8],
                    ['id' => 'cta', 'name' => 'Call To Action', 'enabled' => true, 'order' => 9],
                    ['id' => 'contact', 'name' => 'Contact & Connect', 'enabled' => true, 'order' => 10],
                ],
                'site_settings' => [
                    'site_name' => 'Vikash Kumar Portfolio',
                    'maintenance_mode' => false,
                    'coming_soon' => false,
                    'enable_reviews' => true,
                    'enable_analytics' => true,
                    'copyright_text' => 'Vikash Kumar © 2025. All Rights Reserved.',
                ]
            ]
        );

        // 2. Projects
        $projects = [
            [
                'title' => 'LoopSense AI Telemetry',
                'description' => 'Real-time telemetry and anomaly detection engine for high-frequency distributed microservices.',
                'long_description' => 'Built with Go and React, LoopSense monitors critical loop cycles, visualizes live throughput, and executes predictive anomaly heuristics using local neural nets.',
                'category' => 'AI / Systems',
                'tech_tags' => ['Go', 'gRPC', 'React 19', 'Prometheus', 'Docker'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                'github_link' => 'https://github.com/Vikash222/LoopSense',
                'live_link' => 'https://loopsense-demo.vercel.app',
                'is_pinned' => true,
                'status' => 'published',
                'display_order' => 1,
                'views_count' => 342,
            ],
            [
                'title' => 'Synapse Headless Core',
                'description' => 'Ultra-low latency headless content delivery engine powered by Laravel 11 and Redis caches.',
                'long_description' => 'Modular REST & GraphQL headless backend designed for cross-platform clients, mobile TWAs, and rich web frontends with role-based JWT authentication.',
                'category' => 'Backend & API',
                'tech_tags' => ['Laravel 11', 'MySQL 8.0', 'Redis', 'Tailwind CSS', 'PHP 8.3'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                'github_link' => 'https://github.com/Vikash222/SynapseCore',
                'live_link' => 'https://synapse.mrvikash.in',
                'is_pinned' => true,
                'status' => 'published',
                'display_order' => 2,
                'views_count' => 285,
            ],
            [
                'title' => '3D Quantum Spatial Visualizer',
                'description' => 'Interactive WebGL spatial physics sandbox and particle engine built with Three.js.',
                'long_description' => 'Features 50k+ interactive particle nodes, custom GLSL shaders, camera dampening, and reactive post-processing bloom pipelines in browser.',
                'category' => 'Frontend & 3D',
                'tech_tags' => ['Three.js', 'React', 'GLSL', 'Vite', 'Framer Motion'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
                'github_link' => 'https://github.com/Vikash222/3D-portfolio',
                'live_link' => 'https://mrvikash.in',
                'is_pinned' => true,
                'status' => 'published',
                'display_order' => 3,
                'views_count' => 512,
            ],
            [
                'title' => 'Algorithmic Alpha Sentinel',
                'description' => 'Deep learning quantitative market forecasting framework utilizing LSTM neural networks.',
                'long_description' => 'Analyzes historical multi-ticker order books, features custom sentiment analysis backtests, and streams live trade signals over WebSockets.',
                'category' => 'AI / ML',
                'tech_tags' => ['Python', 'TensorFlow', 'FastAPI', 'Pandas', 'WebSockets'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
                'github_link' => 'https://github.com/Vikash222/AlphaSentinel',
                'live_link' => '#',
                'is_pinned' => false,
                'status' => 'published',
                'display_order' => 4,
                'views_count' => 198,
            ],
        ];
        foreach ($projects as $p) {
            Project::updateOrCreate(['title' => $p['title']], $p);
        }

        // 3. Skills
        $skills = [
            // Programming Languages
            ['name' => 'Java', 'category' => 'Languages', 'category_name' => 'Programming Languages', 'proficiency' => 92, 'icon' => 'Coffee', 'display_order' => 1],
            ['name' => 'Python', 'category' => 'Languages', 'category_name' => 'Programming Languages', 'proficiency' => 90, 'icon' => 'Terminal', 'display_order' => 2],
            ['name' => 'JavaScript / TypeScript', 'category' => 'Languages', 'category_name' => 'Programming Languages', 'proficiency' => 95, 'icon' => 'Code2', 'display_order' => 3],
            ['name' => 'C / C++', 'category' => 'Languages', 'category_name' => 'Programming Languages', 'proficiency' => 84, 'icon' => 'Cpu', 'display_order' => 4],
            // Frontend
            ['name' => 'React 19 & Next.js', 'category' => 'Web', 'category_name' => 'Frontend', 'proficiency' => 96, 'icon' => 'Layers', 'display_order' => 5],
            ['name' => 'Tailwind CSS & Shadcn', 'category' => 'Web', 'category_name' => 'Frontend', 'proficiency' => 94, 'icon' => 'Palette', 'display_order' => 6],
            ['name' => 'Three.js & WebGL', 'category' => 'Web', 'category_name' => 'Frontend', 'proficiency' => 82, 'icon' => 'Box', 'display_order' => 7],
            // Backend & Databases
            ['name' => 'Laravel 11 & PHP 8.3', 'category' => 'Web', 'category_name' => 'Backend', 'proficiency' => 93, 'icon' => 'Server', 'display_order' => 8],
            ['name' => 'Node.js & Express', 'category' => 'Web', 'category_name' => 'Backend', 'proficiency' => 88, 'icon' => 'Globe', 'display_order' => 9],
            ['name' => 'MySQL 8.0 & SQLite', 'category' => 'Tools', 'category_name' => 'Database', 'proficiency' => 90, 'icon' => 'Database', 'display_order' => 10],
            ['name' => 'Docker & Linux', 'category' => 'Tools', 'category_name' => 'DevOps', 'proficiency' => 85, 'icon' => 'Container', 'display_order' => 11],
            // AI/ML & Concepts
            ['name' => 'PyTorch & HuggingFace', 'category' => 'Concepts', 'category_name' => 'AI/ML', 'proficiency' => 82, 'icon' => 'Sparkles', 'display_order' => 12],
            ['name' => 'DSA & System Design', 'category' => 'Concepts', 'category_name' => 'Concepts', 'proficiency' => 90, 'icon' => 'GitBranch', 'display_order' => 13],
            ['name' => 'REST APIs & WebSockets', 'category' => 'Concepts', 'category_name' => 'Concepts', 'proficiency' => 94, 'icon' => 'Workflow', 'display_order' => 14],
        ];
        foreach ($skills as $s) {
            Skill::updateOrCreate(['name' => $s['name']], $s);
        }

        // 4. Experiences
        $experiences = [
            [
                'company' => 'Apex Systems & Solutions',
                'position' => 'Full-Stack Developer Intern',
                'period' => 'Jun 2024 - Present',
                'start_date' => '2024-06-01',
                'is_current' => true,
                'location' => 'Remote',
                'description' => 'Architecting scalable dashboard portals, integrating headless REST endpoints, and optimizing client-side bundle load times by 40%.',
                'technologies' => ['React', 'Laravel', 'MySQL', 'Tailwind CSS'],
                'display_order' => 1,
            ],
            [
                'company' => 'Self-Employed / Freelance',
                'position' => 'Software Engineer & AI Consultant',
                'period' => '2023 - 2024',
                'start_date' => '2023-01-01',
                'end_date' => '2024-05-31',
                'is_current' => false,
                'location' => 'Global Clients',
                'description' => 'Delivered 12+ tailored software solutions for international clients ranging from e-commerce platforms to automated scraping and AI telemetry pipelines.',
                'technologies' => ['Python', 'FastAPI', 'Node.js', 'React'],
                'display_order' => 2,
            ],
        ];
        foreach ($experiences as $exp) {
            Experience::updateOrCreate(['company' => $exp['company'], 'position' => $exp['position']], $exp);
        }

        // 5. Educations
        $educations = [
            [
                'institution' => 'I.K. Gujral Punjab Technical University',
                'degree' => 'Bachelor of Technology (B.Tech)',
                'field_of_study' => 'Computer Science & Engineering',
                'start_date' => '2022',
                'end_date' => '2026',
                'grade' => '8.5 CGPA',
                'description' => 'Focused on Data Structures, Algorithms, Distributed Systems, Software Architecture, and Artificial Intelligence.',
                'display_order' => 1,
            ],
        ];
        foreach ($educations as $edu) {
            Education::updateOrCreate(['institution' => $edu['institution']], $edu);
        }

        // 6. Certificates
        $certificates = [
            [
                'title' => 'Meta Full-Stack Professional Certificate',
                'issuer' => 'Meta / Coursera',
                'issue_date' => '2024',
                'credential_id' => 'META-FS-94810',
                'credential_url' => 'https://coursera.org',
                'description' => 'Rigorous specialization covering React, Django/Laravel, APIs, databases, CI/CD, and web security.',
                'display_order' => 1,
            ],
            [
                'title' => 'Google Cloud Associate Cloud Engineer',
                'issuer' => 'Google Cloud',
                'issue_date' => '2024',
                'credential_id' => 'GCP-ACE-81923',
                'credential_url' => 'https://cloud.google.com',
                'description' => 'Deployment, security, monitoring, and scaling of containerized microservices on cloud infrastructure.',
                'display_order' => 2,
            ],
        ];
        foreach ($certificates as $cert) {
            Certificate::updateOrCreate(['title' => $cert['title']], $cert);
        }

        // 7. Achievements
        $achievements = [
            [
                'title' => 'Smart India Hackathon Finalist',
                'description' => 'Led a 6-member team building an automated AI-driven public safety response system.',
                'date' => '2024',
                'display_order' => 1,
            ],
            [
                'title' => '500+ LeetCode & CodeChef Problems Solved',
                'description' => 'Consistent algorithmic competitive programming problem solver across tree, graph, and DP paradigms.',
                'date' => '2023 - Present',
                'display_order' => 2,
            ],
        ];
        foreach ($achievements as $ach) {
            Achievement::updateOrCreate(['title' => $ach['title']], $ach);
        }

        // 8. Testimonials (Kept clean for authentic client and peer reviews)
        $testimonials = [];
        foreach ($testimonials as $t) {
            Testimonial::updateOrCreate(['name' => $t['name']], $t);
        }

        // 9. Social Links
        $socials = [
            ['platform' => 'GitHub', 'username' => 'Vikash222', 'url' => 'https://github.com/Vikash222', 'icon' => 'Github', 'is_visible' => true, 'display_order' => 1, 'clicks_count' => 142],
            ['platform' => 'LinkedIn', 'username' => 'mrvikash-kumar', 'url' => 'https://linkedin.com/in/mrvikash-kumar', 'icon' => 'Linkedin', 'is_visible' => true, 'display_order' => 2, 'clicks_count' => 98],
            ['platform' => 'Instagram', 'username' => 'mrvikash7493', 'url' => 'https://instagram.com/mrvikash7493', 'icon' => 'Instagram', 'is_visible' => true, 'display_order' => 3, 'clicks_count' => 54],
            ['platform' => 'X / Twitter', 'username' => 'vikash_dev', 'url' => 'https://x.com', 'icon' => 'Twitter', 'is_visible' => true, 'display_order' => 4, 'clicks_count' => 29],
            ['platform' => 'Email', 'username' => 'connect@mrvikash.in', 'url' => 'mailto:connect@mrvikash.in', 'icon' => 'Mail', 'is_visible' => true, 'display_order' => 5, 'clicks_count' => 67],
        ];
        foreach ($socials as $s) {
            SocialLink::updateOrCreate(['platform' => $s['platform']], $s);
        }

        // 10. Navigation Items
        $navs = [
            ['label' => 'Home', 'url' => '#', 'icon' => 'Home', 'is_visible' => true, 'display_order' => 1],
            ['label' => 'About', 'url' => '#about', 'icon' => 'User', 'is_visible' => true, 'display_order' => 2],
            ['label' => 'Skills', 'url' => '#skills', 'icon' => 'Wrench', 'is_visible' => true, 'display_order' => 3],
            ['label' => 'Projects', 'url' => '#projects', 'icon' => 'FolderGit2', 'is_visible' => true, 'display_order' => 4],
            ['label' => 'Experience', 'url' => '#experience', 'icon' => 'Briefcase', 'is_visible' => true, 'display_order' => 5],
            ['label' => 'Contact', 'url' => '#contact', 'icon' => 'Send', 'is_visible' => true, 'display_order' => 6],
        ];
        foreach ($navs as $n) {
            NavigationItem::updateOrCreate(['label' => $n['label']], $n);
        }

        // 11. Initial Admin Notifications
        AdminNotification::create([
            'title' => 'Admin CMS Initialized',
            'message' => 'Portfolio Admin Dashboard is live and linked with database.',
            'type' => 'system',
            'link' => '/admin',
            'is_read' => false
        ]);

        // 12. Messages table kept clean for real user inquiries (No mock messages)

        // 13. Activity Logs
        ActivityLog::create([
            'user_name' => 'Vikash Kumar',
            'action' => 'login',
            'details' => 'Admin authenticated from local workstation',
            'ip_address' => '127.0.0.1',
        ]);
        ActivityLog::create([
            'user_name' => 'Vikash Kumar',
            'action' => 'update_settings',
            'details' => 'Updated hero section availability badge and SEO meta tags',
            'ip_address' => '127.0.0.1',
        ]);

        // 14. Sample Analytics Events
        $devices = ['desktop', 'desktop', 'mobile', 'mobile', 'tablet'];
        $browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
        $countries = ['India', 'United States', 'United Kingdom', 'Germany', 'Canada'];
        for ($i = 0; $i < 25; $i++) {
            AnalyticsEvent::create([
                'ip_hash' => hash('sha256', 'visitor_' . $i),
                'page' => $i % 4 == 0 ? '/#projects' : ($i % 3 == 0 ? '/#about' : '/'),
                'referrer' => $i % 3 == 0 ? 'https://linkedin.com' : ($i % 2 == 0 ? 'https://github.com' : 'Direct'),
                'device_type' => $devices[$i % count($devices)],
                'browser' => $browsers[$i % count($browsers)],
                'os' => 'macOS',
                'country' => $countries[$i % count($countries)],
                'created_at' => now()->subHours(rand(1, 72)),
            ]);
        }
    }
}
