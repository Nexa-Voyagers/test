# Event & Wedding Planning Management System - Backend API

Complete production-ready backend for event and wedding planning businesses with vendor management, budget tracking, and task management.

## Features

- **Company Management**: Multi-company support for planning agencies
- **Vendor Management**: Caterers, decorators, photographers, venues, etc.
- **Client Management**: Client profiles, preferences, communication history
- **Event Management**: Wedding, corporate events, parties, conferences
- **Budget Planning**: Budget creation, tracking, expense management
- **Booking System**: Vendor bookings, venue reservations, payment tracking
- **Task Management**: Checklists, timelines, assignments, reminders
- **Payment Tracking**: Advance payments, installments, vendor payments
- **Document Management**: Contracts, invoices, agreements
- **Reports**: Event reports, financial reports, vendor performance

## Tech Stack

- Node.js 20+ & Express.js
- PostgreSQL 15+
- JWT Authentication
- Swagger Documentation

## API Endpoints

### Companies
- `GET /api/v1/companies` - List all planning companies
- `POST /api/v1/companies` - Register new company

### Vendors
- `GET /api/v1/vendors` - List all vendors
- `POST /api/v1/vendors` - Add new vendor
- `GET /api/v1/vendors/:id` - Get vendor details
- `GET /api/v1/vendors/category/:category` - Get vendors by category

### Clients
- `GET /api/v1/clients` - List all clients
- `POST /api/v1/clients` - Add new client
- `GET /api/v1/clients/:id` - Get client profile

### Events
- `GET /api/v1/events` - List all events
- `POST /api/v1/events` - Create new event
- `GET /api/v1/events/:id` - Get event details
- `PUT /api/v1/events/:id` - Update event

### Budget
- `GET /api/v1/budgets/event/:eventId` - Get event budget
- `POST /api/v1/budgets` - Create budget
- `PATCH /api/v1/budgets/:id/expense` - Add expense

### Bookings
- `GET /api/v1/bookings` - List all bookings
- `POST /api/v1/bookings` - Create vendor booking
- `PATCH /api/v1/bookings/:id/status` - Update booking status

### Tasks
- `GET /api/v1/tasks/event/:eventId` - Get event tasks
- `POST /api/v1/tasks` - Create task
- `PATCH /api/v1/tasks/:id` - Update task status

### Payments
- `GET /api/v1/payments` - List all payments
- `POST /api/v1/payments` - Record payment
- `GET /api/v1/payments/event/:eventId` - Get event payments

### Reports
- `GET /api/v1/reports/events` - Event reports
- `GET /api/v1/reports/financial` - Financial reports
- `GET /api/v1/reports/vendors` - Vendor performance reports

## Event Types

- **Wedding**: Full wedding planning, pre-wedding events, reception
- **Corporate**: Conferences, seminars, product launches, team building
- **Birthday**: Birthday parties, milestone celebrations
- **Anniversary**: Anniversary celebrations
- **Social**: Engagement, baby shower, retirement parties
- **Cultural**: Cultural events, festivals, concerts

## Vendor Categories

- Venues & Banquet Halls
- Caterers & Catering Services
- Photographers & Videographers
- Decorators & Event Designers
- Makeup Artists & Mehendi Artists
- DJ & Music Bands
- Wedding Cards & Invitations
- Transportation Services
- Wedding Planners & Coordinators

## Installation

```bash
cd /home/user/test/varanasi-empire-solutions/11-EVENT-WEDDING-PLANNING/backend
npm install
cp .env.example .env
npm run dev
```

## Key Features

### Budget Management
- Create detailed budgets by category
- Track actual vs planned expenses
- Generate budget variance reports
- Alert on budget overruns

### Task Management
- Pre-wedding checklist (6 months to wedding day)
- Task assignments to team members
- Deadline reminders and notifications
- Task completion tracking

### Vendor Management
- Vendor database with ratings
- Booking availability calendar
- Payment tracking per vendor
- Vendor performance metrics

### Client Portal
- View event details and timeline
- Track budget and expenses
- Approve vendor bookings
- View task progress
- Upload documents

## Scheduled Jobs

- **Task Reminders**: Daily at 9 AM - Send task deadline reminders
- **Payment Reminders**: Weekly - Remind clients of pending payments
- **Event Checklist**: Before events - Send pre-event checklists
- **Vendor Follow-up**: After events - Request vendor feedback

## License

PROPRIETARY - Varanasi Empire Solutions

**Version**: 1.0.0
**Last Updated**: 2025-11-18
