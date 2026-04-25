# Backend Deployment Fix TODO

## Steps

- [x] 1. Fix `Backend/render.yaml` (pythonVersion 3.14 → 3.11, improve build/start commands)
- [x] 2. Fix `Backend/database.py` (add SQLite `check_same_thread=False` support)
- [x] 3. Fix `Backend/app/main.py` (lifespan context, Base.metadata.create_all, configurable CORS)
- [x] 4. Fix `Backend/requirements.txt` (add missing `psycopg2-binary`, `email-validator`)
- [x] 5. Create `Backend/Dockerfile` (production-ready Docker image)
- [x] 6. Fix `Backend/alembic.ini` (remove hardcoded local PostgreSQL URL)
- [x] 7. Update `Backend/README.md` (align docs with new deployment setup)
- [x] 8. Verify no syntax errors / broken imports
