# JobNova - Production-Ready, Real-Time Job Portal

JobNova is a SaaS-level, modern job matching portal (hybrid of LinkedIn and Indeed) built with a Django Channels/DRF backend and a React/Vite/Tailwind CSS v4 frontend. Applications, status changes, and new job postings sync in real time across clients using secure WebSockets.

---

## Technical Stack & Architecture

### Backend:
* **Django & Django REST Framework (DRF)**: Relational model management and REST API serializers.
* **Django Channels & Daphne**: Asynchronous WebSocket consumers.
* **SimpleJWT**: Stateful role-based access control with access + refresh token rotating interceptors.
* **Redis Channel Layers**: Message broker for WebSocket event broadcasting.
* **PostgreSQL / SQLite**: Configurable relational databases.

### Frontend:
* **React (Vite)**: Component-driven Single Page Application.
* **Tailwind CSS v4**: Ultra-fast, modern CSS-first design with built-in dark mode support.
* **Framer Motion**: Smooth micro-animations, toast slides, and loading screen transitions.
* **Axios**: Promised-based client with custom interceptors to auto-inject/rotate JWT tokens.
* **React Router DOM**: Declarative client routing.

---

## Folder Structure

```
[Job Finder]
├── backend/                  # Django project root
│   ├── core/                 # Modular settings (base, dev, prod), routing, urls
│   ├── users/                # Auth, Candidate & Recruiter profiles
│   ├── jobs/                 # Listings, browse query filters, and recruiter postings
│   ├── applications/         # Job applications and PDF resume file uploads
│   ├── notifications/        # DB records, WebSocket consumers, JWT middleware, signals
│   ├── seed.py               # Pre-populated mock data database seeder
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment secrets configuration
└── frontend/                 # React project root
    ├── src/
    │   ├── components/       # Navbar, ProtectedRoute, JobCard, Toast, Skeleton
    │   ├── context/          # AuthContext, NotificationContext, ThemeContext
    │   ├── pages/            # Landing, Login, Register, Dashboards, Details
    │   ├── services/         # Axios API client
    │   ├── App.jsx           # Routes definitions
    │   └── main.jsx          # Mount root
    ├── package.json          # Node dependencies
    └── vite.config.js        # Vite compilation, proxy configs
```

---

## Setup & Execution Instructions

### Prerequisites
* Python 3.9+
* Node.js 18+
* Redis server (Recommended for full multi-process WebSocket support, but defaults to a resilient in-memory channel layer fallback if not running)

---

### Step 1: Backend Setup
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Create and activate a python virtual environment:
   ```bash
   python -m venv venv
   # On Windows (cmd/powershell):
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Perform database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Populate the database with realistic candidate accounts, recruiter companies, job postings, and notifications:
   ```bash
   python seed.py
   ```
6. Start the Daphne development server (runs both HTTP APIs and secure WebSocket protocols):
   ```bash
   python manage.py runserver
   ```
   *The server runs by default on `http://127.0.0.1:8000/`.*

---

### Step 2: Frontend Setup
1. Navigate to the `frontend/` folder:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Launch the Vite hot-reloading dev server:
   ```bash
   npm run dev
   ```
   *The client will open by default on `http://localhost:5173/`.*

---

## Pre-populated Seed Credentials

To log in immediately after running `python seed.py`, use the following accounts:

### 1. Recruiter Accounts:
* **Google Recruiter**:
  * Username: `google_recruiter`
  * Password: `Password123`
* **Stripe Recruiter**:
  * Username: `stripe_recruiter`
  * Password: `Password123`

### 2. Candidate Accounts:
* **John Doe** (React/JS Dev):
  * Username: `john_doe`
  * Password: `Password123`
* **Jane Smith** (Python/Django Architect):
  * Username: `jane_smith`
  * Password: `Password123`

---

## Core Real-Time API Endpoints Reference

### Authentication (SimpleJWT)
* `POST /api/auth/register/` - Create a candidate/recruiter account
* `POST /api/auth/login/` - Issues Access and Refresh tokens
* `POST /api/auth/token/refresh/` - Issues new access token
* `GET /api/auth/me/` - Fetches authenticated user summary

### Profiles Settings
* `GET /api/profile/` - Fetch profile metadata
* `PUT /api/profile/` - Update profile, upload PDF resumes, upload logos

### Jobs Engine
* `GET /api/jobs/` - Browse active postings (Supports text query, arrangement, and salary filtering)
* `POST /api/jobs/` - Publish a new job (Recruiter only - broadcasts `job_created` to all users via WS)
* `DELETE /api/jobs/<id>/` - Delete a listing

### Job Applications
* `POST /api/apply/` - Candidates apply by submitting cover note and custom resume PDF
* `GET /api/applications/` - List history (Candidates see theirs; recruiters see applications for their jobs)
* `PATCH /api/applications/<id>/` - Recruiters shortlist, hire, or reject (fires direct WS notification to the candidate)
