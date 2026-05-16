# Team Task Manager

A full-stack project management app with JWT auth, admin/member roles, projects, kanban task tracking, comments, and dashboard metrics.

## Stack

- Frontend: React 18, Vite, TanStack Query v5, Axios, `@dnd-kit/core`, plain CSS
- Backend: FastAPI, Beanie ODM, Motor, MongoDB, Pydantic v2
- Auth: JWT access and refresh tokens with `python-jose` and `passlib[bcrypt]`
- Deployment target: Railway frontend and backend services, MongoDB Atlas

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`. API docs are available at `http://localhost:8000/docs`.

Required backend env vars:

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/team_task_manager
DATABASE_NAME=team_task_manager
SECRET_KEY=replace-with-a-random-32-byte-hex-string
CORS_ORIGINS=http://localhost:5173
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

Seed an admin user:

```bash
cd backend
python seed.py
```

Optional seed env vars: `SEED_ADMIN_EMAIL`, `SEED_ADMIN_USERNAME`, `SEED_ADMIN_PASSWORD`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

Required frontend env vars:

```env
VITE_API_URL=http://localhost:8000
```

## API Reference

Use Swagger UI at `/docs` for the interactive reference.

Primary endpoints:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/{id}`
- `PUT /api/projects/{id}`
- `DELETE /api/projects/{id}`
- `POST /api/projects/{id}/members`
- `GET /api/projects/{id}/tasks`
- `POST /api/projects/{id}/tasks`
- `GET /api/tasks/{id}`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
- `GET /api/tasks/{id}/comments`
- `POST /api/tasks/{id}/comments`
- `DELETE /api/comments/{id}`
- `GET /api/dashboard`

## Architecture

The backend initializes a Motor client and Beanie documents in the FastAPI lifespan hook. Routers enforce role-based access with shared dependencies: admins can create projects and tasks, project owners/admins can update/delete projects, members can view project data and update only task status, and comment deletion is limited to the author.

The frontend keeps the access token in memory and the refresh token in `localStorage`. Axios attaches bearer tokens, refreshes once on `401`, and redirects to login if refresh fails. TanStack Query owns all server state and invalidates affected project/task/comment/dashboard queries after mutations.

## Railway Deployment

### Backend service

Root directory: `backend`

Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Environment variables:

```env
MONGO_URI=your MongoDB Atlas connection string
SECRET_KEY=random 32-byte hex string
CORS_ORIGINS=https://your-frontend.up.railway.app
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Frontend service

Root directory: `frontend`

Build command:

```bash
npm run build
```

Start command:

```bash
npx serve dist
```

Environment variables:

```env
VITE_API_URL=https://your-backend.up.railway.app
```

### MongoDB Atlas

Create a free M0 cluster, add a database user, and whitelist `0.0.0.0/0` in Network Access for Railway egress. Paste the Atlas connection string into `MONGO_URI`.

## Deployment URLs

- Frontend: add your Railway frontend URL here after deployment
- Backend: add your Railway backend URL here after deployment
