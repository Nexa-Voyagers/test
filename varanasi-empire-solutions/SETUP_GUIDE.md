# Varanasi Empire Solutions - Complete Setup Guide

This guide will walk you through setting up and running any of the 22 business management solutions in this package.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Docker)](#quick-start-docker)
3. [Manual Setup](#manual-setup)
4. [Testing the Setup](#testing-the-setup)
5. [Solution-Specific Notes](#solution-specific-notes)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Node.js** (v18 or v20 LTS)
   ```bash
   node --version  # Should be v18.x or v20.x
   npm --version   # Should be v9.x or v10.x
   ```

2. **PostgreSQL** (v15+)
   ```bash
   psql --version  # Should be 15.x or higher
   ```

3. **Docker & Docker Compose** (Optional, for containerized deployment)
   ```bash
   docker --version
   docker-compose --version
   ```

4. **Git**
   ```bash
   git --version
   ```

---

## Quick Start (Docker)

The fastest way to get started is using Docker Compose.

### Step 1: Choose a Solution

For this example, we'll use **Restaurant POS Management** (solution 03).

```bash
cd varanasi-empire-solutions/03-RESTAURANT-POS-MANAGEMENT
```

### Step 2: Create Environment File

```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=restaurant_pos
DB_USER=postgres
DB_PASSWORD=your_secure_password_here

# Server
NODE_ENV=development
PORT=5000

# JWT
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRES_IN=7d

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Step 3: Create Docker Compose File

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: restaurant_pos
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_secure_password_here
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: restaurant_pos
      DB_USER: postgres
      DB_PASSWORD: your_secure_password_here
      PORT: 5000
      JWT_SECRET: your_jwt_secret_key_here_min_32_chars
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api/v1
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
```

### Step 4: Launch Everything

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database
- Create database schema
- Load demo data
- Start backend API server on port 5000
- Start frontend on port 3000

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **API Health**: http://localhost:5000/api/health

**Default Login** (from demo data):
- Email: `admin@restaurant.com`
- Password: `admin123`

---

## Manual Setup

If you prefer to run without Docker, follow these steps:

### Step 1: Setup PostgreSQL Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE restaurant_pos;
CREATE USER pos_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE restaurant_pos TO pos_user;

# Enable required extensions
\c restaurant_pos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

\q
```

### Step 2: Load Database Schema

```bash
cd varanasi-empire-solutions/03-RESTAURANT-POS-MANAGEMENT

# Load schema
psql -U pos_user -d restaurant_pos -f database/complete-schema.sql

# Load demo data
psql -U pos_user -d restaurant_pos -f database/demo-data.sql
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_pos
DB_USER=pos_user
DB_PASSWORD=your_password

# Server
NODE_ENV=development
PORT=5000

# JWT
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
EOF

# Start backend
npm run dev
```

Backend should now be running on http://localhost:5000

### Step 4: Setup Frontend (if available)

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
EOF

# Start frontend
npm run dev
```

Frontend should now be running on http://localhost:3000

---

## Testing the Setup

### Test 1: Backend Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-11-19T...",
  "uptime": 123.45
}
```

### Test 2: Database Connection

```bash
curl http://localhost:5000/api/v1/restaurants
```

Should return list of restaurants from demo data.

### Test 3: Authentication

```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "admin123"
  }'
```

Should return JWT token.

### Test 4: Create a Resource (with auth)

```bash
# Get token from previous test
TOKEN="your_jwt_token_here"

# Create a menu item
curl -X POST http://localhost:5000/api/v1/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Dish",
    "category": "Main Course",
    "price": 250,
    "description": "Test description"
  }'
```

---

## Solution-Specific Notes

### Solutions with Complete Frontends (2)

**Ready to use immediately:**

1. **03-RESTAURANT-POS-MANAGEMENT**
   - Database: `restaurant_pos`
   - Backend Port: 5000
   - Frontend Port: 3000
   - Features: POS, menu management, orders, billing, inventory

2. **01-HOTEL-HOSPITALITY-MANAGEMENT**
   - Database: `hotel_management`
   - Backend Port: 5001
   - Frontend Port: 3001
   - Features: Bookings, rooms, housekeeping, billing

### Solutions with Backend Only (20)

**Can be used via API or add frontend:**

All other solutions (02, 04-22) have complete backend APIs. You can:

**Option A: Use Backend API directly**
- Access via REST API endpoints
- Build custom frontend
- Integrate with existing systems

**Option B: Use Frontend Starter Template**
```bash
# Copy starter template
cp -r shared/frontend-starter 05-HOSPITAL-MANAGEMENT-SYSTEM/frontend

# Customize for your solution
cd 05-HOSPITAL-MANAGEMENT-SYSTEM/frontend
npm install
# Edit pages and components for hospital-specific features
npm run dev
```

---

## Port Assignments

To run multiple solutions simultaneously, use different ports:

| Solution | Database | Backend Port | Frontend Port |
|----------|----------|--------------|---------------|
| 01 - Hotel | hotel_db | 5001 | 3001 |
| 02 - Temple | temple_db | 5002 | 3002 |
| 03 - Restaurant | restaurant_db | 5003 | 3003 |
| 04 - Travel | travel_db | 5004 | 3004 |
| ... | ... | ... | ... |
| 22 - Spa | spa_db | 5022 | 3022 |

Update `PORT` in backend `.env` and rebuild.

---

## Database Schema Updates

If you need to modify the database schema:

```bash
# Create migration file
cd database/migrations
touch $(date +%Y%m%d%H%M%S)_your_migration_name.sql

# Add your SQL changes
# Then apply:
psql -U your_user -d your_database -f database/migrations/YYYYMMDDHHMMSS_your_migration_name.sql
```

---

## Troubleshooting

### Issue 1: Database Connection Failed

**Error**: `ECONNREFUSED` or `password authentication failed`

**Solution**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start if not running
sudo systemctl start postgresql

# Verify credentials in .env match database user
```

### Issue 2: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=5050
```

### Issue 3: JWT Token Invalid

**Error**: `401 Unauthorized` or `Invalid token`

**Solution**:
- Ensure `JWT_SECRET` is at least 32 characters
- Check token hasn't expired (default 7 days)
- Verify token is passed in header: `Authorization: Bearer <token>`

### Issue 4: Demo Data Not Loading

**Error**: Queries return empty results

**Solution**:
```bash
# Re-load demo data
psql -U your_user -d your_database -f database/demo-data.sql

# Verify data loaded
psql -U your_user -d your_database -c "SELECT COUNT(*) FROM restaurants;"
```

### Issue 5: Frontend Can't Connect to Backend

**Error**: `Network Error` or `CORS Error`

**Solution**:
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Verify NEXT_PUBLIC_API_URL in frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Restart frontend
npm run dev
```

---

## Production Deployment

### Using Docker Compose (Recommended)

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f backend
```

### Using Kubernetes

```bash
# Apply Kubernetes manifests
cd shared/deployment/kubernetes

# Create namespace
kubectl apply -f namespace.yaml

# Create secrets
kubectl apply -f secrets.yaml

# Deploy PostgreSQL
kubectl apply -f postgres-statefulset.yaml
kubectl apply -f postgres-service.yaml

# Deploy backend
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Deploy frontend
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# Setup ingress
kubectl apply -f ingress.yaml

# Check status
kubectl get pods -n varanasi-empire
```

---

## Environment Variables Reference

### Backend

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` or `postgres` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `restaurant_pos` |
| `DB_USER` | Database user | `pos_user` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `PORT` | Backend port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `JWT_SECRET` | JWT signing key | `min_32_chars_secret` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `LOG_LEVEL` | Logging level | `info`, `debug`, `error` |

### Frontend

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | App display name | `Restaurant POS` |

---

## Next Steps

1. **Explore the API Documentation**
   - Each backend has a README with API endpoints
   - Use Postman or curl to test endpoints

2. **Customize for Your Needs**
   - Modify database schemas as needed
   - Add custom business logic in services
   - Customize frontend UI/UX

3. **Add More Features**
   - Integrate payment gateways (Razorpay, Paytm)
   - Add SMS/Email notifications
   - Implement reports and analytics
   - Add mobile app support

4. **Deploy to Production**
   - Use Docker Compose for small deployments
   - Use Kubernetes for enterprise scale
   - Setup SSL certificates
   - Configure backups

---

## Support

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review solution-specific README files
3. Check backend logs: `docker-compose logs backend`
4. Review database logs: `docker-compose logs postgres`

---

**Happy Deploying! 🚀**
