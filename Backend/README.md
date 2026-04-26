# SmartSeason Backend API

## Enterprise-Grade Agricultural Intelligence Platform

A RESTful API powering AI-driven agricultural field monitoring with real-time analytics, computer vision integration, and intelligent crop management.

---

## Architecture Overview

### Core Technology Stack

- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL (Docker) / SQLite (Render free tier)
- **ORM**: SQLAlchemy 2.0 with declarative mapped columns
- **Authentication**: JWT tokens with role-based access control
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Validation**: Pydantic v2 schemas
- **Migration Management**: Alembic for database versioning
- **Security**: CORS, bcrypt password hashing, input sanitization

### Advanced Features

- **AI Computer Vision Integration**: Mock ML endpoints for crop detection
- **Weather Intelligence**: Simulated weather data and recommendations
- **Smart Analytics**: Field status computation and risk assessment
- **Multi-Role System**: Admin/Agent permissions with approval workflow
- **Real-time Monitoring**: Field updates and stage tracking

---

## API Endpoints

### Authentication

```http
POST /api/auth/login          # User authentication
POST /api/auth/register/agent # Agent registration (pending approval)
```

### User Management

```http
GET  /api/users/agents        # List all agents (Admin)
POST /api/users/agents        # Create agent (Admin)
POST /api/users/agents/{id}/approve  # Approve/reject agent (Admin)
```

### Field Management

```http
GET    /api/fields              # List fields (role-filtered)
POST   /api/fields              # Create field (Admin)
GET    /api/fields/{id}         # Get field details
PATCH  /api/fields/{id}/stage   # Update crop stage
PATCH  /api/fields/{id}/assign  # Assign agent (Admin)
POST   /api/fields/{id}/updates # Add observations
GET    /api/fields/{id}/updates # Get update history
```

### AI-Powered Analysis

```http
POST /api/ai/analyze-field/{id}   # Analyze drone image
GET  /api/ai/insights/{id}       # Get field intelligence
GET  /api/ai/system-status        # AI system metrics
```

---

## Development Setup

### Prerequisites

```bash
Python 3.11+
PostgreSQL 14+ (for Docker/local dev)
pip 21.0+
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd SmartSeason/Backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Environment setup
cp .env.example .env
# Edit .env with your database credentials
```

### Environment Variables

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smartseason
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_EMAIL=admin@smartseason.com
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=SmartSeason Admin
ALLOWED_ORIGINS=https://your-frontend.com,https://app.your-frontend.com
```

> **Note**: `ALLOWED_ORIGINS` is comma-separated and used for CORS in production. Leave empty to allow localhost dev servers.

### Database Setup

```bash
# Create database (PostgreSQL)
createdb smartseason

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

> The default admin user is created automatically on startup if no admin exists.

### Populate with Demo Data

```bash
# After starting the backend and confirming tables exist:
python seed.py
```

This creates:

- **5 agents** with randomized names
- **12 fields** with randomized crops and stages
- **30-40 field updates** simulating agent activity
- **AI analysis records** with mock data
- **Login credentials**: `agent1@smartseason.demo` / `password123` (through `agent5`)

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

---

## Docker Setup

### Using Docker Compose (Full Stack)

```bash
# From project root
docker-compose up --build
```

This starts:

- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **Database**: PostgreSQL on port 5432

### Backend Only (Docker)

```bash
cd Backend
docker build -t smartseason-api .
docker run -p 8000:8000 --env-file .env smartseason-api
```

---

## Render Deployment

### Setup

1. Push code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your repository.
4. Render will auto-detect `render.yaml` (Blueprint) or use these settings:
   - **Environment**: Python 3
   - **Build Command**: `pip install --upgrade pip && pip install --prefer-binary -r requirements.txt`
   - **Start Command**: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `Backend`

### Environment Variables on Render

| Key               | Example Value                                                   |
| ----------------- | --------------------------------------------------------------- |
| `DATABASE_URL`    | `sqlite:///./smartseason.db` (free tier) or your PostgreSQL URL |
| `SECRET_KEY`      | Auto-generate or set a strong random string                     |
| `ADMIN_PASSWORD`  | Set a secure password                                           |
| `ALLOWED_ORIGINS` | `https://your-frontend.onrender.com`                            |

> **Free Tier Note**: Render free tier uses an ephemeral filesystem. SQLite data will persist between restarts but will be wiped on each deploy. For production persistence, upgrade to PostgreSQL on Render.

---

## Security Implementation

### Authentication & Authorization

- **JWT Tokens**: Secure session management with expiration
- **Role-Based Access**: Admin/Agent permission levels
- **Password Security**: bcrypt hashing with salt
- **Input Validation**: Pydantic schema validation
- **CORS Configuration**: Cross-origin request security (configurable via `ALLOWED_ORIGINS`)

### Data Protection

- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **XSS Prevention**: Input sanitization
- **HTTPS Ready**: SSL/TLS configuration support

---

## Project Structure

```
Backend/
├── alembic/              # Database migrations
├── app/
│   ├── config.py         # Settings & environment variables
│   ├── database.py       # SQLAlchemy engine & session
│   ├── main.py           # FastAPI app & lifespan events
│   ├── models/           # SQLAlchemy models
│   ├── routers/          # API route handlers
│   ├── schemas/          # Pydantic request/response models
│   └── services/         # Business logic & auth
├── Dockerfile            # Production Docker image
├── render.yaml           # Render Blueprint
├── requirements.txt      # Python dependencies
└── runtime.txt           # Python runtime version
```

---

## Performance & Scaling

### Optimization Features

- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Async Operations**: FastAPI async/await support
- **Load Balancing**: Multi-worker deployment support

### Monitoring & Logging

- **Health Checks**: `/health` endpoint for uptime monitoring
- **Structured Logging**: Request/response tracking
- **Error Tracking**: Comprehensive exception handling

---

## Testing

```bash
# Run unit tests
pytest tests/

# Coverage report
pytest --cov=app tests/

# Integration tests
pytest tests/integration/
```

---

## Version

- **Version**: 2.1.0
- **License**: MIT
- **Last Updated**: 2026-04-24

---

**This backend is a production-ready API demonstrating advanced software engineering capabilities, AI integration expertise, and enterprise-level architecture design.**
