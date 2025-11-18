# Temple Management System - Backend API

Enterprise Hindu Temple Management System with online darshan booking, pooja services, donation management, and prasad delivery.

## Features

- **Darshan Booking**: Online & offline darshan slot booking with capacity management
- **Pooja Services**: Pooja booking with priest assignment and schedule management
- **Donation Management**: Multi-purpose donations with 80G tax exemption certificates
- **Prasad Management**: Prasad ordering with counter pickup and home delivery
- **Festival Management**: Special festival event planning and booking
- **Hundi Collection**: Digital hundi with real-time tracking
- **Priest Management**: Priest scheduling and duty assignment
- **Live Darshan**: Live streaming integration support
- **Reports & Analytics**: Comprehensive reports for trust management

## Tech Stack

- Node.js v20+ | Express.js | PostgreSQL 14+ | JWT | Redis | Winston | Swagger

## API Endpoints

### Darshan Bookings
- `POST /api/v1/darshan/bookings` - Book darshan slot
- `GET /api/v1/darshan/bookings/:id` - Get booking details
- `GET /api/v1/darshan/bookings/schedule?date=YYYY-MM-DD` - Get day schedule
- `PATCH /api/v1/darshan/bookings/:id/status` - Update booking status
- `GET /api/v1/darshan/bookings/stats?date=YYYY-MM-DD` - Get daily statistics

### Donations
- `POST /api/v1/donations` - Record donation
- `GET /api/v1/donations/:id` - Get donation details
- `GET /api/v1/donations/receipt/:receiptNumber` - Get by receipt
- `GET /api/v1/donations/report?startDate&endDate` - Get donation report
- `GET /api/v1/donations/top-donors?limit=10` - Get top donors
- `POST /api/v1/donations/:id/80g-certificate` - Generate 80G certificate

## Installation

```bash
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

## License

Proprietary - Varanasi Empire Solutions

## Version

1.0.0 - Production Ready
