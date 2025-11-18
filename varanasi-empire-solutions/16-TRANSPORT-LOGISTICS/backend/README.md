# Transport & Logistics Management System - Backend API

Complete production-ready backend API for managing transport companies, fleet operations, GPS tracking, shipments, and logistics operations.

## Features

- **Company Management**: Multi-company transport operations
- **Fleet Management**: Vehicle tracking, maintenance, fuel management
- **Driver Management**: Driver profiles, license tracking, performance
- **Customer Management**: Client relationships and credit management
- **Consignment Tracking**: End-to-end shipment tracking with status updates
- **Trip Management**: Route planning, GPS integration, real-time tracking
- **Route Optimization**: Efficient route planning and management
- **Warehouse Management**: Multi-location inventory and dispatch
- **Expense Tracking**: Fuel, maintenance, toll, and operational expenses
- **Reporting & Analytics**: Fleet utilization, profitability, driver performance

## Technology Stack

- Node.js 20+ | Express.js | PostgreSQL 14+ | JWT | Swagger | Winston | node-cron

## Installation

```bash
cd /home/user/test/varanasi-empire-solutions/16-TRANSPORT-LOGISTICS/backend
npm install
cp .env.example .env
# Configure database and settings
npm run dev
```

## API Documentation

http://localhost:5016/api-docs

## API Endpoints

### Companies
- POST /api/v1/companies - Create company
- GET /api/v1/companies - List companies
- GET /api/v1/companies/:id - Get company
- PUT /api/v1/companies/:id - Update company
- DELETE /api/v1/companies/:id - Delete company

### Vehicles
- POST /api/v1/vehicles - Register vehicle
- GET /api/v1/vehicles - List fleet
- GET /api/v1/vehicles/:id - Vehicle details
- PUT /api/v1/vehicles/:id - Update vehicle
- DELETE /api/v1/vehicles/:id - Remove vehicle

### Drivers
- POST /api/v1/drivers - Add driver
- GET /api/v1/drivers - List drivers
- GET /api/v1/drivers/:id - Driver profile
- PUT /api/v1/drivers/:id - Update driver
- DELETE /api/v1/drivers/:id - Remove driver

### Customers
- POST /api/v1/customers - Create customer
- GET /api/v1/customers - List customers
- GET /api/v1/customers/:id - Customer details
- PUT /api/v1/customers/:id - Update customer

### Consignments
- POST /api/v1/consignments - Create consignment
- GET /api/v1/consignments - List shipments
- GET /api/v1/consignments/:id - Track shipment
- PUT /api/v1/consignments/:id - Update consignment

### Trips
- POST /api/v1/trips - Create trip
- GET /api/v1/trips - List trips
- GET /api/v1/trips/:id - Trip details
- PUT /api/v1/trips/:id - Update trip

### Routes, Warehouses, Expenses, Reports
- Similar CRUD operations for each module

## Architecture

```
src/
├── config/          # Database, logger, CORS, swagger
├── controllers/     # HTTP request handlers
├── services/        # Business logic
├── repositories/    # Database operations
├── routes/          # API routes
├── middleware/      # Auth, validation, errors
├── utils/           # Helpers and utilities
├── jobs/            # Scheduled tasks
└── server.js        # Application entry
```

## Scheduled Jobs

- Every minute: GPS tracking updates
- Daily 8 AM: Vehicle maintenance checks
- Daily 11 PM: Daily trip reports
- Weekly: Performance analytics

## Security

- JWT authentication
- Role-based access control
- Rate limiting
- Input validation
- SQL injection prevention

## Environment Variables

See `.env.example` for configuration options.

## License

PROPRIETARY - Varanasi Empire Solutions © 2024
