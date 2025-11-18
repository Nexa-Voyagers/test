# Hotel & Hospitality Management System - Backend API

Complete production-ready backend API for a comprehensive hotel management system with support for multi-location properties, advanced room management, booking workflow, housekeeping automation, and financial reporting with GST compliance.

## Features

### Core Modules

1. **Authentication & Authorization**
   - User registration and login
   - JWT-based token authentication
   - Role-based access control (Admin, Manager, Staff)
   - Password management

2. **Property Management**
   - Multi-property support
   - Property settings and configuration
   - Hotel groups and centralized management
   - Property statistics and dashboards

3. **Room Management**
   - Room categorization (Deluxe, Suite, Presidential, etc.)
   - Room inventory and availability checking
   - Room status tracking (Available, Occupied, Cleaning, Maintenance, Blocked)
   - Housekeeping status management

4. **Booking & Reservations**
   - Create, read, update, cancel bookings
   - Real-time availability checking
   - Automatic pricing calculation with GST
   - Check-in/check-out workflow
   - Booking status tracking (Confirmed, Checked-in, Checked-out, Cancelled)

5. **Guest Management**
   - Guest profiles with comprehensive CRM data
   - Guest preferences and history
   - VIP guest tracking
   - Loyalty program integration
   - Guest communications preferences

6. **Housekeeping Management**
   - Room cleaning task assignment
   - Housekeeping workflow automation
   - Room inspection and approval
   - Staff task management
   - Housekeeping statistics

7. **Billing & Invoicing**
   - Invoice generation
   - GST (18%) tax calculation and itemization
   - Multiple payment status tracking
   - Revenue reporting

8. **Reporting & Analytics**
   - Occupancy reports
   - Revenue analysis
   - RevPAR (Revenue Per Available Room) calculation
   - ADR (Average Daily Rate) metrics
   - Guest statistics and segmentation
   - Channel analysis for OTA bookings

9. **Scheduled Jobs**
   - Checkout reminders
   - Housekeeping task automation
   - Daily revenue reports
   - Arrival notifications
   - Loyalty point processing

## Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL 12+
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Logging**: Winston
- **API Documentation**: Swagger/OpenAPI
- **Rate Limiting**: express-rate-limit
- **Task Scheduling**: node-cron
- **Security**: Helmet

## Installation

### Prerequisites

- Node.js 20.0.0 or higher
- npm 10.0.0 or higher
- PostgreSQL 12 or higher

### Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create database
createdb hotel_management

# Run migrations (if applicable)
npm run migrate
```

4. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Documentation

Access the interactive API documentation at `http://localhost:5000/api-docs`

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new staff member
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/change-password` - Change password

#### Hotels/Properties
- `GET /api/v1/hotels` - List all properties
- `POST /api/v1/hotels` - Create property
- `GET /api/v1/hotels/:id` - Get property details
- `GET /api/v1/hotels/:id/stats` - Get property statistics

#### Rooms
- `GET /api/v1/rooms` - List rooms
- `POST /api/v1/rooms` - Create room
- `GET /api/v1/properties/:propertyId/room-status` - Get room status summary
- `POST /api/v1/rooms/availability/check` - Check availability

#### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings/:id` - Get booking details
- `POST /api/v1/bookings/:id/check-in` - Check-in guest
- `POST /api/v1/bookings/:id/check-out` - Check-out guest
- `POST /api/v1/bookings/:id/cancel` - Cancel booking
- `GET /api/v1/properties/:propertyId/arrivals` - Get upcoming arrivals

#### Guests
- `POST /api/v1/guests` - Create guest
- `GET /api/v1/guests/:id` - Get guest profile
- `GET /api/v1/guests/search` - Search guests
- `POST /api/v1/guests/:id/award-points` - Award loyalty points

#### Housekeeping
- `GET /api/v1/properties/:propertyId/housekeeping/dirty-rooms` - Get rooms needing cleaning
- `POST /api/v1/rooms/:id/cleaning/start` - Start room cleaning
- `POST /api/v1/rooms/:id/cleaning/complete` - Complete cleaning
- `POST /api/v1/rooms/:id/inspect` - Inspect room

#### Invoicing
- `POST /api/v1/invoices` - Create invoice
- `GET /api/v1/invoices/:id` - Get invoice
- `POST /api/v1/invoices/:id/payment` - Record payment
- `GET /api/v1/properties/:propertyId/gst-report` - Get GST report

#### Reports
- `GET /api/v1/reports/occupancy` - Occupancy report
- `GET /api/v1/reports/revenue` - Revenue report
- `GET /api/v1/reports/revpar` - RevPAR metrics
- `GET /api/v1/reports/guests` - Guest statistics

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # PostgreSQL connection
│   │   ├── logger.js        # Winston logging
│   │   ├── cors.js          # CORS configuration
│   │   ├── rateLimiter.js   # Rate limiting
│   │   └── swagger.js       # API documentation
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── errorHandler.js  # Global error handling
│   │   ├── notFoundHandler.js # 404 handler
│   │   └── validate.js      # Input validation
│   ├── controllers/         # Route handlers
│   ├── services/            # Business logic
│   ├── repositories/        # Database queries
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── jobs/                # Scheduled tasks
│   └── server.js            # Application entry point
├── logs/                    # Application logs
├── uploads/                 # File uploads
├── package.json
├── .env.example
└── README.md
```

## Database Schema

The system uses PostgreSQL with extensive schema including:

- **Properties** - Multi-location hotel management
- **Rooms** - Room inventory with categories
- **RoomCategories** - Room types and pricing
- **Reservations** - Booking and reservation management
- **Guests** - Guest CRM and profiles
- **Users** - Staff and role management
- **Invoices** - Billing with GST
- **HousekeepingTasks** - Cleaning workflow
- **Channels** - OTA integration ready
- And 40+ more tables for complete hotel operations

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get access token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Tokens expire** after 24 hours (configurable)
4. **Refresh tokens** available for 7 days

Example:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:5000/api/v1/hotels
```

## Error Handling

All errors return consistent JSON responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Bookings**: 20 requests per 15 minutes

## Logging

Logs are stored in `/logs` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

Log levels: `error`, `warn`, `info`, `debug`

## Environment Variables

Key environment variables:

```
NODE_ENV=development
PORT=5000
API_VERSION=v1

DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_management
DB_USER=postgres
DB_PASSWORD=password

JWT_SECRET=your-secret-key
JWT_EXPIRY=24h

GST_RATE=18
```

See `.env.example` for complete list.

## GST Compliance

The system implements 18% GST (Goods and Services Tax) for Indian compliance:

- **CGST** (Central GST): 9%
- **SGST** (State GST): 9%
- Automatically calculated on all invoices
- Itemized GST reporting

Example calculation:
```
Room Total:      ₹10,000
GST (18%):       ₹1,800 (CGST: ₹900, SGST: ₹900)
Total Amount:    ₹11,800
```

## Deployment

### Docker (Recommended)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure PostgreSQL with SSL
- [ ] Set up Redis for caching (optional)
- [ ] Configure email for notifications
- [ ] Enable HTTPS
- [ ] Set up monitoring and alerting
- [ ] Configure database backups
- [ ] Review CORS settings

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run linting
npm run lint
```

## Performance Optimizations

- Database connection pooling
- Request compression
- Rate limiting
- Caching ready (Redis compatible)
- Indexed database queries
- Paginated responses

## Security Features

- Helmet.js for HTTP headers
- CORS protection
- JWT authentication
- Password hashing with bcrypt
- SQL injection prevention
- Rate limiting
- Input validation
- Error message sanitization

## Support & Documentation

- API Docs: `http://localhost:5000/api-docs`
- Health Check: `http://localhost:5000/health`
- Issues: Report via GitHub issues

## License

Proprietary - Varanasi Empire Solutions

## Author

Varanasi Empire Solutions

---

**Built with ❤️ for the hospitality industry**
