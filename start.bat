@echo off
echo Starting Hotel Application...

echo Starting Backend...
start "Hotel Backend" cmd /k "cd backend && npm run dev"

echo Starting Frontend...
start "Hotel Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are starting up!
