# Real Estate Management System - Backend API

Complete production-ready backend for Real Estate Management with UP RERA compliance.

## Features

- **Property Management**: Complete property listing, search, and management system
- **Agent & Customer CRM**: Track agents, customers, leads, and interactions
- **Enquiry Management**: Lead tracking with automated follow-up reminders
- **Site Visit Scheduling**: Schedule and track property visits
- **Deal Management**: Complete deal lifecycle from enquiry to closure
- **Commission Tracking**: Automated commission calculation and tracking
- **UP RERA Compliance**: Built-in RERA registration and compliance checks
- **Document Management**: Secure document storage and management
- **Reports & Analytics**: Comprehensive reports and dashboards
- **Multi-tenancy**: Support for multiple agencies

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Caching**: Redis (optional)
- **File Storage**: AWS S3 / Local

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js
│   │   ├── logger.js
│   │   ├── cors.js
│   │   ├── rateLimiter.js
│   │   └── swagger.js
│   ├── controllers/     # Request handlers
│   │   ├── agency.controller.js
│   │   ├── agent.controller.js
│   │   ├── property.controller.js
│   │   ├── owner.controller.js
│   │   ├── customer.controller.js
│   │   ├── enquiry.controller.js
│   │   ├── visit.controller.js
│   │   ├── deal.controller.js
│   │   ├── commission.controller.js
│   │   └── report.controller.js
│   ├── services/        # Business logic
│   │   ├── property.service.js
│   │   └── (others...)
│   ├── repositories/    # Database access
│   │   ├── property.repository.js
│   │   └── (others...)
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   ├── property.routes.js
│   │   └── (others...)
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── notFoundHandler.js
│   │   └── validate.js
│   ├── utils/           # Utility functions
│   │   ├── asyncHandler.js
│   │   ├── errors.js
│   │   ├── jwt.js
│   │   └── password.js
│   ├── jobs/            # Scheduled tasks
│   │   └── index.js
│   └── server.js        # Entry point
├── logs/                # Application logs
├── uploads/             # Uploaded files
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   cd /home/user/test/varanasi-empire-solutions/06-REAL-ESTATE-MANAGEMENT/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**
   ```bash
   # Create PostgreSQL database
   createdb real_estate_db

   # Run migrations (if available)
   npm run migrate
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Documentation

Once the server is running, access the API documentation at:
- **Swagger UI**: http://localhost:5006/api-docs
- **Health Check**: http://localhost:5006/health
- **Base URL**: http://localhost:5006/api/v1

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Properties
- `GET /api/v1/properties` - List all properties (with filters)
- `GET /api/v1/properties/:id` - Get property details
- `POST /api/v1/properties` - Create new property
- `PUT /api/v1/properties/:id` - Update property
- `DELETE /api/v1/properties/:id` - Delete property
- `PATCH /api/v1/properties/:id/status` - Update property status
- `GET /api/v1/properties/search` - Search properties by location
- `GET /api/v1/properties/featured` - Get featured properties

### Enquiries
- `GET /api/v1/enquiries` - List all enquiries
- `POST /api/v1/enquiries` - Create new enquiry
- `PATCH /api/v1/enquiries/:id/status` - Update enquiry status

### Site Visits
- `GET /api/v1/visits` - List all site visits
- `POST /api/v1/visits` - Schedule site visit

### Deals
- `GET /api/v1/deals` - List all deals
- `POST /api/v1/deals` - Create new deal

### Commissions
- `GET /api/v1/commissions` - List all commissions
- `GET /api/v1/commissions/agent/:agentId` - Get agent commissions

### Reports
- `GET /api/v1/reports/dashboard` - Get dashboard statistics

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `PORT` - Server port (default: 5006)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database configuration
- `JWT_SECRET` - JWT secret key
- `RERA_REGISTRATION_NUMBER` - Agency RERA registration
- `AWS_*` - AWS S3 configuration for document storage

## Scheduled Jobs

- **Follow-up Reminders**: Daily at 9 AM - Send reminders for pending follow-ups
- **RERA Expiry Check**: Daily at 8 AM - Check RERA registration expiry
- **Daily Reports**: Daily at 11:59 PM - Generate daily analytics
- **Data Cleanup**: Weekly on Sunday at 2 AM - Clean old logs

## RERA Compliance Features

1. **RERA Registration Validation**: Validates RERA IDs for properties and agents
2. **Expiry Notifications**: Automated alerts for RERA registration expiry
3. **Compliance Reports**: Track RERA compliance status
4. **Document Management**: Secure storage for RERA certificates

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Production Deployment

1. Set `NODE_ENV=production` in .env
2. Configure production database
3. Set up proper JWT secrets
4. Configure AWS S3 for file storage
5. Set up SSL/TLS certificates
6. Configure reverse proxy (nginx)
7. Set up monitoring and logging

## Performance Optimization

- Database connection pooling
- Response compression
- Redis caching (optional)
- Query optimization with indexes
- Rate limiting to prevent abuse

## Support

For support and questions:
- Email: support@varanasi-empire.com
- Documentation: /api-docs

## License

PROPRIETARY - Varanasi Empire Solutions

---

**Version**: 1.0.0
**Last Updated**: 2025-11-18
