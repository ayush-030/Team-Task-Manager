# Team Task Manager

Task Flow is a full-stack project management web application inspired by collaborative tools like Trello and Asana. The platform enables users to create projects, manage teams, assign tasks, track progress, and collaborate efficiently using role-based access control.

## Live Application

Frontend:  
https://team-task-manager-production-ad45.up.railway.app

Backend API Docs:  
https://team-task-manager-production-ddfe.up.railway.app/docs

## GitHub Repository

https://github.com/ayush-030/Team-Task-Manager

---

# Features

## Authentication
- User signup and login
- JWT-based authentication
- Secure password hashing using bcrypt
- Access and refresh token flow

## Role-Based Access Control

### Platform Roles
- Super Admin
  - Global platform access
  - Access all projects and tasks

- User
  - Create and manage own projects

### Project Roles
- Project Admin
  - Add/remove project members
  - Create and manage tasks
  - Assign tasks to members
  - Manage project workflow

- Project Member
  - View assigned projects
  - Update assigned tasks
  - Add comments
  - Manage checklist items
  - Add progress notes

## Project Management
- Create projects
- Add/remove team members
- Manage project members
- View project analytics

## Task Management
- Create tasks
- Assign tasks to members
- Update task status
- Priority management
- Due date tracking
- Task comments
- Checklist tracking
- Progress notes

## Dashboard & Analytics
- Total tasks
- Tasks by status
- Overdue tasks
- Productivity metrics
- Tasks completed over time
- Project analytics

---

# Tech Stack

## Frontend
- React 18
- Vite
- Axios
- React Router
- TanStack Query
- Plain CSS

## Backend
- FastAPI
- Beanie ODM
- Motor (MongoDB async driver)
- Pydantic v2
- JWT Authentication

## Database
- MongoDB Atlas

## Deployment
- Railway (Frontend and Backend)

---

# Project Structure

```bash
Team-Task-Manager/
│
├── backend/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── dependencies.py
│   ├── main.py
│   ├── config.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/ayush-030/Team-Task-Manager.git

cd Team-Task-Manager
```

# Backend Setup

## Navigate to backend

```bash
cd backend
```

## Create virtual environment

```bash
python -m venv .venv
source .venv/Scripts/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Run backend

```bash
uvicorn main:app --reload
```

# Frontend Setup

## Navigate to frontend

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Run frontend

```bash
npm run dev
```

# Railway Deployment

## Backend Service

Root Directory:
backend

Start Command:
uvicorn main:app --host 0.0.0.0 --port $PORT

## Frontend Service

Root Directory:
frontend

Build Command:
npm run build

Start Command:
npx serve dist -s

# Author

Ayush Rawat

Email: ayushrawat521@gmail.com

LinkedIn:
https://www.linkedin.com/in/ayushrawat20

GitHub:
https://github.com/ayush-030
