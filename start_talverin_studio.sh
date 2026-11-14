#!/usr/bin/env bash
set -e
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "Starting TagFlow FastAPI Backend on http://127.0.0.1:8000 ..."
/Users/shoumikaggarwal/.gemini/antigravity/scratch/persevex_venv/bin/python -W ignore "/Users/shoumikaggarwal/Library/Mobile Documents/com~apple~CloudDocs/Persevex_Internship/Project1_Automated_Blog_Tagging/src/api_server.py" &
FASTAPI_PID=$!

trap "kill $FASTAPI_PID 2>/dev/null || true" EXIT

echo "Starting Talverin Next.js 15 Studio on http://localhost:3000 ..."
cd /Users/shoumikaggarwal/.gemini/antigravity/scratch/project1-talverin-ui
npx next dev -p 3000
