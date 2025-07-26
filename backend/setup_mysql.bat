@echo off
REM MySQL Setup Script for Event Organization System
REM This script helps set up MySQL database for the Django project

echo ===================================
echo  Event Organization - MySQL Setup
echo ===================================
echo.

REM Check if MySQL is installed and accessible
echo Checking MySQL installation...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL and add it to your system PATH
    echo Download from: https://dev.mysql.com/downloads/mysql/
    echo.
    pause
    exit /b 1
)

echo MySQL found!
echo.

REM Get MySQL root credentials
echo Please enter your MySQL root credentials:
set /p MYSQL_ROOT_USER=Enter MySQL root username [root]: 
if "%MYSQL_ROOT_USER%"=="" set MYSQL_ROOT_USER=root

echo Enter MySQL root password:
set /p MYSQL_ROOT_PASSWORD=Password: 

echo.
echo Testing MySQL connection...
mysql -u %MYSQL_ROOT_USER% -p%MYSQL_ROOT_PASSWORD% -e "SELECT 'Connection successful!' as Status;" 2>nul
if errorlevel 1 (
    echo ERROR: Failed to connect to MySQL with provided credentials
    echo Please check your username and password
    pause
    exit /b 1
)

echo Connection successful!
echo.

REM Run the SQL setup script
echo Creating database and user...
mysql -u %MYSQL_ROOT_USER% -p%MYSQL_ROOT_PASSWORD% < mysql_setup.sql

if errorlevel 1 (
    echo ERROR: Failed to execute MySQL setup script
    pause
    exit /b 1
)

echo.
echo ===================================
echo   MySQL Setup Completed Successfully!
echo ===================================
echo.
echo Database Details:
echo   Database Name: event_management_db
echo   Username: event_user  
echo   Password: event_password123
echo   Host: localhost
echo   Port: 3306
echo.
echo Next Steps:
echo 1. Update your .env file with the following settings:
echo    USE_SQLITE=False
echo    DB_NAME=event_management_db
echo    DB_USER=event_user
echo    DB_PASSWORD=event_password123
echo    DB_HOST=localhost
echo    DB_PORT=3306
echo.
echo 2. Run Django migrations:
echo    python manage.py migrate
echo.
echo 3. Create a superuser (optional):
echo    python manage.py createsuperuser
echo.
echo 4. Populate sample data (optional):
echo    python populate_sample_data.py
echo.
pause
