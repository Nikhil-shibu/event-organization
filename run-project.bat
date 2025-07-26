@echo off
echo Starting Sreya Project...
echo.

REM Start Django Backend
echo Starting Django Backend...
start "Django Backend" cmd /k "cd /d C:\Users\nikhi\projects\sreya\backend && venv\Scripts\activate && python manage.py runserver"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Next.js Frontend
echo Starting Next.js Frontend...
start "Next.js Frontend" cmd /k "cd /d C:\Users\nikhi\projects\sreya && npm run dev"

echo.
echo Both services are starting in separate windows:
echo - Django Backend: http://localhost:8000
echo - Next.js Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
