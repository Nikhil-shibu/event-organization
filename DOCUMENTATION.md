

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Frontend Documentation](#frontend-documentation)
4. [Backend Documentation](#backend-documentation)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Setup and Installation](#setup-and-installation)
8. [File-by-File Breakdown](#file-by-file-breakdown)

## Project Overview

Sreya is a full-stack web application for event management with role-based access control. It features:
- User authentication and authorization
- Admin dashboard for event management
- Student dashboard for event participation
- Real-time event status updates
- Responsive design with modern UI

**Tech Stack:**
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Django 4.2, Django REST Framework, SQLite/MySQL
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS with custom components

## Project Structure

```
sreya/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (login)
│   ├── admin/page.tsx           # Admin dashboard
│   ├── student/page.tsx         # Student dashboard
│   ├── signup/page.tsx          # Registration page
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                      # ShadCN UI components
│   └── theme-provider.tsx       # Theme context provider
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client and functions
│   └── utils.ts                 # Utility functions
├── hooks/                       # Custom React hooks
├── public/                      # Static assets
├── backend/                     # Django backend
│   ├── event_management/        # Django project settings
│   ├── accounts/                # User authentication app
│   ├── events/                  # Event management app
│   ├── venv/                    # Virtual environment
│   ├── requirements.txt         # Python dependencies
│   ├── manage.py               # Django management script
│   └── .env                    # Environment variables
├── package.json                 # Node.js dependencies
├── tailwind.config.ts          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── run-project.bat             # Project startup script
```

## Frontend Documentation

### Core Technologies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN UI**: Pre-built component library
- **Axios**: HTTP client for API requests

### Page Components

#### 1. Root Layout (`app/layout.tsx`)
```typescript
export default function RootLayout({ children }: { children: React.ReactNode })
```
**Purpose**: Defines the HTML structure and global styles for all pages.
**Features**:
- Sets page metadata (title, description)
- Includes global CSS
- Wraps all pages with consistent layout

#### 2. Login Page (`login-page.tsx`)
**Main Component**: `Component()`
**State Management**:
- `showPassword`: Boolean for password visibility toggle
- `email`, `password`: Form input values
- `isLoading`: Loading state during authentication
- `error`: Error message display

**Key Functions**:
- `handleSubmit(e)`: Processes login form submission
  - Validates credentials via API
  - Stores JWT tokens in localStorage
  - Redirects users based on role (admin/student)
  - Handles authentication errors

**Features**:
- Responsive design with gradient background
- Form validation and error display
- Password visibility toggle
- Social login placeholders (Google, GitHub)
- Loading states with spinner animation

#### 3. Admin Dashboard (`admin-dashboard.tsx`)
**Main Component**: `Component()`
**State Management**:
- `activeTab`: Controls "upcoming" vs "past" events view
- `showCreateModal`: Modal visibility for event creation
- `editingEvent`: Currently editing event object
- `searchTerm`: Event search functionality
- `events`: Array of all events
- `newEvent`: Form data for creating events

**Key Functions**:
- `fetchEvents()`: Retrieves events from API
- `handleCreateEvent()`: Creates new event via API
- `handleUpdateEvent()`: Updates existing event
- `handleDeleteEvent(id)`: Deletes event by ID
- `formatDate(dateString)`: Formats date for display
- `handleLogout()`: Clears tokens and redirects

**Features**:
- Event CRUD operations (Create, Read, Update, Delete)
- Search and filter functionality
- Statistics cards (total events, participants)
- Modal dialogs for event forms
- Real-time participant tracking
- Permission-based access control

#### 4. Student Dashboard (`student-dashboard.tsx`)
**Main Component**: `Component()`
**State Management**:
- `activeTab`: "ongoing" vs "past" events
- `searchTerm`: Event search
- `events`: Available events with participation status
- `participations`: User's event participations

**Key Functions**:
- `fetchEvents()`: Gets events with user participation status
- `fetchParticipations()`: Gets user's participation history
- `handleParticipation(eventId, status)`: Join or skip events
- `getUserParticipationStatus(eventId)`: Gets user's status for event
- `getStatusColor(status)`: Returns CSS classes for status display

**Features**:
- Event browsing and search
- Join/skip event functionality
- Participation status tracking
- Statistics display
- Responsive event cards

#### 5. Signup Page (`signup-page.tsx`)
**Main Component**: `Component()`
**State Management**:
- `showPassword`, `showConfirmPassword`: Password visibility toggles
- `formData`: Object containing all form fields
- `isLoading`: Registration process state
- `error`: Error message handling
- `success`: Success state after registration

**Key Functions**:
- `handleInputChange(field, value)`: Updates form field values
- `handleSubmit(e)`: Processes registration form
  - Validates password matching
  - Calls registration API
  - Handles success/error states
  - Auto-redirects on success

**Features**:
- Multi-field registration form
- Password confirmation validation
- Real-time error handling
- Success feedback with auto-redirect
- Terms and conditions checkbox

### API Layer (`lib/api.ts`)

**Axios Configuration**:
```typescript
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' }
})
```

**Request Interceptor**:
- Automatically adds JWT token to requests
- Retrieves token from localStorage

**Response Interceptor**:
- Handles 401 errors (token expiration)
- Automatically refreshes tokens
- Redirects to login on refresh failure

**API Functions**:

**Authentication APIs**:
- `authAPI.register(userData)`: User registration
- `authAPI.login(credentials)`: User login
- `authAPI.getProfile()`: Get user profile

**Event APIs**:
- `eventsAPI.getEvents(status?)`: Get events with optional status filter
- `eventsAPI.getStudentEvents()`: Get events for students with participation status
- `eventsAPI.createEvent(eventData)`: Create new event (admin only)
- `eventsAPI.updateEvent(eventId, eventData)`: Update event (admin only)
- `eventsAPI.deleteEvent(eventId)`: Delete event (admin only)
- `eventsAPI.joinEvent(eventId)`: Join an event
- `eventsAPI.skipEvent(eventId)`: Skip an event
- `eventsAPI.getUserParticipations()`: Get user's participations

**Token Management Functions**:
- `setAuthTokens(access, refresh, user)`: Store authentication data
- `removeAuthTokens()`: Clear authentication data
- `getCurrentUser()`: Get current user from localStorage
- `isAuthenticated()`: Check if user is logged in

### Utility Functions (`lib/utils.ts`)
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
**Purpose**: Merges CSS class names with Tailwind CSS conflict resolution

## Backend Documentation

### Django Project Structure

#### Settings (`backend/event_management/settings.py`)
**Key Configurations**:
- Database: Supports both SQLite (development) and MySQL (production)
- Authentication: Custom User model with JWT tokens
- CORS: Configured for frontend communication
- REST Framework: JSON API with JWT authentication

**Environment Variables**:
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode toggle
- `USE_SQLITE`: Database choice
- `DB_*`: MySQL database credentials
- `ALLOWED_HOSTS`: Allowed host domains

#### URL Configuration (`backend/event_management/urls.py`)
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/events/', include('events.urls')),
]
```

### Accounts App

#### Models (`backend/accounts/models.py`)

**User Model**:
```python
class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('student', 'Student'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
    student_id = models.CharField(max_length=20, blank=True, null=True)
    # ... other fields
```

**Key Methods**:
- `is_admin()`: Returns True if user is admin
- `is_student()`: Returns True if user is student
- `__str__()`: String representation of user

**Features**:
- Extends Django's AbstractUser
- Role-based access control
- Unique email field as username
- Student ID for student users
- Timestamp tracking

#### Views (`backend/accounts/views.py`)

**RegisterView**:
- **Method**: POST
- **Purpose**: User registration
- **Permissions**: AllowAny
- **Returns**: User data + JWT tokens

**LoginView**:
- **Method**: POST
- **Purpose**: User authentication
- **Permissions**: AllowAny
- **Returns**: User data + JWT tokens

**UserProfileView**:
- **Method**: GET, PUT, PATCH
- **Purpose**: Get/update user profile
- **Permissions**: IsAuthenticated
- **Returns**: User profile data

#### Serializers (`backend/accounts/serializers.py`)

**UserRegistrationSerializer**:
- Validates user registration data
- Ensures password confirmation matches
- Creates new user with hashed password

**UserLoginSerializer**:
- Validates login credentials
- Authenticates user via email/password
- Returns authenticated user object

**UserSerializer**:
- Serializes user data for API responses
- Excludes sensitive fields like password

### Events App

#### Models (`backend/events/models.py`)

**Event Model**:
```python
class Event(models.Model):
    STATUS_CHOICES = (
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('past', 'Past'),
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=200)
    max_participants = models.PositiveIntegerField()
    current_participants = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='upcoming')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
```

**Key Methods**:
- `update_status()`: Automatically updates event status based on date
- `is_full()`: Returns True if event has reached max participants

**EventParticipation Model**:
```python
class EventParticipation(models.Model):
    STATUS_CHOICES = (
        ('joined', 'Joined'),
        ('skipped', 'Skipped'),
        ('pending', 'Pending'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
```

**Features**:
- Unique constraint on user-event pairs
- Tracks participation status
- Timestamp tracking

#### Views (`backend/events/views.py`)

**EventListCreateView**:
- **Methods**: GET, POST
- **GET**: Lists all events with status filtering
- **POST**: Creates new event (admin only)
- **Features**: Auto-updates event statuses, permission checks

**EventDetailView**:
- **Methods**: GET, PUT, PATCH, DELETE
- **Purpose**: CRUD operations on single event
- **Permissions**: Update/Delete require admin role

**Function-Based Views**:

**join_event(request, event_id)**:
- Allows user to join an event
- Checks if event is full
- Updates participation status
- Increments participant count

**skip_event(request, event_id)**:
- Allows user to skip an event
- Updates participation status
- Decrements participant count if previously joined

**UserEventParticipationsView**:
- Lists user's event participations
- Requires authentication

**StudentEventsView**:
- Lists all events with user's participation status
- Available to all users
- Adds participation status to response

#### Serializers (`backend/events/serializers.py`)

**EventSerializer**:
- Serializes event data for API responses
- Includes read-only fields (status, current_participants)
- Nested user serializer for created_by field

**EventParticipationSerializer**:
- Serializes participation data
- Includes nested event and user data

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register/` | User registration | No |
| POST | `/api/auth/login/` | User login | No |
| POST | `/api/auth/token/refresh/` | Refresh JWT token | No |
| GET | `/api/auth/profile/` | Get user profile | Yes |
| PUT/PATCH | `/api/auth/profile/` | Update user profile | Yes |

### Event Endpoints

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/events/` | List all events | No | No |
| POST | `/api/events/` | Create event | Yes | Yes |
| GET | `/api/events/student/` | List events with participation status | No | No |
| GET | `/api/events/{id}/` | Get event details | No | No |
| PUT/PATCH | `/api/events/{id}/` | Update event | Yes | Yes |
| DELETE | `/api/events/{id}/` | Delete event | Yes | Yes |
| POST | `/api/events/{id}/join/` | Join event | Yes | No |
| POST | `/api/events/{id}/skip/` | Skip event | Yes | No |
| GET | `/api/events/my-participations/` | Get user participations | Yes | No |

## Database Schema

### User Table
```sql
- id (Primary Key)
- username (Unique)
- email (Unique)
- first_name
- last_name
- password (Hashed)
- user_type (admin/student)
- student_id (Optional)
- is_active
- date_joined
- created_at
- updated_at
```

### Event Table
```sql
- id (Primary Key)
- title
- description
- date
- time
- location
- max_participants
- current_participants
- category
- status (upcoming/ongoing/past)
- created_by (Foreign Key to User)
- created_at
- updated_at
```

### EventParticipation Table
```sql
- id (Primary Key)
- user_id (Foreign Key to User)
- event_id (Foreign Key to Event)
- status (joined/skipped/pending)
- created_at
- updated_at
- UNIQUE(user_id, event_id)
```

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (3.8 or higher)
- MySQL (optional, SQLite is default)

### Frontend Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Environment Configuration
Create `.env` file in backend directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
USE_SQLITE=True
ALLOWED_HOSTS=localhost,127.0.0.1

# For MySQL (if USE_SQLITE=False)
DB_NAME=event_management_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
```

### Quick Start
Use the provided batch script:
```bash
# Windows
run-project.bat
```

This will start both backend (port 8000) and frontend (port 3000) servers.

## File-by-File Breakdown

### Configuration Files

#### `package.json`
**Purpose**: Node.js project configuration
**Key Dependencies**:
- React/Next.js ecosystem
- UI libraries (Radix UI, Tailwind)
- HTTP client (Axios)
- Form handling and validation libraries

#### `next.config.mjs`
**Purpose**: Next.js configuration
**Settings**:
- Disables ESLint during builds
- Ignores TypeScript build errors
- Enables unoptimized images

#### `tailwind.config.ts`
**Purpose**: Tailwind CSS configuration
**Features**:
- Dark mode support
- Custom color palette
- CSS variables integration
- Custom animations
- ShadCN UI integration

#### `tsconfig.json`
**Purpose**: TypeScript configuration
**Settings**:
- Modern ES features enabled
- Path aliases (@/*)
- Strict type checking
- Next.js plugin integration

#### `components.json`
**Purpose**: ShadCN UI configuration
**Settings**:
- Component aliases
- Styling preferences
- Icon library selection

### Backend Configuration Files

#### `requirements.txt`
**Purpose**: Python dependencies
**Key Packages**:
- Django 4.2.7
- Django REST Framework
- JWT authentication
- CORS headers
- MySQL client
- Image processing (Pillow)

#### `manage.py`
**Purpose**: Django management script
**Usage**: Database migrations, server startup, admin commands

#### `.env`
**Purpose**: Environment variables
**Contains**: Database credentials, secret keys, debug settings

### Utility Scripts

#### `run-project.bat`
**Purpose**: Automated project startup
**Functions**:
1. Starts Django backend server
2. Waits 3 seconds for backend initialization
3. Starts Next.js frontend server
4. Opens both in separate command windows

### Additional Files

#### `.gitignore`
**Purpose**: Git ignore rules
**Excludes**: node_modules, build files, environment files, cache

#### Global CSS Files
- `app/globals.css`: Global styles and CSS variables
- `styles/globals.css`: Additional global styles

#### Static Assets (`public/`)
- Logo images (PNG, SVG)
- Placeholder images
- User avatars

## Additional Components and Utilities

### Custom Hooks

#### `hooks/use-mobile.tsx`
**Purpose**: Responsive design hook for mobile detection
**Function**: `useIsMobile()`
- **Returns**: Boolean indicating if viewport is mobile size
- **Breakpoint**: 768px
- **Features**:
  - Uses `matchMedia` API for accurate detection
  - Listens for viewport changes
  - Returns undefined initially (SSR compatibility)
  - Automatically updates on window resize

#### `hooks/use-toast.ts`
**Purpose**: Toast notification system
**Key Functions**:
- `toast(props)`: Creates and displays toast notifications
- `useToast()`: Hook for managing toast state
- `reducer(state, action)`: State management for toasts

**Features**:
- **Toast Management**: Add, update, dismiss, and remove toasts
- **Auto Removal**: Configurable timeout (1,000,000ms default)
- **Action Types**: ADD_TOAST, UPDATE_TOAST, DISMISS_TOAST, REMOVE_TOAST
- **State Management**: Global toast state with local React state sync
- **Limit Control**: Maximum 1 toast at a time (configurable)

**Toast Object Structure**:
```typescript
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}
```

### Theme Management

#### `components/theme-provider.tsx`
**Purpose**: Theme context provider for dark/light mode
**Component**: `ThemeProvider`
- **Wraps**: `NextThemesProvider` from `next-themes`
- **Usage**: Provides theme switching capabilities
- **Props**: Passes through all ThemeProviderProps

### UI Components Library

The project uses **ShadCN UI** components located in `components/ui/`. These are pre-built, customizable components:

**Form Components**:
- `button.tsx`: Customizable button with variants
- `input.tsx`: Text input with styling
- `label.tsx`: Form labels
- `textarea.tsx`: Multi-line text input
- `checkbox.tsx`: Checkbox input
- `radio-group.tsx`: Radio button groups
- `select.tsx`: Dropdown select
- `form.tsx`: Form wrapper and validation

**Layout Components**:
- `card.tsx`: Card container with header/content/footer
- `sheet.tsx`: Slide-out panels
- `dialog.tsx`: Modal dialogs
- `drawer.tsx`: Bottom-up drawer
- `tabs.tsx`: Tabbed interfaces
- `accordion.tsx`: Collapsible content sections
- `separator.tsx`: Visual dividers

**Navigation Components**:
- `navigation-menu.tsx`: Complex navigation menus
- `menubar.tsx`: Menu bars
- `breadcrumb.tsx`: Breadcrumb navigation
- `pagination.tsx`: Page navigation
- `sidebar.tsx`: Side navigation panels

**Feedback Components**:
- `alert.tsx`: Alert messages
- `toast.tsx`: Toast notifications
- `progress.tsx`: Progress indicators
- `skeleton.tsx`: Loading skeletons
- `badge.tsx`: Status badges

**Data Display**:
- `table.tsx`: Data tables
- `chart.tsx`: Chart components
- `avatar.tsx`: User avatars
- `calendar.tsx`: Date picker calendar
- `hover-card.tsx`: Hover information cards

**Interactive Components**:
- `command.tsx`: Command palette
- `popover.tsx`: Floating content
- `tooltip.tsx`: Hover tooltips
- `context-menu.tsx`: Right-click menus
- `dropdown-menu.tsx`: Dropdown menus
- `slider.tsx`: Range sliders
- `switch.tsx`: Toggle switches
- `toggle.tsx`: Toggle buttons
- `toggle-group.tsx`: Toggle button groups

**Utility Components**:
- `scroll-area.tsx`: Custom scrollbars
- `resizable.tsx`: Resizable panels
- `aspect-ratio.tsx`: Aspect ratio containers
- `collapsible.tsx`: Collapsible content
- `carousel.tsx`: Image/content carousels
- `input-otp.tsx`: OTP input fields

### Backend Utilities

#### Data Population Script (`backend/populate_sample_data.py`)
**Purpose**: Seeds database with sample data for development
**Functions**:
- `create_sample_data()`: Main function to populate database

**Creates**:
1. **Admin User**:
   - Email: admin@example.com
   - Password: admin123
   - Role: admin

2. **Sample Students**:
   - John Doe (STU001)
   - Jane Smith (STU002) 
   - Mike Johnson (STU003)
   - Password: student123

3. **Sample Events**:
   - **Upcoming Events**: Spring Fashion Show, Wellness Workshop, Tech Innovation Summit
   - **Past Events**: Art & Craft Fair, Music Concert Night
   - **Categories**: Fashion, Wellness, Technology, Arts, Music
   - **Realistic Data**: Varied participants, dates, locations

**Usage**:
```bash
python backend/populate_sample_data.py
```

#### Management Command (`backend/events/management/commands/update_event_statuses.py`)
**Purpose**: Django management command to update event statuses
**Command**: `update_event_statuses`

**Functionality**:
- Iterates through all events
- Calls `event.update_status()` method
- Updates status based on current date:
  - Past: date < today
  - Ongoing: date = today
  - Upcoming: date > today
- Provides detailed console output
- Counts and reports updated events

**Usage**:
```bash
python manage.py update_event_statuses
```

**Output Example**:
```
Updated event "Spring Fashion Show" from upcoming to ongoing
Updated event "Old Event" from upcoming to past
Successfully updated 2 event statuses
```

### Global Styles

#### `app/globals.css`
**Purpose**: Global CSS styles and CSS custom properties
**Contains**:
- Tailwind CSS imports
- CSS custom properties for theming
- Dark/light mode color definitions
- Base styles for HTML elements
- Component-specific global styles

#### `styles/globals.css` (if exists)
**Purpose**: Additional global styles
**Usage**: Supplementary styles not covered in app/globals.css

### Static Assets (`public/`)

**Image Files**:
- `placeholder-logo.png/svg`: Application logo files
- `placeholder-user.jpg`: Default user avatar
- `placeholder.jpg/svg`: General placeholder images

**Usage**: Referenced in components for branding and default images

### Configuration Deep Dive

#### TypeScript Configuration (`tsconfig.json`)
**Compiler Options**:
- **Target**: ES6 for modern JavaScript features
- **Module**: ESNext for tree shaking
- **JSX**: Preserve for Next.js processing
- **Strict**: True for type safety
- **Path Mapping**: `@/*` for clean imports

#### Tailwind Configuration (`tailwind.config.ts`)
**Key Features**:
- **CSS Variables**: Integration with custom properties
- **Dark Mode**: Class-based dark mode switching
- **Custom Colors**: Extended palette for design system
- **Animations**: Custom keyframes and transitions
- **Plugins**: Tailwind Animate for advanced animations

#### Next.js Configuration (`next.config.mjs`)
**Optimizations**:
- **Build Performance**: Disabled ESLint/TypeScript checks for faster builds
- **Image Optimization**: Unoptimized for development flexibility
- **Future Features**: Ready for Next.js updates

### Development Workflow

#### Project Startup (`run-project.bat`)
**Automation Features**:
1. **Backend Startup**: Activates virtual environment and starts Django
2. **Timing Control**: 3-second delay for backend initialization
3. **Frontend Startup**: Starts Next.js development server
4. **Window Management**: Separate command windows for each service
5. **User Feedback**: Clear status messages and instructions

**Benefits**:
- Single command startup
- Proper service initialization order
- Isolated process management
- Development environment consistency

### Database Management

#### Migration Files
**Location**: `backend/accounts/migrations/`, `backend/events/migrations/`
**Purpose**: Database schema version control
**Files**:
- `0001_initial.py`: Initial database schema
- Additional migrations for schema changes

#### Database Files
- `db.sqlite3`: SQLite database file (development)
- `db.sqlite3.backup`: Database backup
- `data_backup.json`: JSON export of database data

### Environment Management

#### Virtual Environment (`backend/venv/`)
**Purpose**: Isolated Python environment
**Contains**: Project-specific Python packages
**Activation**: `venv\Scripts\activate` (Windows)

#### Environment Variables (`.env`)
**Security Features**:
- Database credentials
- Secret keys
- Debug settings
- Host configurations

### Package Management

#### Node.js Dependencies (`package.json`)
**Production Dependencies**:
- **Framework**: Next.js, React
- **UI Library**: Radix UI components
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form, Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

**Development Dependencies**:
- **TypeScript**: Type checking
- **PostCSS**: CSS processing
- **Type Definitions**: @types packages

#### Python Dependencies (`requirements.txt`)
**Core Packages**:
- **Django**: Web framework
- **DRF**: API development
- **JWT**: Authentication
- **CORS**: Cross-origin requests
- **MySQL**: Database connector
- **Pillow**: Image processing
- **Decouple**: Environment variables

## Project Architecture Summary

### Frontend Architecture
- **App Router**: Next.js 13+ file-based routing
- **Component Structure**: Atomic design principles
- **State Management**: React hooks and local state
- **API Layer**: Centralized Axios client with interceptors
- **Styling**: Utility-first CSS with component library
- **Type Safety**: Comprehensive TypeScript coverage

### Backend Architecture
- **MVT Pattern**: Django's Model-View-Template (API views)
- **REST API**: Django REST Framework
- **Authentication**: JWT token-based
- **Database**: SQLite (dev) / MySQL (prod)
- **Permissions**: Role-based access control
- **Management**: Custom Django commands

### Security Features
- **JWT Tokens**: Secure authentication
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Frontend and backend validation
- **Permission Checks**: Role-based authorization

### Performance Optimizations
- **Image Optimization**: Next.js image handling
- **Code Splitting**: Automatic bundle splitting
- **Tree Shaking**: Unused code elimination
- **Caching**: Browser and server-side caching
- **Database Queries**: Optimized ORM usage

This documentation provides comprehensive coverage of the Sreya project structure, functionality, and implementation details. Each component is designed to work together to create a cohesive event management system with proper authentication, authorization, and user experience. The project follows modern web development best practices and provides a scalable foundation for event management applications.
