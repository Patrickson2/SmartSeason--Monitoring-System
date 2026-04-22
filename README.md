# SmartSeason

Agricultural Field Monitoring and Management System

## Overview

SmartSeason is a full-stack web application for managing agricultural fields, tracking crop stages, and monitoring field status. It provides role-based access for administrators and field agents.

## Tech Stack

### Backend
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite/PostgreSQL (Database)
- JWT Authentication
- Alembic (Database migrations)

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Axios

## Quick Start

### Using Docker Compose

```bash
docker-compose up --build
```

### Manual Setup

#### Backend

```bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd Frontend/Monitoring-system
npm install
npm run dev
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/fields` - List fields
- `POST /api/fields` - Create field
- `GET /api/fields/{id}` - Get field details
- `PUT /api/fields/{id}` - Update field
- `DELETE /api/fields/{id}` - Delete field
- `POST /api/fields/{id}/updates` - Add field update
- `GET /api/users` - List users (admin only)

## User Roles

- **Admin**: Can manage all fields, users, and view analytics
- **Agent**: Can view assigned fields and report updates

## License

MIT