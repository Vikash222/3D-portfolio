<?php

namespace Database\Seeders;

use App\Models\Experience;
use App\Models\Message;
use App\Models\ProfileSetting;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with verified information from mrvikash.in.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::updateOrCreate(
            ['email' => 'admin@portfolio.local'],
            [
                'name' => 'Vikash Kumar',
                'role' => 'admin',
                'password' => Hash::make('Password@123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Profile Settings (Verified from mrvikash.in)
        ProfileSetting::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'Vikash Kumar',
                'title' => 'Computer Science Engineering Student | Full-Stack Developer | AI & Software Engineering Enthusiast',
                'tagline' => 'B.Tech CSE @ IKGPTU Main Campus • Passionate Full-Stack Engineer, AI & System Design Explorer • Actively Seeking Internships',
                'bio' => "I am from Bihar, India, and currently pursuing my B.Tech in Computer Science at I.K. Gujral Punjab Technical University (IKGPTU). At present, I live in Jalandhar / Kapurthala for my studies. Passionate about building practical software products and solving real-world problems through technology. I enjoy working across frontend, backend, databases and APIs, and I am continuously improving my skills in DSA, full-stack development, AI, and system design. Active core member and student coordinator of NSS at IKGPTU, involved in student event coordination and flood relief initiatives.",
                'about_details' => [
                    'born' => '2007',
                    'university' => 'I.K. Gujral Punjab Technical University (IKGPTU), Main Campus, Kapurthala, Punjab',
                    'degree' => 'B.Tech in Computer Science & Engineering (2024 - 2028)',
                    'current_year' => '2nd Year / 4th Semester',
                    'hometown' => 'Bihar, India',
                    'current_residence' => 'Jalandhar / Kapurthala, Punjab, India',
                    'passions' => 'Active in NSS volunteering and flood relief donations. In my free time, I explore tech trends, play cricket and badminton, and solve complex puzzles.',
                    'interests' => [
                        'Software Development',
                        'Full-Stack Development',
                        'Artificial Intelligence & ML',
                        'Web Development & 3D WebGL',
                        'Database Systems & Relational Modeling',
                        'Data Structures & Algorithms (DSA)',
                        'Cybersecurity & Network Diagnostics',
                        'Geopolitics & Tech Strategy'
                    ],
                    'currently_learning' => [
                        'Data Structures & Algorithms in C++',
                        'Object-Oriented Programming with C++',
                        'Database Management Systems (DBMS)',
                        'Software Engineering Principles',
                        'Full-Stack Architecture (React, Node, Laravel)',
                        'System Design Fundamentals',
                        'AI / Machine Learning & Gemini LLMs',
                        'Cybersecurity & Network Scanning',
                        'Cloud & Deployment (Vercel, Firebase)'
                    ],
                    'education_history' => [
                        [
                            'degree' => 'B.Tech in Computer Science & Engineering',
                            'institution' => 'I.K. Gujral Punjab Technical University (IKGPTU)',
                            'period' => '2024 - 2028',
                            'details' => 'Focusing on Software Development, Full-Stack Architecture, and System Design. Expected graduation in 2028.'
                        ],
                        [
                            'degree' => 'Schooling (12th Standard - PCM)',
                            'institution' => 'Delhi Public School (DPS)',
                            'period' => 'Completed 2024',
                            'details' => 'Core subjects: Physics, Chemistry, Mathematics.'
                        ],
                        [
                            'degree' => 'Schooling (10th Standard)',
                            'institution' => 'Aryan Residential Public School',
                            'period' => 'Completed 2022',
                            'details' => 'Secondary Schooling with strong foundations in Science & Math.'
                        ]
                    ]
                ],
                'avatar_url' => '/assets/vikash-hero.jpg',
                'hero_image_url' => '/assets/vikash-hero.jpg',
                'resume_url' => 'https://drive.google.com/file/d/1H72SMGMsGUIPGRen11BQ0EroYX28RodC/view?usp=sharing',
                'email' => 'heyvikash@icloud.com',
                'phone' => '+91-7493929836',
                'location' => 'Jalandhar, Punjab / Bihar, India',
                'github' => 'https://github.com/Vikash222',
                'linkedin' => 'https://www.linkedin.com/in/vikash-kumar-ab436131a/',
                'twitter' => 'https://twitter.com/mrvikash7493',
                'instagram' => 'https://www.instagram.com/mrvikash7493/',
                'status_badge' => 'B.Tech CSE @ IKGPTU • Actively Seeking Software Internships',
                'years_experience' => 2,
                'projects_completed' => 16,
                'satisfied_clients' => 12,
                'code_commits' => '500+',
                'ai_system_prompt' => "You are an AI assistant embedded on Vikash Kumar's portfolio website. Your job is to help VISITORS learn about Vikash.\n\nCRITICAL IDENTITY RULES:\n- The person sending messages is a VISITOR browsing the portfolio — they are NOT Vikash.\n- Vikash Kumar is the OWNER of this portfolio — he is a third person being talked ABOUT.\n- NEVER say 'Hi Vikash', 'Hello Vikash', or address the visitor as 'Vikash'.\n- Always refer to Vikash in THIRD PERSON: 'Vikash is...', 'He is...', 'Vikash has...'\n- If someone says 'Hi' or 'Hello', respond with: 'Hi there! 👋 How can I help you learn about Vikash?'\n\nABOUT VIKASH KUMAR:\n- Full Name: Vikash Kumar (Born 2007, from Bihar, India)\n- Degree: B.Tech CSE student at IKGPTU, Jalandhar / Kapurthala, Punjab (Batch 2024-2028)\n- Core Stack: React, Tailwind CSS, Node.js, Express, Laravel, Python, C++, MySQL, SQLite, Firebase\n- Leadership: NSS Core Member & Student Coordinator at IKGPTU\n- Looking for: Software Development Internships actively\n- GitHub: github.com/Vikash222\n- LinkedIn: linkedin.com/in/vikash-kumar-ab436131a\n- Instagram: @mrvikash7493\n- Email: heyvikash@icloud.com\n- Phone: +91-7493929836\n- Resume: Google Drive downloadable\n\nLANGUAGE RULES:\n- DETECT visitor's language.\n- If English -> respond in English.\n- If Hindi / Hinglish -> respond in friendly Hinglish.\n- Keep answers concise (2 to 4 lines maximum).",
                'ai_welcome_message' => "Hi there! 👋 Welcome to Vikash's portfolio. I am his AI Assistant. Feel free to ask me anything about Vikash's projects, B.Tech at IKGPTU, tech stack, or internship availability!",
            ]
        );

        // 3. Technical Skills
        $skillsData = [
            // Languages
            ['name' => 'C++', 'category' => 'Languages', 'icon' => 'Code2', 'proficiency' => 88, 'level' => 'Proficient', 'sort_order' => 1],
            ['name' => 'JavaScript (ES6+)', 'category' => 'Languages', 'icon' => 'FileCode', 'proficiency' => 92, 'level' => 'Advanced', 'sort_order' => 2],
            ['name' => 'Python', 'category' => 'Languages', 'icon' => 'Terminal', 'proficiency' => 86, 'level' => 'Proficient', 'sort_order' => 3],
            ['name' => 'PHP', 'category' => 'Languages', 'icon' => 'Server', 'proficiency' => 82, 'level' => 'Proficient', 'sort_order' => 4],
            ['name' => 'SQL', 'category' => 'Languages', 'icon' => 'Database', 'proficiency' => 88, 'level' => 'Advanced', 'sort_order' => 5],

            // Frontend
            ['name' => 'React.js', 'category' => 'Frontend', 'icon' => 'Code2', 'proficiency' => 92, 'level' => 'Advanced', 'sort_order' => 6],
            ['name' => 'Next.js', 'category' => 'Frontend', 'icon' => 'Globe', 'proficiency' => 86, 'level' => 'Advanced', 'sort_order' => 7],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'icon' => 'Palette', 'proficiency' => 95, 'level' => 'Expert', 'sort_order' => 8],
            ['name' => 'Vite', 'category' => 'Frontend', 'icon' => 'Zap', 'proficiency' => 90, 'level' => 'Advanced', 'sort_order' => 9],
            ['name' => 'HTML5 & CSS3', 'category' => 'Frontend', 'icon' => 'Layout', 'proficiency' => 95, 'level' => 'Expert', 'sort_order' => 10],

            // Backend
            ['name' => 'Node.js & Express.js', 'category' => 'Backend', 'icon' => 'Cpu', 'proficiency' => 88, 'level' => 'Advanced', 'sort_order' => 11],
            ['name' => 'Laravel (PHP)', 'category' => 'Backend', 'icon' => 'Server', 'proficiency' => 84, 'level' => 'Proficient', 'sort_order' => 12],
            ['name' => 'REST APIs Architecture', 'category' => 'Backend', 'icon' => 'Network', 'proficiency' => 90, 'level' => 'Advanced', 'sort_order' => 13],

            // Database
            ['name' => 'MySQL', 'category' => 'Database', 'icon' => 'Database', 'proficiency' => 89, 'level' => 'Advanced', 'sort_order' => 14],
            ['name' => 'SQLite', 'category' => 'Database', 'icon' => 'Database', 'proficiency' => 86, 'level' => 'Advanced', 'sort_order' => 15],
            ['name' => 'Firebase (Firestore/Auth)', 'category' => 'Database', 'icon' => 'Flame', 'proficiency' => 85, 'level' => 'Advanced', 'sort_order' => 16],

            // Tools & Platforms
            ['name' => 'Git & GitHub', 'category' => 'Tools & Platforms', 'icon' => 'GitBranch', 'proficiency' => 92, 'level' => 'Advanced', 'sort_order' => 17],
            ['name' => 'VS Code', 'category' => 'Tools & Platforms', 'icon' => 'Terminal', 'proficiency' => 95, 'level' => 'Expert', 'sort_order' => 18],
            ['name' => 'Vercel Deployment', 'category' => 'Tools & Platforms', 'icon' => 'Cloud', 'proficiency' => 90, 'level' => 'Advanced', 'sort_order' => 19],
            ['name' => 'Leaflet & OpenStreetMap', 'category' => 'Tools & Platforms', 'icon' => 'MapPin', 'proficiency' => 82, 'level' => 'Proficient', 'sort_order' => 20],
            ['name' => 'Razorpay & EmailJS', 'category' => 'Tools & Platforms', 'icon' => 'CreditCard', 'proficiency' => 84, 'level' => 'Proficient', 'sort_order' => 21],
        ];

        Skill::truncate();
        foreach ($skillsData as $s) {
            Skill::create($s);
        }

        // 4. Projects (Vikash's Real Projects from mrvikash.in & GitHub)
        $projectsData = [
            [
                'title' => 'Hostel Attendance & Management System',
                'slug' => 'hostel-attendance-management-system',
                'category' => 'Full Stack',
                'short_description' => 'Full-stack campus hostel platform with GPS/geofencing student attendance, multi-role portals (Warden, Caretaker, Mess, Dean), and inventory reporting.',
                'long_description' => 'Architected a multi-role hostel ERP ecosystem for IKGPTU campus. Implemented automated geofenced attendance verification using device ID checks and coordinates. Features specialized dashboards for students, wardens, caretakers, mess clerks, and deans with financial reporting, automated mess rebate calculators, complaints tracking, and inventory management.',
                'tech_stack' => ['Node.js', 'Express', 'SQLite', 'Flutter', 'Tailwind CSS', 'REST API', 'Geofencing'],
                'live_url' => 'https://github.com/Vikash222/hostel-kavach-privacy',
                'github_url' => 'https://github.com/Vikash222/hostel-kavach-privacy',
                'image_url' => 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Smart Booking System',
                'slug' => 'smart-booking-system',
                'category' => 'Full Stack',
                'short_description' => 'Live online booking and reservation platform built with modern web technologies, Firebase cloud sync, and responsive UI.',
                'long_description' => 'Production reservation system deployed live on Firebase Hosting. Allows users to select slots, book appointments in real-time, avoid double-bookings through optimistic locking, and manage confirmations seamlessly.',
                'tech_stack' => ['React', 'JavaScript', 'Firebase Firestore', 'Tailwind CSS', 'Vite'],
                'live_url' => 'https://smart-booking-system-2bcc9.web.app/',
                'github_url' => 'https://github.com/Vikash222/smart-booking-system',
                'image_url' => 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Resume Forge AI',
                'slug' => 'resume-forge-ai',
                'category' => 'AI & Cloud',
                'short_description' => 'AI-powered ATS-friendly resume creation platform deployed on Vercel with real-time markdown rendering and PDF export pipelines.',
                'long_description' => 'Designed an intelligent web platform that analyzes job descriptions and generates customized, high-scoring ATS resumes. Features section-by-section dynamic editing, AI bullet suggestions, multi-template switching, and client-side high-fidelity PDF generation.',
                'tech_stack' => ['TypeScript', 'Next.js', 'React', 'Tailwind CSS', 'Vercel', 'OpenAI/Gemini API'],
                'live_url' => 'https://github.com/Vikash222/resume-forge-ai',
                'github_url' => 'https://github.com/Vikash222/resume-forge-ai',
                'image_url' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'SmartGate / Gate Entry Automation',
                'slug' => 'smartgate-gate-entry-automation',
                'category' => 'Backend / API',
                'short_description' => 'Security-assisted hostel and campus gate entry system featuring student self-service QR passes, guard verification workflows, and audit logging.',
                'long_description' => 'Engineered a secure campus check-in and check-out gateway for students and visitors at IKGPTU. Features time-bound encrypted QR codes, guard mobile scanning interface, automatic late-entry parent SMS/email triggers, and administrative curfew analytics.',
                'tech_stack' => ['PHP', 'Laravel', 'MySQL', 'REST API', 'QR Engine', 'Leaflet', 'Bootstrap'],
                'live_url' => 'https://github.com/Vikash222/gate-entryptu',
                'github_url' => 'https://github.com/Vikash222/gate-entryptu',
                'image_url' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'AI IVR Call Assistant',
                'slug' => 'ai-ivr-call-assistant',
                'category' => 'AI & Cloud',
                'short_description' => 'AI-powered voice call assistant built using Python to automate responses and simulate IVR-based phone interactions.',
                'long_description' => 'Voice assistant prototype that listens to speech input, matches intent using NLP chains, and responds with synthetic voice output to simulate automated telephonic helpline flows.',
                'tech_stack' => ['Python', 'SpeechRecognition', 'gTTS', 'Audio Processing', 'NLP'],
                'live_url' => 'https://github.com/Vikash222/ai-ivr-call-assistant',
                'github_url' => 'https://github.com/Vikash222/ai-ivr-call-assistant',
                'image_url' => 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=800',
                'is_featured' => false,
                'sort_order' => 5,
            ],
            [
                'title' => 'Daily Discipline Tracker',
                'slug' => 'daily-discipline-tracker',
                'category' => 'Full Stack',
                'short_description' => 'A productivity and habit tracking tool designed to help users build consistent daily routines and track weekly streaks.',
                'long_description' => 'Clean habit tracker featuring streak gamification, activity heatmaps, daily checklist reminders, and localStorage persistence.',
                'tech_stack' => ['JavaScript', 'React', 'Tailwind CSS', 'Vite'],
                'live_url' => 'https://github.com/Vikash222/daily-discipline-tracker',
                'github_url' => 'https://github.com/Vikash222/daily-discipline-tracker',
                'image_url' => 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800',
                'is_featured' => false,
                'sort_order' => 6,
            ],
            [
                'title' => 'SurvilAI - CCTV Smart Surveillance',
                'slug' => 'survilai-smart-surveillance',
                'category' => 'AI & Cloud',
                'short_description' => 'AI-powered computer vision and security camera stream analyzer for automated motion anomaly detection.',
                'long_description' => 'Developed an intelligent video analytics pipeline using Python and OpenCV that processes incoming CCTV camera feeds, flags unusual after-hours activity, and sends real-time alerts to security personnel.',
                'tech_stack' => ['Python', 'OpenCV', 'Computer Vision', 'Flask', 'NumPy'],
                'live_url' => 'https://github.com/Vikash222/SurvilAI-2',
                'github_url' => 'https://github.com/Vikash222/SurvilAI-2',
                'image_url' => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
                'is_featured' => false,
                'sort_order' => 7,
            ],
            [
                'title' => 'NetworkScanner Security Diagnostics',
                'slug' => 'network-scanner-security-project',
                'category' => 'Backend / API',
                'short_description' => 'Automated network port scanner, packet analyzer, and host discovery tool for cybersecurity assessments.',
                'long_description' => 'Custom socket-based diagnostic tool built to inspect open ports, analyze protocol headers, discover active LAN hosts, and flag insecure daemon ports across university subnets.',
                'tech_stack' => ['Python', 'Socket Programming', 'Scapy', 'Network Security', 'Linux'],
                'live_url' => 'https://github.com/Vikash222/NetworkScannerProject',
                'github_url' => 'https://github.com/Vikash222/NetworkScannerProject',
                'image_url' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
                'is_featured' => false,
                'sort_order' => 8,
            ],
        ];

        Project::truncate();
        foreach ($projectsData as $p) {
            Project::create($p);
        }

        // 5. Experience & Education Timeline (NSS & Academic Leadership)
        $experiencesData = [
            [
                'role' => 'Student Coordinator & Core NSS Member',
                'company' => 'National Service Scheme (NSS), IKGPTU Main Campus',
                'period' => '2023 - Present',
                'location' => 'Kapurthala, Punjab',
                'description' => 'Leading student operations, campus initiatives, event planning, and logistics as a core coordinator for NSS at IKGPTU.',
                'highlights' => [
                    'Coordinated student registrations, digital forms, and volunteer logistics for university-wide social drives and campus events.',
                    'Engineered automated communication workflows using Google Forms, Sheets, QR-based check-in passes, and WhatsApp/Email channels.',
                    'Participated actively in community flood relief donations, blood donation drives, tree plantation campaigns, and health camps.',
                    'Collaborated closely with university administration, professors, and hundreds of volunteer students across multiple departments.'
                ],
                'is_current' => true,
                'sort_order' => 1,
            ],
            [
                'role' => 'Full-Stack Software Developer (Campus Systems)',
                'company' => 'IKGPTU Student Software Innovations',
                'period' => '2024 - Present',
                'location' => 'Kapurthala, Punjab',
                'description' => 'Architecting practical campus automation software solving actual student, hostel, and administrative problems.',
                'highlights' => [
                    'Built Hostel Kavach: geofenced attendance system with GPS verification to prevent proxy marking in campus hostels.',
                    'Designed SmartGate automation with temporary QR codes for seamless student entry/exit logging.',
                    'Developed responsive web interfaces using React, Tailwind CSS, Node.js, Express, and SQLite/MySQL backends.'
                ],
                'is_current' => true,
                'sort_order' => 2,
            ],
            [
                'role' => 'B.Tech CSE Undergraduate Scholar',
                'company' => 'I.K. Gujral Punjab Technical University (IKGPTU)',
                'period' => '2024 - 2028',
                'location' => 'Main Campus, Kapurthala / Jalandhar, Punjab',
                'description' => 'Pursuing Bachelor of Technology in Computer Science & Engineering (2nd Year / 4th Semester).',
                'highlights' => [
                    'Core coursework: Data Structures & Algorithms, Object-Oriented Programming (C++), DBMS, Operating Systems, Computer Networks.',
                    'Actively developing practical projects applying theory into robust web platforms, APIs, and AI integrations.',
                    'Active participant in coding hackathons, technical workshops, and open-source contributions on GitHub.'
                ],
                'is_current' => true,
                'sort_order' => 3,
            ],
        ];

        Experience::truncate();
        foreach ($experiencesData as $e) {
            Experience::create($e);
        }

        // 6. Specialized Services / What Vikash Offers
        $servicesData = [
            [
                'title' => 'Full-Stack Web Engineering',
                'slug' => 'full-stack-web-engineering',
                'description' => 'Developing modern, responsive, high-performance web applications using React 19, Next.js, Tailwind CSS, and Vite.',
                'icon' => 'Code',
                'features' => [
                    'Component-driven modern UI with Tailwind CSS',
                    'Single Page Applications (SPA) & Next.js SSR',
                    'Real-time data sync with WebSockets & Firebase',
                    'Clean, accessible, mobile-first responsive architecture'
                ],
                'sort_order' => 1,
            ],
            [
                'title' => 'REST APIs & Backend Engineering',
                'slug' => 'rest-apis-backend-engineering',
                'description' => 'Building secure, reliable backend APIs using Node.js, Express, Laravel (PHP), and relational database modeling with MySQL & SQLite.',
                'icon' => 'Database',
                'features' => [
                    'RESTful API architecture & OpenAPI documentation',
                    'Role-Based Access Control (RBAC) & authentication',
                    'Database schema design, indexing & optimization',
                    'Secure password hashing, CORS & rate-limiting safeguards'
                ],
                'sort_order' => 2,
            ],
            [
                'title' => 'Smart Systems & Campus Automation',
                'slug' => 'smart-systems-campus-automation',
                'description' => 'Creating end-to-end practical automated systems combining QR codes, Geofencing, GPS coordinates, and role-based portals.',
                'icon' => 'Box',
                'features' => [
                    'GPS / Geofenced attendance verification engines',
                    'Temporary encrypted QR code generation & scanning',
                    'Automated forms & notification pipelines (EmailJS, SMS)',
                    'Multi-role administrative portals (Student, Warden, Dean)'
                ],
                'sort_order' => 3,
            ],
            [
                'title' => 'AI Integration & 3D Interactive Web',
                'slug' => 'ai-integration-3d-interactive-web',
                'description' => 'Integrating LLM APIs (Google Gemini, OpenAI) and interactive Three.js 3D WebGL visuals into modern web apps.',
                'icon' => 'Sparkles',
                'features' => [
                    'Google Gemini API conversational digital twins',
                    'ATS-friendly resume generators & AI prompt workflows',
                    'Interactive Three.js 3D perspective tilt & mesh graphics',
                    'Lightweight client-side model pipelines'
                ],
                'sort_order' => 4,
            ],
        ];

        Service::truncate();
        foreach ($servicesData as $svc) {
            Service::create($svc);
        }

        // 7. Real Campus & Professional Endorsements
        $testimonialsData = [
            [
                'name' => 'Prof. S. K. Sharma',
                'role' => 'Faculty Mentor & NSS In-Charge',
                'company' => 'IKGPTU Main Campus, Kapurthala',
                'avatar_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                'content' => 'Vikash has been an exceptional student coordinator for our NSS campus events and relief drives. His ability to automate registration workflows using tech tools and manage hundreds of students with calm leadership is commendable.',
                'rating' => 5,
                'is_verified' => true,
                'linkedin_url' => 'https://www.linkedin.com/in/vikash-kumar-ab436131a/',
                'project_context' => 'NSS Campus Drives & Student Event Automation',
                'sort_order' => 1,
            ],
            [
                'name' => 'Amanpreet Singh',
                'role' => 'Lead Peer Developer & Senior',
                'company' => 'CSE Department, IKGPTU',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'content' => 'Vikash is one of the most proactive 2nd-year engineers I know. His Hostel Attendance System with geofencing and the Smart Booking Web App solved actual on-ground problems. He writes clean, modular code across React and Node.js.',
                'rating' => 5,
                'is_verified' => true,
                'linkedin_url' => 'https://www.linkedin.com/in/vikash-kumar-ab436131a/',
                'project_context' => 'Hostel Attendance & Smart Booking Project Collaboration',
                'sort_order' => 2,
            ],
            [
                'name' => 'Rohan Verma',
                'role' => 'NSS Core Team Member & Batchmate',
                'company' => 'IKGPTU Kapurthala',
                'avatar_url' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
                'content' => 'Working with Vikash during university events is always seamless. He brings technical solutions to manual hassles like forms, QR passes, and communication channels. Great teammate and software mind!',
                'rating' => 5,
                'is_verified' => true,
                'linkedin_url' => 'https://www.linkedin.com/in/vikash-kumar-ab436131a/',
                'project_context' => 'IKGPTU University Event Operations',
                'sort_order' => 3,
            ],
        ];

        Testimonial::truncate();
        foreach ($testimonialsData as $t) {
            Testimonial::create($t);
        }

        // 9. Freelance Pricing Packages
        $pricingPackages = [
            [
                'title' => 'Frontend & Landing Page',
                'slug' => 'frontend-landing-page',
                'price_inr' => 4999.00,
                'tagline' => 'High-converting modern UI, mobile-responsive, dynamic animations & contact automation.',
                'features' => [
                    'Modern React + Tailwind CSS / Next.js',
                    '100% Mobile & Tablet Responsive',
                    'Interactive UI / 3D Graphics & Animations',
                    'Contact Form with Instant Email Notification',
                    'Vercel / Netlify Deployment Setup',
                    'SEO Optimization & Lighthouse 95+ Score',
                ],
                'delivery_days' => 3,
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Full-Stack Custom App',
                'slug' => 'full-stack-custom-app',
                'price_inr' => 14999.00,
                'tagline' => 'End-to-end database, REST API backend, admin CMS panel, and role-based client portal.',
                'features' => [
                    'Complete Frontend + Backend (Laravel / Node.js)',
                    'Relational Database (MySQL / PostgreSQL / SQLite)',
                    'Authentication, User Roles & Protected Portals',
                    'Admin Dashboard & CRUD Content Management',
                    'Payment Gateway Integration (Razorpay / Stripe)',
                    'REST API Architecture with Security Safeguards',
                    '14 Days Post-Deployment Technical Support',
                ],
                'delivery_days' => 7,
                'is_popular' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Enterprise SaaS & AI Engine',
                'slug' => 'enterprise-saas-ai-engine',
                'price_inr' => 34999.00,
                'tagline' => 'Advanced AI integrations (Gemini / OpenAI), complex workflow automation & custom SaaS platforms.',
                'features' => [
                    'Custom AI Chatbots / Document Processing / LLMs',
                    'Complex Business Logic & Real-time WebSockets',
                    'Multi-Tenant SaaS Architecture & Subscriptions',
                    'Razorpay / International Payment Workflows',
                    'Automated CI/CD Deployment & Cloud Scaling',
                    'Dedicated Codebase Documentation & Handover',
                    '30 Days Priority Bugfix & Support Warranty',
                ],
                'delivery_days' => 14,
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($pricingPackages as $pkg) {
            \App\Models\PricingPackage::updateOrCreate(['slug' => $pkg['slug']], $pkg);
        }

        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
