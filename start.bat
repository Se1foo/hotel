@echo off
setlocal

echo ============================================
echo   Luxe Reserve - starting development mode
echo ============================================
echo.

REM Fail early with a useful message instead of two windows that flash and die.
if not exist "backend\node_modules" (
  echo [!] backend dependencies are missing.
  echo     Run: cd backend ^&^& npm install
  echo.
  pause
  exit /b 1
)

if not exist "frontend\node_modules" (
  echo [!] frontend dependencies are missing.
  echo     Run: cd frontend ^&^& npm install
  echo.
  pause
  exit /b 1
)

if not exist "backend\.env" (
  echo [!] backend\.env is missing.
  echo     Run: copy backend\.env.example backend\.env
  echo     then fill in JWT_ACCESS_SECRET and JWT_REFRESH_SECRET.
  echo.
  pause
  exit /b 1
)

echo Starting backend on http://localhost:5000 ...
start "Luxe Reserve API" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo Starting frontend on http://localhost:5173 ...
start "Luxe Reserve Web" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Open http://localhost:5173 once the frontend is ready.
endlocal
