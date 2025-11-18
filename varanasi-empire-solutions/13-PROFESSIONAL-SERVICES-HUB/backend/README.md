# Professional Services Hub Management System - Backend API

Complete production-ready backend for multi-professional service platform connecting clients with lawyers, CAs, doctors, consultants, and other professionals.

## Features

- **Hub Management**: Multi-service hub support
- **Professional Management**: Lawyers, CAs, doctors, consultants, etc.
- **Client Management**: Client profiles, service history, preferences
- **Service Catalog**: List services, pricing, duration
- **Booking System**: Appointment scheduling, availability management
- **Consultation Management**: Online/offline consultations, video calls
- **Invoice Generation**: Service invoices, GST billing
- **Availability Management**: Professional calendars, working hours
- **Commission Tracking**: Hub commission on services
- **Document Management**: Client documents, case files
- **Reports**: Revenue reports, professional performance, client analytics

## Tech Stack

- Node.js 20+ & Express.js
- PostgreSQL 15+
- JWT Authentication
- Swagger Documentation

## API Endpoints

### Hubs
- `GET /api/v1/hubs` - List all service hubs
- `POST /api/v1/hubs` - Register new hub
- `GET /api/v1/hubs/:id` - Get hub details

### Professionals
- `GET /api/v1/professionals` - List all professionals
- `POST /api/v1/professionals` - Register new professional
- `GET /api/v1/professionals/:id` - Get professional profile
- `GET /api/v1/professionals/category/:category` - Get professionals by category
- `PATCH /api/v1/professionals/:id/verification` - Verify professional credentials

### Clients
- `GET /api/v1/clients` - List all clients
- `POST /api/v1/clients` - Register new client
- `GET /api/v1/clients/:id` - Get client profile

### Services
- `GET /api/v1/services` - List all services
- `POST /api/v1/services` - Create new service
- `GET /api/v1/services/professional/:professionalId` - Get professional's services

### Bookings
- `GET /api/v1/bookings` - List all bookings
- `POST /api/v1/bookings` - Create new booking
- `GET /api/v1/bookings/:id` - Get booking details
- `PATCH /api/v1/bookings/:id/status` - Update booking status
- `GET /api/v1/bookings/professional/:professionalId` - Get professional bookings
- `GET /api/v1/bookings/client/:clientId` - Get client bookings

### Consultations
- `GET /api/v1/consultations` - List consultations
- `POST /api/v1/consultations` - Start consultation
- `PATCH /api/v1/consultations/:id/complete` - Complete consultation
- `POST /api/v1/consultations/:id/notes` - Add consultation notes

### Invoices
- `GET /api/v1/invoices` - List all invoices
- `POST /api/v1/invoices` - Generate invoice
- `GET /api/v1/invoices/:id` - Get invoice details
- `GET /api/v1/invoices/client/:clientId` - Get client invoices

### Availability
- `GET /api/v1/availability/professional/:professionalId` - Get professional availability
- `POST /api/v1/availability` - Set availability
- `PATCH /api/v1/availability/:id` - Update availability

### Reports
- `GET /api/v1/reports/revenue` - Revenue reports
- `GET /api/v1/reports/professionals` - Professional performance
- `GET /api/v1/reports/bookings` - Booking analytics

## Professional Categories

### Legal Services
- Lawyers & Advocates
- Legal Consultants
- Notary Services
- Legal Documentation

### Financial Services
- Chartered Accountants (CA)
- Tax Consultants
- Financial Advisors
- Auditors

### Healthcare
- Doctors & Physicians
- Dentists
- Physiotherapists
- Dietitians & Nutritionists

### Business Consulting
- Management Consultants
- Business Advisors
- HR Consultants
- Marketing Consultants

### Technical Services
- IT Consultants
- Software Developers
- Cybersecurity Experts
- Data Analysts

### Educational
- Career Counselors
- Education Consultants
- Tutors

## Service Types

- **Consultation**: One-time consultation (30 min, 1 hour)
- **Follow-up**: Follow-up consultation
- **Documentation**: Document preparation, filing
- **Representation**: Court representation, meetings
- **Advisory**: Ongoing advisory services
- **Audit**: Financial/technical audits

## Booking Flow

1. Client searches for professional by category/service
2. Views professional profile, ratings, and availability
3. Selects date/time slot and service
4. Makes payment (advance or full)
5. Receives booking confirmation
6. Professional accepts/rejects booking
7. Consultation happens (online/offline)
8. Service completion and payment
9. Client can rate and review

## Installation

```bash
cd /home/user/test/varanasi-empire-solutions/13-PROFESSIONAL-SERVICES-HUB/backend
npm install
cp .env.example .env
npm run dev
```

## Key Features

### Professional Verification
- Identity verification
- Credential verification (degree, license, registration)
- Background check
- Verified badge display

### Commission Model
- Hub charges commission on each booking
- Flexible commission rates by service category
- Automated commission calculation
- Monthly commission reports

### Availability Management
- Set working hours and days
- Mark leaves and holidays
- Block specific time slots
- Recurring availability patterns

### Client Portal
- Search and book professionals
- View booking history
- Access consultation notes
- Make payments
- Rate and review services

### Professional Portal
- Manage profile and services
- View and accept bookings
- Set availability
- Track earnings and commissions
- Access client information

### Admin Portal
- Verify professionals
- Manage services and pricing
- Track revenue and commissions
- Generate reports
- Handle disputes

## Scheduled Jobs

- **Booking Reminders**: Daily - Send booking reminders 24 hours before
- **Payment Reminders**: Daily - Remind clients of pending payments
- **Verification Expiry**: Monthly - Check professional credential expiry
- **Monthly Reports**: 1st of month - Generate monthly revenue reports

## Payment Integration

- Razorpay for online payments
- Support for advance payment and pay-after-service
- Commission automatically deducted
- Professional payout management

## Security Features

- Professional credential verification
- Secure document storage
- GDPR compliant data handling
- Encrypted consultations
- Audit logs for all transactions

## License

PROPRIETARY - Varanasi Empire Solutions

**Version**: 1.0.0
**Last Updated**: 2025-11-18
