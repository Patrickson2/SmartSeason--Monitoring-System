# SmartSeason - Complete Setup Guide

##  **Quick Start Instructions**

Get SmartSeason running in under 10 minutes with this comprehensive setup guide.

---

## ** Prerequisites Checklist**

### **System Requirements**
- **Operating System**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: Minimum 10GB free space
- **Internet**: Stable connection for package installation

### **Required Software**
```bash
# Backend Requirements
Python 3.9+          # Check with: python --version
PostgreSQL 12+         # Check with: psql --version
pip 21.0+             # Check with: pip --version

# Frontend Requirements
Node.js 16+            # Check with: node --version
npm 8+                 # Check with: npm --version
Git 2.25+              # Check with: git --version
```

### **Installation Commands**
```bash
# Install Python (if not installed)
# Ubuntu/Debian:
sudo apt update && sudo apt install python3.9 python3.9-pip python3.9-venv

# macOS (using Homebrew):
brew install python@3.9

# Windows (using Chocolatey):
choco install python

# Install Node.js (if not installed)
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS:
brew install node

# Windows:
choco install nodejs

# Install PostgreSQL
# Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib

# macOS:
brew install postgresql

# Windows:
choco install postgresql
```

---

## ** Backend Setup**

### **Step 1: Clone and Navigate**
```bash
# Clone the repository
git clone <repository-url>
cd SmartSeason/Backend

# Verify Python version
python --version  # Should be 3.9+
```

### **Step 2: Create Virtual Environment**
```bash
# Create virtual environment
python3.9 -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate

# Windows:
venv\Scripts\activate

# Verify activation (should show (venv) in prompt)
which python
```

### **Step 3: Install Dependencies**
```bash
# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Verify installation
pip list
```

### **Step 4: Database Setup**
```bash
# Start PostgreSQL service
# Linux:
sudo systemctl start postgresql
sudo systemctl enable postgresql

# macOS:
brew services start postgresql

# Windows:
# PostgreSQL runs as a service automatically

# Create database user
sudo -u postgres createuser --interactive
# Enter: smartseason (username)
# Enter password: your_password

# Create database
sudo -u postgres createdb -O smartseason smartseason_db
```

### **Step 5: Environment Configuration**
```bash
# Create environment file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

**Environment File Contents:**
```bash
# Database Configuration
DATABASE_URL=postgresql://smartseason:your_password@localhost:5432/smartseason_db

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Admin Configuration
ADMIN_EMAIL=admin@smartseason.com
ADMIN_PASSWORD=Admin123!

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### **Step 6: Database Migration**
```bash
# Run Alembic migrations
alembic upgrade head

# Verify migration
alembic current
```

### **Step 7: Start Backend Server**
```bash
# Development mode (with auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### **Step 8: Verify Backend**
```bash
# Test API endpoints
curl http://localhost:8000/api/health

# Check API documentation
# Open browser: http://localhost:8000/docs
```

---

## ** Frontend Setup**

### **Step 1: Navigate and Install**
```bash
# Navigate to frontend directory
cd ../Frontend/Monitoring-system

# Verify Node.js version
node --version  # Should be 16+
npm --version   # Should be 8+
```

### **Step 2: Install Dependencies**
```bash
# Install npm packages
npm install

# Verify installation
ls node_modules
```

### **Step 3: Environment Configuration**
```bash
# Create environment file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

**Frontend Environment File:**
```bash
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Application Configuration
VITE_APP_NAME=SmartSeason
VITE_VERSION=2.0.0

# Optional: Environment
VITE_NODE_ENV=development
```

### **Step 4: Start Development Server**
```bash
# Start development server
npm run dev

# Alternative: Start with specific port
npm run dev -- --port 5173
```

### **Step 5: Verify Frontend**
```bash
# Check if server is running
curl http://localhost:5173

# Open browser
# Navigate to: http://localhost:5173
```

---

## ** Troubleshooting Common Issues**

### **Backend Issues**

#### **Issue: "ModuleNotFoundError: No module named 'fastapi'"**
```bash
# Solution: Activate virtual environment
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

#### **Issue: "Connection refused" on database**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql  # macOS
```

#### **Issue: "FATAL: database does not exist"**
```bash
# Create database manually
sudo -u postgres createdb smartseason_db

# Check database exists
sudo -u postgres psql -l
```

#### **Issue: Port already in use**
```bash
# Find process using port 8000
lsof -i :8000  # Linux/macOS
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

### **Frontend Issues**

#### **Issue: "npm ERR! code ERESOLVE"**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### **Issue: "VITE_API_URL is not defined"**
```bash
# Check .env file exists
ls -la .env

# Restart development server
npm run dev
```

#### **Issue: "Module not found: Can't resolve 'react'"**
```bash
# Reinstall dependencies
npm install

# Check React installation
npm list react
```

---

## ** Production Deployment**

### **Backend Production Setup**

#### **Using Docker (Recommended)**
```bash
# Create Dockerfile (if not exists)
cat > Dockerfile << EOF
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Build and run
docker build -t smartseason-backend .
docker run -p 8000:8000 smartseason-backend
```

#### **Using Systemd (Linux)**
```bash
# Create service file
sudo nano /etc/systemd/system/smartseason-backend.service
```

**Service File Contents:**
```ini
[Unit]
Description=SmartSeason Backend
After=network.target

[Service]
Type=simple
User=smartseason
WorkingDirectory=/path/to/SmartSeason/Backend
Environment=PATH=/path/to/SmartSeason/Backend/venv/bin
ExecStart=/path/to/SmartSeason/Backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable smartseason-backend
sudo systemctl start smartseason-backend
```

### **Frontend Production Setup**

#### **Vercel Deployment (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
npm run build
vercel --prod

# Configure environment variables in Vercel dashboard
VITE_API_URL=https://your-backend-url.com/api
```

#### **Netlify Deployment**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist

# Configure redirects in Netlify dashboard
# Redirect /* /index.html 200
```

#### **AWS S3 Deployment**
```bash
# Build application
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure CloudFront distribution
# AWS Console > CloudFront > Create Distribution
```

---

## ** Security Configuration**

### **Backend Security**
```bash
# Generate strong secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Configure HTTPS (production)
# Use nginx reverse proxy or cloud load balancer
# Install SSL certificate
```

**Nginx Configuration Example:**
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### **Frontend Security**
```bash
# Configure CSP headers
# In your nginx or server configuration
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.smartseason.com;"

# Configure HTTPS only
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

---

## ** Performance Monitoring**

### **Backend Monitoring**
```bash
# Install monitoring tools
pip install prometheus-client grafana-api

# Add metrics to your FastAPI app
# See backend documentation for details
```

### **Frontend Monitoring**
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run performance tests
lhci autorun
```

---

## ** Testing Setup**

### **Backend Testing**
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py
```

### **Frontend Testing**
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## **📞 Support & Resources**

### **Documentation Links**
- **Backend API**: http://localhost:8000/docs
- **Frontend Guide**: http://localhost:5173
- **Project Overview**: PROJECT_OVERVIEW.md
- **Backend README**: Backend/README.md
- **Frontend README**: Frontend/README_FRONTEND.md

### **Common Commands Reference**
```bash
# Backend Commands
source venv/bin/activate    # Activate environment
pip install -r requirements.txt  # Install dependencies
alembic upgrade head          # Run migrations
uvicorn app.main:app --reload  # Start dev server

# Frontend Commands
npm install                   # Install dependencies
npm run dev                   # Start dev server
npm run build                 # Build for production
npm run preview                # Preview production build
```

### **Getting Help**
```bash
# Check logs
# Backend: Check terminal output
# Frontend: Check browser console

# Reset everything
# Backend: rm -rf venv && python3.9 -m venv venv
# Frontend: rm -rf node_modules package-lock.json && npm install

# Verify installation
curl http://localhost:8000/api/health  # Backend health
curl http://localhost:5173           # Frontend health
```

---

## ** Success Verification**

### **Final Checklist**
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Database connected and migrated
- [ ] Can access API documentation
- [ ] Can login with demo credentials
- [ ] AI image upload working
- [ ] Field management functional
- [ ] Dashboard analytics displaying
- [ ] No console errors
- [ ] Responsive design working

### **Demo Test Flow**
1. **Open**: http://localhost:5173
2. **Login**: admin@smartseason.com / Admin123!
3. **Create Field**: Add test field with crop type
4. **Upload Image**: Test AI analysis feature
5. **View Dashboard**: Check analytics display
6. **Test Agent Role**: Login with agent credentials

---

*** Congratulations! Your SmartSeason agricultural intelligence platform is now running!**

*For issues or questions, refer to the troubleshooting section or check the comprehensive documentation in the project README files.*
