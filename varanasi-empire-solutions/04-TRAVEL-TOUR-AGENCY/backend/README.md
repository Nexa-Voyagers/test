# Travel & Tour Agency Management System - Backend API

Comprehensive travel agency management system for tour packages, bookings, itineraries, hotels, transport, visa assistance, and guide management.

## Features

- **Tour Package Management**: Create and manage tour packages with detailed itineraries
- **Booking System**: Customer bookings with payment tracking and status management
- **Customer Management**: Customer database with travel history and preferences
- **Itinerary Management**: Day-wise itinerary planning with activities
- **Hotel Booking**: Hotel reservations with room allocation
- **Transport Management**: Vehicle fleet management and booking
- **Visa Assistance**: Visa application tracking and processing
- **Guide Assignment**: Tour guide assignment and scheduling
- **Payment Tracking**: Advance payments, installments, and full payment tracking
- **Reports & Analytics**: Booking reports, revenue analysis, and customer insights

## Tech Stack

- Node.js v20+ | Express.js | PostgreSQL 14+ | JWT | Redis | Winston | Swagger

## API Endpoints

### Tour Packages
- `POST /api/v1/packages` - Create tour package
- `GET /api/v1/packages` - Get all packages
- `GET /api/v1/packages/:id` - Get package details
- `GET /api/v1/packages/search?q=term` - Search packages
- `PUT /api/v1/packages/:id` - Update package
- `GET /api/v1/packages/popular?limit=10` - Get popular packages

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - Get all bookings
- `GET /api/v1/bookings/:id` - Get booking details
- `GET /api/v1/bookings/number/:bookingNumber` - Get by booking number
- `PATCH /api/v1/bookings/:id/status` - Update booking status
- `POST /api/v1/bookings/:id/payment` - Add payment
- `GET /api/v1/bookings/stats?startDate&endDate` - Get booking statistics

## Installation

```bash
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

## Package Types Supported

- **Pilgrimage Tours**: Kashi-Ayodhya, Char Dham, Vaishno Devi
- **Heritage Tours**: Historical sites and monuments
- **Adventure Tours**: Trekking, rafting, camping
- **Honeymoon Packages**: Romantic destinations
- **Corporate Tours**: MICE (Meetings, Incentives, Conferences, Exhibitions)
- **Educational Tours**: School and college trips
- **Custom Tours**: Tailor-made itineraries

## License

Proprietary - Varanasi Empire Solutions

## Version

1.0.0 - Production Ready
