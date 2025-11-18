# Event & Wedding Planning Management System - API Documentation

## Overview

Complete, production-ready backend API for Event & Wedding Planning Management System with comprehensive features for managing events, clients, vendors, tasks, guests, and payments.

## Technology Stack

- **Framework**: Express.js
- **Database**: PostgreSQL with PostGIS and TimescaleDB extensions
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi (via express-validator)
- **Architecture**: MVC + Service + Repository Pattern

## Architecture

```
backend/
├── src/
│   ├── controllers/      # HTTP request handlers (10 controllers)
│   ├── services/         # Business logic layer (10 services)
│   ├── repositories/     # Data access layer (10 repositories)
│   ├── routes/           # API route definitions
│   ├── middleware/       # Auth, validation, error handling
│   ├── config/           # Database, logger, CORS, rate limiter
│   └── utils/            # Error classes, async handler
```

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints except `/health` and `/auth` require JWT authentication via Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Companies API

### Endpoints
- `POST /companies` - Create new event planning company
- `GET /companies` - Get all companies (with filters)
- `GET /companies/:id` - Get company by ID
- `GET /companies/:id/stats` - Get company with statistics
- `GET /companies/:id/statistics` - Get detailed statistics
- `PUT /companies/:id` - Update company
- `DELETE /companies/:id` - Soft delete company

### Query Parameters (GET /companies)
- `city` - Filter by city
- `is_active` - Filter by active status (true/false)
- `specialization` - Filter by specialization (WEDDING, CORPORATE, etc.)
- `limit` - Limit results
- `offset` - Pagination offset

---

## 2. Clients API

### Endpoints
- `POST /clients` - Create new client
- `GET /clients` - Get all clients (with filters)
- `GET /clients/search?q=term` - Search clients by name/phone
- `GET /clients/:id` - Get client by ID
- `GET /clients/:id/profile` - Get complete client profile with events
- `GET /clients/:id/events` - Get client event history
- `GET /clients/:id/statistics` - Get client statistics
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

### Query Parameters (GET /clients)
- `search` - Search by name, phone, or client code
- `city` - Filter by city
- `budget_min` - Minimum budget filter
- `budget_max` - Maximum budget filter
- `limit` - Limit results
- `offset` - Pagination offset

---

## 3. Events API

### Endpoints
- `POST /events` - Create new event
- `GET /events` - Get all events (with filters)
- `GET /events/budget-alerts` - Get events exceeding budget
- `GET /events/upcoming` - Get upcoming events
- `GET /events/statistics/status` - Get statistics by status
- `GET /events/:id` - Get event by ID
- `GET /events/:id/details` - Get complete event details
- `GET /events/:id/budget` - Get budget summary with alerts
- `GET /events/:id/readiness` - Check event readiness
- `PUT /events/:id` - Update event
- `PUT /events/:id/status` - Update event status
- `PUT /events/:id/recalculate-cost` - Recalculate actual cost
- `DELETE /events/:id` - Delete event

### Event Status Workflow
```
PLANNING → CONFIRMED → IN_PROGRESS → COMPLETED
         ↓           ↓           ↓
      CANCELLED   CANCELLED   CANCELLED
```

### Query Parameters (GET /events)
- `company_id` - Filter by company
- `client_id` - Filter by client
- `event_type` - Filter by type (WEDDING, BIRTHDAY, CORPORATE, etc.)
- `event_status` - Filter by status
- `venue_city` - Filter by venue city
- `date_from` - Start date filter
- `date_to` - End date filter
- `search` - Search by name, number, or client
- `limit` - Limit results
- `offset` - Pagination offset

---

## 4. Vendors API

### Endpoints

#### Vendor Categories
- `POST /vendors/categories` - Create vendor category
- `GET /vendors/categories` - Get all categories
- `GET /vendors/categories/popular` - Get popular categories
- `GET /vendors/categories/:id` - Get category by ID
- `GET /vendors/categories/:id/vendors` - Get category with vendors
- `GET /vendors/categories/:id/statistics` - Get category statistics
- `PUT /vendors/categories/:id` - Update category
- `DELETE /vendors/categories/:id` - Delete category

#### Event Vendor Bookings
- `POST /vendors/bookings` - Book vendor for event
- `GET /vendors/bookings` - Get all bookings
- `GET /vendors/bookings/pending-payments` - Get bookings with pending payments
- `POST /vendors/bookings/calculate-payment` - Calculate payment breakdown
- `GET /vendors/bookings/event/:eventId` - Get event bookings
- `GET /vendors/bookings/event/:eventId/summary` - Get event vendor summary
- `GET /vendors/bookings/vendor/:vendorId` - Get vendor bookings
- `GET /vendors/bookings/vendor/:vendorId/payment-summary` - Get payment summary
- `GET /vendors/bookings/:id` - Get booking by ID
- `PUT /vendors/bookings/:id` - Update booking
- `PUT /vendors/bookings/:id/payment` - Record payment
- `PUT /vendors/bookings/:id/status` - Update booking status
- `DELETE /vendors/bookings/:id` - Delete booking

#### Vendors
- `POST /vendors` - Create new vendor
- `GET /vendors` - Get all vendors (with filters)
- `GET /vendors/search` - Search vendors
- `GET /vendors/top-rated` - Get top rated vendors
- `GET /vendors/available` - Get available vendors for date range
- `GET /vendors/:id` - Get vendor by ID
- `GET /vendors/:id/performance` - Get vendor performance metrics
- `GET /vendors/:id/bookings` - Get vendor booking history
- `PUT /vendors/:id` - Update vendor
- `DELETE /vendors/:id` - Soft delete vendor

### Payment Status Calculation
- `PENDING` - No advance paid
- `PARTIAL` - 0 < advance_paid < final_price
- `PAID` - advance_paid >= final_price

---

## 5. Tasks & Guests API

### Task Endpoints
- `POST /tasks` - Create new task
- `POST /tasks/bulk` - Create multiple tasks
- `POST /tasks/wedding-checklist` - Generate default wedding checklist
- `GET /tasks` - Get all tasks (with filters)
- `GET /tasks/overdue` - Get overdue tasks
- `GET /tasks/due-soon` - Get tasks due soon
- `GET /tasks/assignee/:assignedTo` - Get tasks by assignee
- `GET /tasks/event/:eventId` - Get event tasks
- `GET /tasks/event/:eventId/statistics` - Get task statistics
- `GET /tasks/event/:eventId/by-category` - Get tasks by category
- `GET /tasks/event/:eventId/by-priority` - Get tasks by priority
- `GET /tasks/:id` - Get task by ID
- `PUT /tasks/:id` - Update task
- `PUT /tasks/:id/status` - Update task status
- `PUT /tasks/:id/complete` - Mark task as completed
- `DELETE /tasks/:id` - Delete task

### Task Priority Levels
- `HIGH` - Overdue or due within 3 days
- `MEDIUM` - Due within 7 days
- `LOW` - Due after 7 days

### Guest Endpoints
- `POST /tasks/guests` - Create new guest
- `POST /tasks/guests/bulk` - Create multiple guests
- `POST /tasks/guests/import` - Import guests from CSV
- `GET /tasks/guests` - Get all guests (with filters)
- `GET /tasks/guests/event/:eventId` - Get event guests
- `GET /tasks/guests/event/:eventId/statistics` - Get guest statistics
- `GET /tasks/guests/event/:eventId/by-category` - Get statistics by category
- `GET /tasks/guests/event/:eventId/rsvp/:status` - Get guests by RSVP status
- `GET /tasks/guests/event/:eventId/category/:category` - Get guests by category
- `GET /tasks/guests/event/:eventId/no-invitation` - Get guests without invitations
- `GET /tasks/guests/event/:eventId/pending-rsvp` - Get pending RSVPs
- `GET /tasks/guests/event/:eventId/special-requirements` - Get guests with special requirements
- `GET /tasks/guests/event/:eventId/confirmed-count` - Get confirmed attendees count
- `GET /tasks/guests/event/:eventId/search?q=term` - Search guests
- `GET /tasks/guests/:id` - Get guest by ID
- `PUT /tasks/guests/:id` - Update guest
- `PUT /tasks/guests/:id/rsvp` - Update RSVP status
- `PUT /tasks/guests/:id/invitation-sent` - Mark invitation as sent
- `PUT /tasks/guests/invitations/bulk-sent` - Mark multiple invitations as sent
- `DELETE /tasks/guests/:id` - Delete guest

### Guest Categories
- `FAMILY` - Family members
- `FRIENDS` - Friends
- `COLLEAGUES` - Work colleagues
- `VIP` - VIP guests

---

## 6. Payments API

### Endpoints
- `POST /payments` - Create payment record
- `POST /payments/client` - Record client payment
- `POST /payments/vendor` - Record vendor payment
- `POST /payments/calculate-schedule` - Calculate payment schedule
- `GET /payments` - Get all payments (with filters)
- `GET /payments/recent` - Get recent payments
- `GET /payments/history` - Get payment history with summary
- `GET /payments/trends/monthly` - Get monthly payment trends
- `GET /payments/statistics/by-type` - Get statistics by payment type
- `GET /payments/statistics/by-mode` - Get statistics by payment mode
- `GET /payments/event/:eventId` - Get event payments
- `GET /payments/event/:eventId/client` - Get client payments
- `GET /payments/event/:eventId/vendor` - Get vendor payments
- `GET /payments/event/:eventId/summary` - Get payment summary
- `GET /payments/:id` - Get payment by ID
- `PUT /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment

### Payment Types
- `ADVANCE` - Advance payment from client
- `INSTALLMENT` - Installment payment from client
- `FINAL` - Final payment from client
- `VENDOR_PAYMENT` - Payment to vendor

---

## 7. Analytics API

### Endpoints
- `GET /analytics/dashboard` - Complete dashboard overview
- `GET /analytics/executive-summary` - Executive summary
- `GET /analytics/comprehensive` - Comprehensive business report
- `GET /analytics/performance` - Performance metrics for period
- `GET /analytics/revenue` - Revenue statistics
- `GET /analytics/events/by-type` - Event statistics by type
- `GET /analytics/events/by-city` - Event statistics by city
- `GET /analytics/events/completion` - Event completion metrics
- `GET /analytics/events/upcoming` - Upcoming events report
- `GET /analytics/vendors/performance` - Vendor performance report
- `GET /analytics/vendors/by-category` - Vendor statistics by category
- `GET /analytics/clients/top` - Top clients by revenue
- `GET /analytics/payments/collection` - Payment collection report
- `GET /analytics/budget/analysis` - Budget analysis report
- `GET /analytics/tasks/completion` - Task completion report
- `GET /analytics/guests/rsvp` - Guest RSVP report
- `GET /analytics/trends/monthly` - Monthly trends

### Query Parameters
- `company_id` - Filter by company
- `start_date` - Start date for date range filters
- `end_date` - End date for date range filters
- `period` - Period type (week, month, quarter, year)
- `months` - Number of months for trends (default: 12)
- `days` - Number of days for upcoming events (default: 30)
- `limit` - Limit results for top queries

---

## Business Rules Implementation

### 1. Event Budget Tracking
```javascript
actual_cost = SUM(final_price from all event_vendors)
alert_triggered = actual_cost > estimated_cost
```

### 2. Vendor Payment Tracking
```javascript
balance_amount = final_price - advance_paid
payment_status = calculatePaymentStatus(final_price, advance_paid)
```

### 3. Task Priority Auto-Calculation
```javascript
if (days_until_due < 0 || days_until_due <= 3) → HIGH
else if (days_until_due <= 7) → MEDIUM
else → LOW
```

### 4. RSVP Tracking
```javascript
total_confirmed_attendees = SUM(number_of_attendees WHERE rsvp_status = 'CONFIRMED')
response_rate = (total_responded / total_invited) * 100
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Request/Response Examples

### Create Event
```bash
POST /api/events
Content-Type: application/json
Authorization: Bearer <token>

{
  "company_id": "uuid",
  "client_id": "uuid",
  "event_name": "John & Jane Wedding",
  "event_type": "WEDDING",
  "event_date": "2024-12-25",
  "bride_name": "Jane Doe",
  "groom_name": "John Smith",
  "venue_name": "Grand Palace Hotel",
  "venue_city": "Mumbai",
  "total_budget": 1000000,
  "estimated_cost": 950000,
  "expected_guests": 500
}
```

### Response
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "uuid",
    "event_number": "WED0001",
    "event_name": "John & Jane Wedding",
    "event_status": "PLANNING",
    "actual_cost": 0,
    ...
  }
}
```

---

## Performance Features

- **Connection Pooling**: PostgreSQL connection pool (min: 2, max: 10)
- **Query Optimization**: Indexed queries, efficient joins
- **Caching**: Redis caching for analytics (if configured)
- **Rate Limiting**: Configurable rate limits
- **Compression**: GZIP compression for responses
- **Transaction Support**: ACID compliance for critical operations

---

## Security Features

- JWT Authentication
- Helmet.js security headers
- CORS configuration
- Rate limiting
- Input validation with Joi
- SQL injection prevention (parameterized queries)
- XSS protection

---

## Deployment

### Environment Variables
```env
# Server
PORT=5000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_planning
DB_USER=postgres
DB_PASSWORD=your_password
DB_POOL_MIN=2
DB_POOL_MAX=10

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Start Server
```bash
npm install
npm start
```

---

## Code Statistics

- **Total Files**: 40+
- **Total Lines**: ~5,000
- **Repositories**: 10 files
- **Services**: 10 files
- **Controllers**: 10 files
- **Routes**: 8 files
- **API Endpoints**: 150+

---

## Support

For issues or questions, please refer to the project documentation or contact the development team.
