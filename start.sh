#!/bin/bash

# Portfolio & Admin CMS Launch Script
echo "=========================================================="
echo "🚀 Starting Portfolio & Admin CMS"
echo "=========================================================="

# 1. Start Laravel Backend
echo "⚡ Starting Laravel 11 Backend API on http://127.0.0.1:8000 ..."
cd "$(dirname "$0")/backend"
php artisan serve --host=127.0.0.1 --port=8000 &
BACKEND_PID=$!

# 2. Start Vite React Frontend
echo "⚡ Starting React + Tailwind + Three.js Frontend on http://localhost:5173 ..."
cd "$(dirname "$0")/frontend"
npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo "👉 Public Portfolio: http://localhost:5173"
echo "👉 Admin CMS Panel:  http://localhost:5173 (Click 'Admin' or navigate to Login)"
echo "   Default Admin:   admin@portfolio.local"
echo "   Default Pass:    Password@123"
echo ""
echo "Press [CTRL+C] to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
