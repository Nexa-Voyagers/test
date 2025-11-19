# Testing Guide - Varanasi Empire Solutions

This guide provides step-by-step testing instructions for all 22 solutions.

---

## Pre-Testing Checklist

### ✅ Verified Components

**All 22 Solutions Include:**
- ✅ Complete database schemas (`database/complete-schema.sql`)
- ✅ Demo data with 50+ records (`database/demo-data.sql`)
- ✅ Backend APIs with MVC architecture
- ✅ Deployment configurations (Docker + Kubernetes)

**Environment Verified:**
- ✅ Node.js: v22.21.1
- ✅ npm: 10.9.4
- ✅ PostgreSQL: 16.10
- ✅ All source files committed and pushed

---

## Quick Test: Restaurant POS (Solution 03)

### Test 1: Verify Backend Structure

```bash
cd /home/user/test/varanasi-empire-solutions/03-RESTAURANT-POS-MANAGEMENT/backend

# Check all required directories exist
ls -la src/controllers/  # Should show 8 controllers
ls -la src/services/     # Should show 8 services
ls -la src/repositories/ # Should show 6 repositories
ls -la src/routes/       # Should show route files
```

**Expected Structure:**
```
backend/src/
├── config/
│   └── database.js
├── controllers/
│   ├── auth.controller.js
│   ├── restaurant.controller.js
│   ├── menu-item.controller.js
│   ├── order.controller.js
│   ├── table.controller.js
│   ├── inventory.controller.js
│   ├── staff.controller.js
│   └── report.controller.js
├── services/
│   ├── auth.service.js
│   ├── restaurant.service.js
│   ├── menu.service.js
│   ├── order.service.js
│   ├── table.service.js
│   ├── inventory.service.js
│   ├── staff.service.js
│   └── report.service.js
├── repositories/
│   ├── restaurant.repository.js
│   ├── menu.repository.js
│   ├── order.repository.js
│   ├── table.repository.js
│   ├── inventory.repository.js
│   └── staff.repository.js
├── routes/
│   ├── index.js
│   ├── auth.routes.js
│   ├── restaurant.routes.js
│   └── ...
├── middleware/
│   ├── auth.middleware.js
│   ├── errorHandler.js
│   └── validate.js
├── utils/
│   ├── asyncHandler.js
│   ├── errors.js
│   └── jwt.js
└── server.js
```

### Test 2: Verify Database Schema

```bash
cd /home/user/test/varanasi-empire-solutions/03-RESTAURANT-POS-MANAGEMENT

# Count lines in schema
wc -l database/complete-schema.sql

# Count lines in demo data
wc -l database/demo-data.sql

# Check for required tables
grep "CREATE TABLE" database/complete-schema.sql
```

**Expected Tables:**
- restaurants
- menu_categories
- menu_items
- tables
- orders
- order_items
- inventory_items
- staff
- payments
- customers

### Test 3: Verify Dependencies

```bash
cd backend

# Check package.json exists
cat package.json | grep "name"

# List all dependencies
cat package.json | jq '.dependencies'
```

**Required Dependencies:**
- express (web framework)
- pg (PostgreSQL client)
- jsonwebtoken (JWT auth)
- joi (validation)
- winston (logging)
- helmet (security)
- cors (CORS support)

### Test 4: Install and Basic Syntax Check

```bash
cd backend

# Install dependencies (this may take 2-3 minutes)
npm install

# Check for syntax errors in server.js
node --check src/server.js

# Check for syntax errors in all controllers
for file in src/controllers/*.js; do node --check "$file"; done
```

**Expected Output:**
- No syntax errors
- All files pass validation

### Test 5: Database Setup (PostgreSQL Required)

```bash
# Start PostgreSQL (if not running)
sudo systemctl start postgresql

# Create test database
sudo -u postgres psql -c "CREATE DATABASE restaurant_pos_test;"

# Load schema
sudo -u postgres psql -d restaurant_pos_test -f database/complete-schema.sql

# Load demo data
sudo -u postgres psql -d restaurant_pos_test -f database/demo-data.sql

# Verify data loaded
sudo -u postgres psql -d restaurant_pos_test -c "SELECT COUNT(*) FROM restaurants;"
sudo -u postgres psql -d restaurant_pos_test -c "SELECT COUNT(*) FROM menu_items;"
```

**Expected Output:**
- Database created successfully
- Schema loaded without errors
- Demo data shows 2-5 restaurants
- 20+ menu items loaded

### Test 6: Backend Startup

```bash
cd backend

# Create .env file
cat > .env << 'EOF'
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_pos_test
DB_USER=postgres
DB_PASSWORD=postgres

# Server
NODE_ENV=development
PORT=5003

# JWT (generate a random secret)
JWT_SECRET=test_secret_min_32_characters_long_for_security
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
EOF

# Start backend (in background)
npm run dev &
BACKEND_PID=$!

# Wait for startup
sleep 5

# Test health endpoint
curl http://localhost:5003/api/health

# Test API endpoint (should require auth)
curl http://localhost:5003/api/v1/restaurants

# Stop backend
kill $BACKEND_PID
```

**Expected Output:**
```json
{
  "status": "healthy",
  "timestamp": "2024-11-19T...",
  "uptime": 5.123
}
```

### Test 7: API Authentication

```bash
# Start backend (if not running)
cd backend
npm run dev &
BACKEND_PID=$!
sleep 5

# Test login (using demo data credentials)
curl -X POST http://localhost:5003/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "admin123"
  }'

# Should return JWT token
# Save token for next requests

TOKEN="<paste_token_here>"

# Test authenticated endpoint
curl http://localhost:5003/api/v1/restaurants \
  -H "Authorization: Bearer $TOKEN"

# Stop backend
kill $BACKEND_PID
```

**Expected Output:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "admin@restaurant.com",
    "role": "admin"
  }
}
```

### Test 8: Frontend (if available)

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5003/api/v1" > .env.local

# Build frontend (check for errors)
npm run build

# Start frontend
npm run dev &
FRONTEND_PID=$!
sleep 10

# Test frontend accessible
curl -I http://localhost:3000

# Stop frontend
kill $FRONTEND_PID
```

**Expected Output:**
- Build completes without errors
- Frontend accessible on port 3000
- Pages render correctly

---

## Testing Other Solutions

### Backend-Only Solutions (20 solutions)

For solutions without frontends, test the backend API:

```bash
# Example: Testing Saree & Textile Store (Solution 09)
cd /home/user/test/varanasi-empire-solutions/09-SAREE-TEXTILE-STORE

# 1. Verify backend structure
ls backend/src/controllers/  # Should show 9 controllers
ls backend/src/services/     # Should show 9 services
ls backend/src/repositories/ # Should show 9 repositories

# 2. Create database
sudo -u postgres psql -c "CREATE DATABASE saree_textile_test;"

# 3. Load schema & data
sudo -u postgres psql -d saree_textile_test -f database/complete-schema.sql
sudo -u postgres psql -d saree_textile_test -f database/demo-data.sql

# 4. Setup backend
cd backend
npm install

# 5. Create .env
cat > .env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saree_textile_test
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5009
JWT_SECRET=test_secret_min_32_chars_for_saree_textile_store
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
EOF

# 6. Start backend
npm run dev &
sleep 5

# 7. Test health
curl http://localhost:5009/api/health

# 8. Test API endpoints
curl http://localhost:5009/api/v1/stores
curl http://localhost:5009/api/v1/products
curl http://localhost:5009/api/v1/weavers

# 9. Cleanup
kill %1
```

---

## Docker Testing

### Test with Docker Compose

```bash
cd /home/user/test/varanasi-empire-solutions/03-RESTAURANT-POS-MANAGEMENT

# Create docker-compose.yml (see SETUP_GUIDE.md for full file)

# Build images
docker-compose build

# Start services
docker-compose up -d

# Wait for services to be ready
sleep 30

# Check service status
docker-compose ps

# Test backend
curl http://localhost:5000/api/health

# Test frontend (if available)
curl -I http://localhost:3000

# View logs
docker-compose logs backend
docker-compose logs postgres

# Stop services
docker-compose down
```

---

## Automated Testing Script

```bash
#!/bin/bash

# Test all 22 backend structures
for i in {1..22}; do
    SOLUTION_DIR=$(find . -maxdepth 1 -type d -name "*-*" | sort | sed -n "${i}p")

    if [ -d "$SOLUTION_DIR/backend" ]; then
        echo "Testing: $SOLUTION_DIR"

        # Count files
        CONTROLLERS=$(ls "$SOLUTION_DIR/backend/src/controllers/" 2>/dev/null | wc -l)
        SERVICES=$(ls "$SOLUTION_DIR/backend/src/services/" 2>/dev/null | wc -l)
        REPOS=$(ls "$SOLUTION_DIR/backend/src/repositories/" 2>/dev/null | wc -l)

        echo "  Controllers: $CONTROLLERS"
        echo "  Services: $SERVICES"
        echo "  Repositories: $REPOS"

        # Check syntax
        if [ -f "$SOLUTION_DIR/backend/src/server.js" ]; then
            if node --check "$SOLUTION_DIR/backend/src/server.js" 2>/dev/null; then
                echo "  ✓ Syntax OK"
            else
                echo "  ✗ Syntax Error in server.js"
            fi
        fi

        echo ""
    fi
done
```

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test backend health endpoint
ab -n 1000 -c 10 http://localhost:5003/api/health

# Test authenticated endpoint (with token)
ab -n 100 -c 5 -H "Authorization: Bearer <token>" http://localhost:5003/api/v1/restaurants
```

### Database Performance

```bash
# Test query performance
sudo -u postgres psql -d restaurant_pos_test << 'EOF'
EXPLAIN ANALYZE SELECT * FROM restaurants;
EXPLAIN ANALYZE SELECT * FROM menu_items WHERE category_id = '...';
EXPLAIN ANALYZE SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '7 days';
EOF
```

---

## Common Test Scenarios

### Scenario 1: New Restaurant Setup

```bash
# 1. Register restaurant
curl -X POST http://localhost:5003/api/v1/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Restaurant",
    "gstin": "09AAAAA0000A1Z5",
    "address": "123 Test Street, Varanasi",
    "phone": "9876543210"
  }'

# 2. Add menu categories
curl -X POST http://localhost:5003/api/v1/menu-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Appetizers", "display_order": 1}'

# 3. Add menu items
curl -X POST http://localhost:5003/api/v1/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Samosa",
    "price": 50,
    "category_id": "<category_id_from_step_2>"
  }'

# 4. Create order
curl -X POST http://localhost:5003/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "table_number": 5,
    "items": [
      {"menu_item_id": "<item_id>", "quantity": 2}
    ]
  }'
```

### Scenario 2: Inventory Management

```bash
# Check stock levels
curl http://localhost:5003/api/v1/inventory \
  -H "Authorization: Bearer $TOKEN"

# Update stock
curl -X PUT http://localhost:5003/api/v1/inventory/<item_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity": 100}'

# Get low stock alerts
curl http://localhost:5003/api/v1/inventory/alerts \
  -H "Authorization: Bearer $TOKEN"
```

---

## Test Results Checklist

### Backend Tests
- [ ] All controllers exist and have valid syntax
- [ ] All services exist and have valid syntax
- [ ] All repositories exist and have valid syntax
- [ ] Routes are properly defined
- [ ] Middleware functions correctly
- [ ] Database connection successful
- [ ] Schema loads without errors
- [ ] Demo data loads successfully
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] Authentication works
- [ ] API endpoints return expected data
- [ ] Error handling works correctly
- [ ] Logging is functional

### Frontend Tests (if available)
- [ ] All pages exist
- [ ] Components render correctly
- [ ] API integration works
- [ ] Authentication flow works
- [ ] Forms validate properly
- [ ] Data displays correctly
- [ ] Navigation works
- [ ] Responsive design functions

### Database Tests
- [ ] All tables created
- [ ] Indexes are in place
- [ ] Foreign keys enforced
- [ ] Triggers function correctly
- [ ] Demo data is realistic
- [ ] Queries perform well
- [ ] Transactions work correctly

### Deployment Tests
- [ ] Docker images build successfully
- [ ] Docker containers start correctly
- [ ] Kubernetes manifests are valid
- [ ] Services are accessible
- [ ] Health checks pass
- [ ] Logs are captured
- [ ] Environment variables work

---

## Troubleshooting Test Issues

### Issue: npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Database connection fails

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check if database exists
sudo -u postgres psql -l | grep restaurant_pos

# Check credentials in .env match database
```

### Issue: Port already in use

```bash
# Find process on port
lsof -i :5003

# Kill process
kill -9 <PID>
```

### Issue: Syntax errors in code

```bash
# Check Node.js version
node --version  # Should be v18+ or v20+

# Verify file encoding
file src/server.js  # Should be UTF-8

# Check for hidden characters
cat -A src/server.js | head
```

---

## Next Steps After Testing

1. **If all tests pass:**
   - Deploy to staging environment
   - Run integration tests
   - Perform UAT (User Acceptance Testing)
   - Deploy to production

2. **If tests fail:**
   - Review error messages
   - Check configuration files
   - Verify dependencies
   - Review code for issues
   - Check database schema

3. **Performance optimization:**
   - Add database indexes
   - Implement caching
   - Optimize queries
   - Add CDN for frontend assets

---

**Happy Testing! 🧪**
