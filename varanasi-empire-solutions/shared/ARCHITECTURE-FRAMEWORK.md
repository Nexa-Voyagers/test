# SHARED ARCHITECTURE FRAMEWORK
## Standardized Implementation Patterns for All 22 Solutions

**Version:** 2.0.0
**Last Updated:** November 2025

---

## 🏗️ TECHNOLOGY STACK (Standardized Across All Solutions)

### **Backend (Node.js)**
```json
{
  "runtime": "Node.js 20 LTS",
  "framework": "Express.js 4.18+",
  "language": "JavaScript (ES6+) / TypeScript (optional)",
  "architecture": "MVC + Service Layer + Repository Pattern"
}
```

**Key Libraries:**
- **Database:** `pg` (PostgreSQL), `sequelize` (ORM), `pg-promise`
- **Authentication:** `jsonwebtoken`, `bcryptjs`, `passport.js`
- **Validation:** `joi`, `express-validator`
- **API Docs:** `swagger-ui-express`, `swagger-jsdoc`
- **File Upload:** `multer`, `sharp` (image processing)
- **Email:** `nodemailer`, `@sendgrid/mail`
- **SMS/WhatsApp:** `twilio`, `axios` (for API calls)
- **Caching:** `redis`, `node-cache`
- **Queue:** `bull` (Redis-based job queue)
- **Logging:** `winston`, `morgan`
- **Security:** `helmet`, `cors`, `express-rate-limit`
- **Testing:** `jest`, `supertest`

### **Frontend (React)**
```json
{
  "framework": "React 18.2+",
  "meta-framework": "Next.js 14 (for SSR/SSG)",
  "language": "JavaScript / TypeScript",
  "styling": "Tailwind CSS 3.3+",
  "ui-library": "Shadcn/UI (Radix UI primitives)"
}
```

**Key Libraries:**
- **State Management:** `zustand` or `redux-toolkit`
- **Data Fetching:** `tanstack-query` (React Query)
- **Forms:** `react-hook-form`, `zod` (validation)
- **Tables:** `tanstack-table` (React Table)
- **Charts:** `recharts`, `chart.js`
- **Date/Time:** `date-fns`, `dayjs`
- **Icons:** `lucide-react`, `react-icons`
- **Notifications:** `react-hot-toast`, `sonner`
- **PDF:** `react-pdf`, `jspdf`
- **Barcode/QR:** `react-qr-code`, `react-barcode`

### **Database**
```json
{
  "primary": "PostgreSQL 15+",
  "cache": "Redis 7+",
  "search": "ElasticSearch 8+ (optional)",
  "timeseries": "TimescaleDB (PostgreSQL extension)"
}
```

### **Deployment**
```json
{
  "containerization": "Docker 24+",
  "orchestration": "Kubernetes 1.28+ (for multi-tenant)",
  "reverse-proxy": "Nginx / Traefik",
  "ssl": "Let's Encrypt (Certbot)",
  "monitoring": "Prometheus + Grafana",
  "logging": "ELK Stack / Loki"
}
```

---

## 📂 STANDARDIZED PROJECT STRUCTURE

Every solution follows this structure:

```
solution-name/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/      # Route handlers
│   │   │   ├── routes/           # Express routes
│   │   │   ├── middlewares/      # Auth, validation, error handling
│   │   │   └── validators/       # Joi/Zod schemas
│   │   ├── services/             # Business logic
│   │   ├── repositories/         # Database queries
│   │   ├── models/               # Sequelize models (or raw queries)
│   │   ├── utils/                # Helpers, constants
│   │   ├── config/               # Configuration files
│   │   ├── jobs/                 # Background jobs (Bull)
│   │   └── integrations/         # Third-party APIs
│   ├── tests/                    # Jest tests
│   ├── package.json
│   ├── .env.example
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/                  # Next.js app directory
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn components
│   │   │   ├── shared/          # Reusable components
│   │   │   └── [feature]/       # Feature-specific components
│   │   ├── lib/                 # Utilities, API client
│   │   ├── hooks/               # Custom React hooks
│   │   ├── store/               # Zustand stores
│   │   ├── types/               # TypeScript types
│   │   └── styles/              # Global CSS
│   ├── public/                  # Static assets
│   ├── package.json
│   └── next.config.js
│
├── database/
│   ├── schema/
│   │   └── complete-schema.sql  # Full database schema
│   ├── migrations/              # Sequelize migrations
│   ├── seeds/                   # Demo data
│   └── README.md                # Database documentation
│
├── deployment/
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.frontend
│   │   └── docker-compose.yml
│   ├── kubernetes/
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── postgres-statefulset.yaml
│   │   └── ingress.yaml
│   └── nginx/
│       └── nginx.conf
│
├── demo/
│   ├── client-scenario.md       # Demo scenario description
│   ├── demo-data.sql            # Client-specific demo data
│   └── screenshots/             # UI screenshots
│
└── README.md                    # Solution documentation
```

---

## 🔧 BACKEND ARCHITECTURE PATTERNS

### **1. MVC + Service Layer Pattern**

```javascript
// Route → Controller → Service → Repository → Database

// routes/customer.routes.js
router.get('/:id', authenticate, getCustomer);
router.post('/', authenticate, validate(createCustomerSchema), createCustomer);

// controllers/customer.controller.js
const getCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.getById(req.params.id);
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// services/customer.service.js
class CustomerService {
  async getById(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) throw new NotFoundError('Customer not found');
    return customer;
  }
}

// repositories/customer.repository.js
class CustomerRepository {
  async findById(id) {
    return await db.query('SELECT * FROM customers WHERE id = $1', [id]);
  }
}
```

### **2. Standardized Response Format**

```javascript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}

// Paginated Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### **3. Error Handling**

```javascript
// Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = []) {
    super(message, 400);
    this.details = details;
  }
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.name,
      message: message,
      ...(err.details && { details: err.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
```

### **4. Authentication & Authorization**

```javascript
// JWT-based authentication
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedError('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userRepository.findById(decoded.userId);
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  };
};

// Usage
router.post('/admin/users', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), createUser);
```

### **5. Database Connection Pool**

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
```

---

## 🎨 FRONTEND ARCHITECTURE PATTERNS

### **1. Component Structure**

```
components/
├── ui/                    # Shadcn/UI primitives (Button, Input, etc.)
├── shared/
│   ├── Layout.jsx        # App layout wrapper
│   ├── Navbar.jsx        # Navigation
│   ├── Sidebar.jsx       # Sidebar navigation
│   ├── DataTable.jsx     # Reusable data table
│   ├── SearchBar.jsx     # Search component
│   └── Pagination.jsx    # Pagination component
└── [feature]/
    ├── [Feature]List.jsx
    ├── [Feature]Form.jsx
    ├── [Feature]Detail.jsx
    └── [Feature]Card.jsx
```

### **2. API Client (Axios)**

```javascript
// lib/api-client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
```

### **3. React Query Setup**

```javascript
// lib/react-query.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Usage in component
import { useQuery, useMutation } from '@tanstack/react-query';

function CustomerList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: () => apiClient.get('/customers'),
  });

  const createMutation = useMutation({
    mutationFn: (customer) => apiClient.post('/customers', customer),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
    },
  });

  // ... component logic
}
```

### **4. Form Handling (React Hook Form + Zod)**

```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
});

function CustomerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} error={errors.name?.message} />
      <Input {...register('email')} error={errors.email?.message} />
      <Input {...register('phone')} error={errors.phone?.message} />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## 🐳 DOCKER DEPLOYMENT

### **Standard docker-compose.yml** (For All Solutions)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: ${APP_NAME}_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema:/docker-entrypoint-initdb.d
    ports:
      - "${DB_PORT:-5432}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: ${APP_NAME}_redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ${APP_NAME}_backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "${BACKEND_PORT:-5000}:5000"
    volumes:
      - ./backend:/app
      - /app/node_modules
      - uploads:/app/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ${APP_NAME}_frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: ${API_URL}
    ports:
      - "${FRONTEND_PORT:-3000}:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next

  nginx:
    image: nginx:alpine
    container_name: ${APP_NAME}_nginx
    restart: unless-stopped
    depends_on:
      - backend
      - frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deployment/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./deployment/nginx/ssl:/etc/nginx/ssl:ro
      - uploads:/var/www/uploads:ro

volumes:
  postgres_data:
  redis_data:
  uploads:
```

---

## ☸️ KUBERNETES DEPLOYMENT

### **Backend Deployment**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: ${REGISTRY}/backend:${VERSION}
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: db_host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db_password
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 5000
    targetPort: 5000
  type: ClusterIP
```

---

## 📊 DATABASE PATTERNS

### **Standard Table Patterns**

Every solution has these base tables:

```sql
-- Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 INTEGRATION PATTERNS

### **Payment Gateway Integration**

```javascript
// integrations/razorpay.js
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class RazorpayService {
  async createOrder(amount, currency = 'INR', notes = {}) {
    return await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      notes,
    });
  }

  async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === razorpaySignature;
  }
}
```

### **WhatsApp Integration**

```javascript
// integrations/whatsapp.js
const twilio = require('twilio');

class WhatsAppService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendMessage(to, message) {
    return await this.client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
      body: message,
    });
  }

  async sendTemplate(to, templateName, variables) {
    // Template message logic
  }
}
```

---

## 🧪 TESTING PATTERNS

```javascript
// tests/customer.test.js
const request = require('supertest');
const app = require('../server');

describe('Customer API', () => {
  let authToken;

  beforeAll(async () => {
    // Login and get token
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    authToken = response.body.token;
  });

  describe('GET /api/customers', () => {
    it('should return list of customers', async () => {
      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
      const customer = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customer);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
    });
  });
});
```

---

## 📝 DOCUMENTATION STANDARDS

Every solution includes:

1. **API Documentation** (Swagger/OpenAPI)
2. **Database Schema Documentation** (with ER diagrams)
3. **Setup Guide** (README.md)
4. **Deployment Guide**
5. **User Manual** (English + Hindi)
6. **Admin Manual**
7. **Developer Guide**

---

This architecture framework ensures consistency, maintainability, and scalability across all 22 solutions!

**Next:** I'll build complete implementations using these patterns for all solutions.
