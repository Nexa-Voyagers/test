# Food Production & Distribution Management System - Backend API

Complete production-ready backend API for managing food production facilities, quality control, cold chain monitoring, and distribution operations.

## Features

- **Production Unit Management**: Multi-location production facilities with capacity tracking
- **Product Catalog**: Comprehensive product management with SKU, categories, and specifications
- **Production Batches**: Batch-level production tracking with cost analysis
- **Quality Control**: Multi-parameter quality checks with pass/fail tracking
- **Distributor Network**: Territory-based distributor management with credit limits
- **Distribution Orders**: End-to-end order lifecycle with inventory integration
- **Inventory Management**: Real-time stock tracking with reservation system
- **Cold Chain Monitoring**: Temperature and humidity tracking (IoT ready)
- **Reporting & Analytics**: Production, quality, sales, and inventory reports
- **Expiry Management**: Shelf-life tracking with automated alerts

## Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Scheduling**: node-cron

## Prerequisites

- Node.js >= 20.0.0
- PostgreSQL >= 14.0
- Redis (optional, for caching)
- npm >= 10.0.0

## Installation

1. **Clone and navigate to the directory**
   ```bash
   cd /home/user/test/varanasi-empire-solutions/15-FOOD-PRODUCTION-DISTRIBUTION/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**
   ```sql
   CREATE DATABASE food_production_db;
   -- Run migrations from database schema
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Documentation

Once the server is running, access the interactive API documentation:
- Swagger UI: http://localhost:5015/api-docs
- Health Check: http://localhost:5015/health

## API Endpoints

### Production Units
- `POST /api/v1/units` - Create production unit
- `GET /api/v1/units` - List all units
- `GET /api/v1/units/:id` - Get unit details
- `PUT /api/v1/units/:id` - Update unit
- `DELETE /api/v1/units/:id` - Delete unit
- `GET /api/v1/units/:id/stats` - Get unit statistics

### Products
- `POST /api/v1/products` - Create product
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product details
- `PUT /api/v1/products/:id` - Update product
- `GET /api/v1/products/categories` - Get categories

### Production Batches
- `POST /api/v1/production` - Create production batch
- `GET /api/v1/production` - List batches
- `GET /api/v1/production/:id` - Get batch details
- `PATCH /api/v1/production/:id/start` - Start production
- `PATCH /api/v1/production/:id/complete` - Complete production
- `PATCH /api/v1/production/:id/cancel` - Cancel batch
- `GET /api/v1/production/stats` - Production statistics

### Quality Control
- `POST /api/v1/quality` - Create quality check
- `GET /api/v1/quality` - List quality checks
- `GET /api/v1/quality/batch/:batchId` - Get checks by batch
- `PATCH /api/v1/quality/:id/approve` - Approve quality check
- `GET /api/v1/quality/stats` - Quality statistics

### Distributors
- `POST /api/v1/distributors` - Create distributor
- `GET /api/v1/distributors` - List distributors
- `GET /api/v1/distributors/:id` - Get distributor details
- `PUT /api/v1/distributors/:id` - Update distributor
- `GET /api/v1/distributors/:id/stats` - Distributor statistics

### Distribution Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/orders/:orderId/items` - Add order item
- `PATCH /api/v1/orders/:id/approve` - Approve order
- `PATCH /api/v1/orders/:id/process` - Process order
- `PATCH /api/v1/orders/:id/ship` - Ship order
- `PATCH /api/v1/orders/:id/deliver` - Mark as delivered
- `POST /api/v1/orders/:id/payment` - Record payment

### Inventory
- `GET /api/v1/inventory` - List inventory
- `GET /api/v1/inventory/low-stock` - Low stock alerts
- `GET /api/v1/inventory/value` - Inventory valuation
- `POST /api/v1/inventory/:id/add` - Add stock
- `POST /api/v1/inventory/:id/remove` - Remove stock
- `POST /api/v1/inventory/:id/transfer` - Transfer stock

### Reports
- `GET /api/v1/reports/dashboard` - Dashboard statistics
- `GET /api/v1/reports/production` - Production report
- `GET /api/v1/reports/quality` - Quality report
- `GET /api/v1/reports/sales` - Sales report
- `GET /api/v1/reports/inventory` - Inventory report
- `GET /api/v1/reports/expiry` - Expiry alert report
- `GET /api/v1/reports/distributor-performance` - Distributor performance
- `GET /api/v1/reports/product-performance` - Product performance

## Architecture

```
src/
├── config/          # Configuration files (DB, logger, cors, etc.)
├── controllers/     # Request handlers
├── services/        # Business logic layer
├── repositories/    # Database access layer
├── routes/          # API routes
├── middleware/      # Custom middleware (auth, validation, etc.)
├── utils/           # Utility functions
├── jobs/            # Scheduled jobs (cron)
└── server.js        # Application entry point
```

## Scheduled Jobs

- **Daily 9:00 AM**: Low stock inventory check
- **Daily 10:00 AM**: Expiry alert check (batches expiring in 30 days)
- **Daily 11:00 PM**: Generate daily production report
- **Weekly Sunday 2:00 AM**: Log cleanup

## Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- SQL injection prevention (parameterized queries)
- Input validation with Joi
- Password hashing with bcrypt

## Environment Variables

See `.env.example` for all configuration options including:
- Server configuration
- Database connection
- JWT secrets
- Email/SMS integration
- IoT sensor settings
- Business rules

## Error Handling

Comprehensive error handling with proper HTTP status codes:
- 400: Bad Request / Validation Error
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Logging

Winston-based logging with levels:
- `error`: Error conditions
- `warn`: Warning conditions
- `info`: Informational messages
- `http`: HTTP request logs
- `debug`: Debug messages

Logs are stored in:
- `logs/error.log`: Error logs only
- `logs/combined.log`: All logs

## Testing

```bash
npm test
```

## Development

```bash
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secrets
4. Configure email/SMS services
5. Set up SSL/TLS
6. Configure reverse proxy (nginx)
7. Set up monitoring

## Support

For issues or questions, contact: support@foodproduction.com

## License

PROPRIETARY - Varanasi Empire Solutions © 2024
