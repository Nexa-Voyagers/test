# Varanasi Empire - Backend Starter Template

Production-ready Node.js/Express backend template for all 22 Varanasi Empire business solutions.

## Features

- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL** - Reliable relational database with advanced features
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Fine-grained permissions
- **API Documentation** - Auto-generated Swagger/OpenAPI docs
- **Error Handling** - Comprehensive error handling middleware
- **Logging** - Winston logger with file rotation
- **Validation** - Joi schema validation
- **Rate Limiting** - Protection against abuse
- **CORS** - Cross-origin resource sharing
- **Security** - Helmet.js security headers

## Quick Start

### Prerequisites

- Node.js 20 LTS or higher
- PostgreSQL 15+ installed and running
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Create database
createdb your_database_name

# Run database schema
psql your_database_name < database/schema.sql

# Start development server
npm run dev
```

### Production Deployment

```bash
# Build for production (if using TypeScript)
npm run build

# Start production server
npm start
```

## Project Structure

```
shared/backend-starter/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # PostgreSQL connection
│   │   ├── cors.js      # CORS settings
│   │   ├── logger.js    # Winston logger
│   │   ├── rateLimiter.js
│   │   └── swagger.js   # API documentation
│   │
│   ├── controllers/     # Route controllers
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # JWT verification
│   │   ├── validate.js  # Joi validation
│   │   ├── errorHandler.js
│   │   └── notFoundHandler.js
│   │
│   ├── repositories/    # Database layer
│   │   └── user.repository.js
│   │
│   ├── routes/          # Route definitions
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── health.routes.js
│   │
│   ├── services/        # Business logic
│   │   ├── auth.service.js
│   │   └── user.service.js
│   │
│   ├── utils/           # Utility functions
│   │   ├── errors.js    # Custom error classes
│   │   ├── jwt.js       # JWT helpers
│   │   ├── password.js  # Password hashing
│   │   └── asyncHandler.js
│   │
│   ├── validators/      # Joi schemas
│   │   ├── auth.validator.js
│   │   └── user.validator.js
│   │
│   └── server.js        # Application entry point
│
├── database/
│   └── schema.sql       # Database schema
│
├── logs/                # Log files (auto-generated)
├── .env.example         # Environment template
├── package.json
└── README.md
```

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/refresh` | Refresh token | No |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No |
| POST | `/api/v1/auth/reset-password` | Reset password | No |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users/profile` | Get current user | Yes |
| PUT | `/api/v1/users/profile` | Update current user | Yes |
| GET | `/api/v1/users` | Get all users | Admin |
| GET | `/api/v1/users/:id` | Get user by ID | Admin |
| PUT | `/api/v1/users/:id` | Update user | Admin |
| DELETE | `/api/v1/users/:id` | Delete user | Admin |

### Health

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check | No |
| GET | `/health/ready` | Readiness probe | No |
| GET | `/health/live` | Liveness probe | No |

## API Documentation

Once the server is running, visit:

```
http://localhost:5000/api-docs
```

Interactive Swagger UI documentation with request/response examples.

## Testing API

### Register User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass@123",
    "full_name": "John Doe",
    "phone": "9876543210"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass@123"
  }'
```

### Get Profile (with token)

```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Database Schema

The starter includes a basic users table with:

- UUID primary keys
- Email/password authentication
- Role-based access control
- Soft delete capability
- Automatic timestamps
- Full-text search support

## Adding New Features

### 1. Create Database Schema

```sql
-- database/your_table.sql
CREATE TABLE your_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- your fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);
```

### 2. Create Repository

```javascript
// src/repositories/your.repository.js
import { query } from '../config/database.js';

export const yourRepository = {
  findAll: async () => { /* ... */ },
  findById: async (id) => { /* ... */ },
  create: async (data) => { /* ... */ },
  update: async (id, data) => { /* ... */ },
  delete: async (id) => { /* ... */ },
};
```

### 3. Create Service

```javascript
// src/services/your.service.js
import { yourRepository } from '../repositories/your.repository.js';

export const yourService = {
  getAll: async () => { /* business logic */ },
  // ... other methods
};
```

### 4. Create Controller

```javascript
// src/controllers/your.controller.js
import { yourService } from '../services/your.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const yourController = {
  getAll: asyncHandler(async (req, res) => { /* ... */ }),
  // ... other methods
};
```

### 5. Create Routes

```javascript
// src/routes/your.routes.js
import express from 'express';
import { yourController } from '../controllers/your.controller.js';

const router = express.Router();

router.get('/', yourController.getAll);
// ... other routes

export default router;
```

### 6. Register Routes

```javascript
// src/server.js
import yourRoutes from './routes/your.routes.js';

apiRouter.use('/your-resource', authMiddleware, yourRoutes);
```

## Security Best Practices

1. **Environment Variables** - Never commit .env file
2. **Password Hashing** - Uses bcrypt with configurable rounds
3. **JWT Secrets** - Use strong, random secrets in production
4. **Rate Limiting** - Configured to prevent abuse
5. **CORS** - Whitelist specific origins in production
6. **Helmet** - Security headers enabled
7. **SQL Injection** - Parameterized queries throughout
8. **Input Validation** - Joi schemas for all inputs

## Error Handling

All errors are caught and handled by the global error handler:

```javascript
import { AppError, NotFoundError, ValidationError } from './utils/errors.js';

// Throw custom errors
throw new NotFoundError('User');
throw new ValidationError([{ field: 'email', message: 'Invalid email' }]);
throw new AppError('Custom error', 400);
```

## Logging

Winston logger with multiple transports:

```javascript
import { logger } from './config/logger.js';

logger.info('Info message');
logger.error('Error message', { error });
logger.debug('Debug message', { data });
```

Logs are saved to:
- `logs/error.log` - Errors only
- `logs/combined.log` - All logs

## Deployment

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### Kubernetes

See deployment configurations in shared/deployment/kubernetes/

## Support

For issues or questions about this template:
- Email: dev@varanasi-empire.com
- Documentation: /api-docs

## License

Proprietary - Varanasi Empire Solutions

---

**Built for Varanasi Empire Solutions Ecosystem**
