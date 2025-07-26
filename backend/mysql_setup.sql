-- MySQL Setup Script for Event Organization System
-- This script creates the database, user, and grants necessary permissions

-- Create database
CREATE DATABASE IF NOT EXISTS event_management_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Create user for the application (replace 'your_username' and 'your_password')
-- For development environment:
CREATE USER IF NOT EXISTS 'event_user'@'localhost' IDENTIFIED BY 'event_password123';

-- For production environment (use a stronger password):
-- CREATE USER IF NOT EXISTS 'event_user'@'localhost' IDENTIFIED BY 'Your_Secure_Password_Here!';

-- Grant all privileges on the event_management_db database to the user
GRANT ALL PRIVILEGES ON event_management_db.* TO 'event_user'@'localhost';

-- Grant SELECT privilege on mysql.time_zone_name table (needed for timezone support)
GRANT SELECT ON mysql.time_zone_name TO 'event_user'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Use the created database
USE event_management_db;

-- Show confirmation
SELECT 'Database event_management_db created successfully!' as Status;
SELECT 'User event_user created with necessary privileges!' as Status;

-- Optional: Create tables manually (Django migrations will handle this automatically)
-- Uncomment the following section if you want to create tables manually

/*
-- Users table (extends Django's auth_user)
CREATE TABLE IF NOT EXISTS accounts_user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME(6),
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    user_type VARCHAR(10) NOT NULL DEFAULT 'student',
    student_id VARCHAR(20),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);

-- Events table
CREATE TABLE IF NOT EXISTS events_event (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(200) NOT NULL,
    max_participants INT UNSIGNED NOT NULL,
    current_participants INT UNSIGNED NOT NULL DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'upcoming',
    created_by_id INT NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (created_by_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_date (date),
    INDEX idx_created_by (created_by_id)
);

-- Event Participation table
CREATE TABLE IF NOT EXISTS events_eventparticipation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(10) NOT NULL DEFAULT 'pending',
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events_event(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (user_id, event_id),
    INDEX idx_user (user_id),
    INDEX idx_event (event_id),
    INDEX idx_status (status)
);
*/

-- Show database info
SHOW DATABASES;
SELECT 'MySQL setup completed successfully!' as Status;
