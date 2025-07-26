#!/bin/bash

# MySQL Setup Script for Event Organization System
# This script helps set up MySQL database for the Django project

echo "==================================="
echo "  Event Organization - MySQL Setup"
echo "==================================="
echo

# Check if MySQL is installed and accessible
echo "Checking MySQL installation..."
if ! command -v mysql &> /dev/null; then
    echo "ERROR: MySQL is not installed or not in PATH"
    echo "Please install MySQL first:"
    echo "  Ubuntu/Debian: sudo apt-get install mysql-server"
    echo "  CentOS/RHEL: sudo yum install mysql-server"
    echo "  macOS: brew install mysql"
    echo
    exit 1
fi

echo "MySQL found!"
echo

# Get MySQL root credentials
echo "Please enter your MySQL root credentials:"
read -p "Enter MySQL root username [root]: " MYSQL_ROOT_USER
MYSQL_ROOT_USER=${MYSQL_ROOT_USER:-root}

echo "Enter MySQL root password:"
read -s MYSQL_ROOT_PASSWORD

echo
echo "Testing MySQL connection..."
if ! mysql -u "$MYSQL_ROOT_USER" -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 'Connection successful!' as Status;" 2>/dev/null; then
    echo "ERROR: Failed to connect to MySQL with provided credentials"
    echo "Please check your username and password"
    exit 1
fi

echo "Connection successful!"
echo

# Run the SQL setup script
echo "Creating database and user..."
if ! mysql -u "$MYSQL_ROOT_USER" -p"$MYSQL_ROOT_PASSWORD" < mysql_setup.sql; then
    echo "ERROR: Failed to execute MySQL setup script"
    exit 1
fi

echo
echo "==================================="
echo "   MySQL Setup Completed Successfully!"
echo "==================================="
echo
echo "Database Details:"
echo "  Database Name: event_management_db"
echo "  Username: event_user"
echo "  Password: event_password123"
echo "  Host: localhost"
echo "  Port: 3306"
echo
echo "Next Steps:"
echo "1. Update your .env file with the following settings:"
echo "   USE_SQLITE=False"
echo "   DB_NAME=event_management_db"
echo "   DB_USER=event_user"
echo "   DB_PASSWORD=event_password123"
echo "   DB_HOST=localhost"
echo "   DB_PORT=3306"
echo
echo "2. Run Django migrations:"
echo "   python manage.py migrate"
echo
echo "3. Create a superuser (optional):"
echo "   python manage.py createsuperuser"
echo
echo "4. Populate sample data (optional):"
echo "   python populate_sample_data.py"
echo
