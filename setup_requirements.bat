@echo off
echo =====================================
echo  Sreya Project - Complete Setup
echo =====================================
echo.

REM Check if Python is installed
echo [1/8] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)
echo Python found!

REM Check if Node.js is installed
echo [2/8] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo Node.js found!

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js which includes npm
    echo.
    pause
    exit /b 1
)
echo npm found!
echo.

REM Backend Setup
echo [3/8] Setting up Python backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
) else (
    echo Virtual environment already exists.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install Python dependencies
echo [4/8] Installing Python dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    echo Please check the requirements.txt file and your internet connection
    pause
    exit /b 1
)

echo Python dependencies installed successfully!
echo.

REM Setup environment file
echo [5/8] Setting up environment configuration...
if not exist ".env" (
    echo Creating .env file from sample...
    copy .env.sample .env
    echo Please edit backend\.env with your configuration settings
) else (
    echo .env file already exists
)

echo.

REM Move back to project root
cd ..

REM Frontend Setup
echo [6/8] Installing Node.js dependencies...
npm install

if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo Node.js dependencies installed successfully!
echo.

REM Database Setup
echo [7/8] Database setup...
cd backend
call venv\Scripts\activate.bat

echo Running database migrations...
python manage.py migrate

if errorlevel 1 (
    echo WARNING: Database migrations failed
    echo This might be due to database configuration issues
    echo Please check your .env file settings
)

echo.
echo Would you like to create a superuser account? (Y/N)
set /p CREATE_SUPERUSER=
if /i "%CREATE_SUPERUSER%"=="Y" (
    python manage.py createsuperuser
)

echo.
echo Would you like to populate sample data? (Y/N)
set /p POPULATE_DATA=
if /i "%POPULATE_DATA%"=="Y" (
    python populate_sample_data.py
)

cd ..

echo.
echo [8/8] Setup verification...
echo Verifying installation...

REM Check if all key directories exist
if exist "backend\venv" (
    echo ✓ Python virtual environment created
) else (
    echo ✗ Python virtual environment missing
)

if exist "node_modules" (
    echo ✓ Node.js dependencies installed
) else (
    echo ✗ Node.js dependencies missing
)

if exist "backend\.env" (
    echo ✓ Environment file configured
) else (
    echo ✗ Environment file missing
)

echo.
echo =====================================
echo     Setup Completed Successfully!
echo =====================================
echo.
echo Project Structure:
echo   Frontend: Next.js 15 with TypeScript
echo   Backend: Django 4.2 with REST Framework  
echo   Database: SQLite (default) or MySQL
echo   UI: Tailwind CSS + ShadCN UI
echo.
echo Quick Start Commands:
echo.
echo   Start Backend (Django):
echo     cd backend
echo     venv\Scripts\activate
echo     python manage.py runserver
echo     → http://localhost:8000
echo.
echo   Start Frontend (Next.js):
echo     npm run dev
echo     → http://localhost:3000
echo.
echo   Start Both (Automated):
echo     run-project.bat
echo.
echo Configuration Files:
echo   • backend\.env - Django environment settings
echo   • package.json - Node.js dependencies
echo   • tailwind.config.ts - Tailwind CSS config
echo   • tsconfig.json - TypeScript configuration
echo.
echo Next Steps:
echo 1. Configure backend\.env with your settings
echo 2. For MySQL: run backend\setup_mysql.bat
echo 3. Start development servers using commands above
echo 4. Visit http://localhost:3000 to use the application
echo.
echo Default Users (if sample data was loaded):
echo   Admin: admin@example.com / admin123
echo   Student: john.doe@example.com / student123
echo.
echo Documentation: README.md
echo Support: Check GitHub issues or documentation
echo.
echo Happy coding! 🚀
echo.
pause
