import os
import django
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'event_management.settings')
django.setup()

from django.contrib.auth import get_user_model
from events.models import Event

User = get_user_model()

def create_sample_data():
    # Create admin user if not exists
    admin_email = 'admin@example.com'
    if not User.objects.filter(email=admin_email).exists():
        admin_user = User.objects.create_user(
            username=admin_email,
            email=admin_email,
            first_name='Admin',
            last_name='User',
            user_type='admin',
            password='admin123'
        )
        print(f"Created admin user: {admin_email}")
    else:
        admin_user = User.objects.get(email=admin_email)
        print(f"Admin user already exists: {admin_email}")

    # Create sample student users
    sample_students = [
        {'email': 'john.doe@example.com', 'first_name': 'John', 'last_name': 'Doe', 'student_id': 'STU001'},
        {'email': 'jane.smith@example.com', 'first_name': 'Jane', 'last_name': 'Smith', 'student_id': 'STU002'},
        {'email': 'mike.johnson@example.com', 'first_name': 'Mike', 'last_name': 'Johnson', 'student_id': 'STU003'},
    ]

    for student_data in sample_students:
        if not User.objects.filter(email=student_data['email']).exists():
            User.objects.create_user(
                username=student_data['email'],
                email=student_data['email'],
                first_name=student_data['first_name'],
                last_name=student_data['last_name'],
                student_id=student_data['student_id'],
                user_type='student',
                password='student123'
            )
            print(f"Created student user: {student_data['email']}")

    # Create sample events
    today = datetime.now().date()
    sample_events = [
        {
            'title': 'Spring Fashion Show',
            'description': 'Showcase the latest spring collection with beautiful models and designs. Join us for an evening of glamour and style!',
            'date': today + timedelta(days=7),
            'time': '18:00',
            'location': 'Main Auditorium',
            'max_participants': 200,
            'current_participants': 156,
            'category': 'Fashion',
            'status': 'upcoming'
        },
        {
            'title': 'Wellness Workshop',
            'description': 'Learn about self-care, meditation, and wellness practices. Discover techniques for a balanced and healthy lifestyle.',
            'date': today + timedelta(days=14),
            'time': '14:00',
            'location': 'Wellness Center',
            'max_participants': 50,
            'current_participants': 42,
            'category': 'Wellness',
            'status': 'upcoming'
        },
        {
            'title': 'Tech Innovation Summit',
            'description': 'Explore the latest trends in technology and innovation. Network with industry leaders and tech enthusiasts.',
            'date': today + timedelta(days=21),
            'time': '09:00',
            'location': 'Tech Hub',
            'max_participants': 150,
            'current_participants': 87,
            'category': 'Technology',
            'status': 'upcoming'
        },
        {
            'title': 'Art & Craft Fair',
            'description': 'Display and sell handmade crafts and artwork. A celebration of creativity and artistic expression.',
            'date': today - timedelta(days=30),
            'time': '10:00',
            'location': 'Art Gallery',
            'max_participants': 100,
            'current_participants': 89,
            'category': 'Arts',
            'status': 'past'
        },
        {
            'title': 'Music Concert Night',
            'description': 'An evening of beautiful music performances by talented students and guest artists.',
            'date': today - timedelta(days=45),
            'time': '19:00',
            'location': 'Concert Hall',
            'max_participants': 300,
            'current_participants': 287,
            'category': 'Music',
            'status': 'past'
        }
    ]

    for event_data in sample_events:
        if not Event.objects.filter(title=event_data['title']).exists():
            Event.objects.create(
                title=event_data['title'],
                description=event_data['description'],
                date=event_data['date'],
                time=event_data['time'],
                location=event_data['location'],
                max_participants=event_data['max_participants'],
                current_participants=event_data['current_participants'],
                category=event_data['category'],
                status=event_data['status'],
                created_by=admin_user
            )
            print(f"Created event: {event_data['title']}")

    print("Sample data creation completed!")

if __name__ == '__main__':
    create_sample_data()
