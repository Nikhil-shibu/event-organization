# Event Organization System - Sreya

A full-stack web application for event management with role-based access control, built with Next.js (frontend) and Django (backend).

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access (Admin/Student)
  - Secure login/registration system

- **Admin Dashboard**
  - Create, edit, and delete events
  - View event statistics and participant counts
  - Search and filter events
  - Real-time participant tracking

- **Student Dashboard**
  - Browse available events
  - Join or skip events
  - View participation history
  - Search functionality

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - ShadCN UI components
  - Dark/Light mode support
  - Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Pre-built component library
- **Axios** - HTTP client for API requests

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework** - API development
- **JWT Authentication** - Secure token-based auth
- **SQLite/MySQL** - Database options
- **CORS Headers** - Cross-origin request handling

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.8 or higher)
- **MySQL** (optional, SQLite is default)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Nikhil-shibu/event-organization.git
cd event-organization
```

### 2. Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Run development server
npm run dev
```
Frontend will be available at `http://localhost:3000`

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\\Scripts\\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.sample .env
# Edit .env file with your configuration

# Run database migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Populate sample data (optional)
python populate_sample_data.py

# Run development server
python manage.py runserver
```
Backend API will be available at `http://localhost:8000`

### 4. Quick Start (Windows)
For Windows users, you can use the automated startup script:
```batch
run-project.bat
```
This will start both frontend and backend servers automatically.

## 📁 Project Structure

```
event-organization/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin dashboard page
│   ├── student/                  # Student dashboard page
│   ├── signup/                   # Registration page
│   └── layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   └── ui/                      # ShadCN UI components  
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client and functions
│   └── utils.ts                 # Utility functions
├── backend/                     # Django backend
│   ├── accounts/                # User authentication app
│   ├── events/                  # Event management app
│   ├── event_management/        # Django project settings
│   ├── requirements.txt         # Python dependencies
│   ├── .env.sample             # Environment variables template
│   └── manage.py               # Django management script
├── public/                      # Static assets
├── DOCUMENTATION.md             # Comprehensive project documentation
└── README.md                   # This file
```

## 🔑 Environment Configuration

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
USE_SQLITE=True
ALLOWED_HOSTS=localhost,127.0.0.1

# MySQL Configuration (if USE_SQLITE=False)
DB_NAME=event_management_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get user profile

### Events
- `GET /api/events/` - List all events
- `POST /api/events/` - Create event (admin only)
- `GET /api/events/{id}/` - Get event details
- `PUT /api/events/{id}/` - Update event (admin only)
- `DELETE /api/events/{id}/` - Delete event (admin only)
- `POST /api/events/{id}/join/` - Join event
- `POST /api/events/{id}/skip/` - Skip event

## 👥 Default Users (Sample Data)

After running `python populate_sample_data.py`:

**Admin User:**
- Email: admin@example.com
- Password: admin123

**Student Users:**
- john.doe@example.com / student123
- jane.smith@example.com / student123
- mike.johnson@example.com / student123

## 🎨 UI Components

The project uses ShadCN UI components including:
- Forms (Button, Input, Label, Select, etc.)
- Layout (Card, Dialog, Sheet, Tabs, etc.)
- Navigation (Menu, Breadcrumb, Pagination, etc.)
- Feedback (Alert, Toast, Progress, Badge, etc.)
- Data Display (Table, Calendar, Avatar, etc.)

## 📖 Documentation

For detailed documentation including:
- File-by-file breakdown
- Function explanations
- Architecture details
- API reference
- Database schema

See [DOCUMENTATION.md](./DOCUMENTATION.md)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `.next` folder to your hosting platform

### Backend (Railway/Heroku/DigitalOcean)
1. Set environment variables in production
2. Use PostgreSQL/MySQL for production database
3. Set `DEBUG=False` in production
4. Configure `ALLOWED_HOSTS` properly
5. Collect static files: `python manage.py collectstatic`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Nikhil Shibu**
- GitHub: [@Nikhil-shibu](https://github.com/Nikhil-shibu)

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Documentation](./DOCUMENTATION.md)
2. Search existing [Issues](https://github.com/Nikhil-shibu/event-organization/issues)
3. Create a new issue if needed

## 🎯 Future Enhancements

- [ ] Email notifications for events
- [ ] Event calendar integration
- [ ] File upload for event images
- [ ] Advanced filtering and sorting
- [ ] Export functionality for event data
- [ ] Real-time notifications
- [ ] Event capacity management
- [ ] Reporting and analytics

---

⭐ If you find this project helpful, please consider giving it a star!
