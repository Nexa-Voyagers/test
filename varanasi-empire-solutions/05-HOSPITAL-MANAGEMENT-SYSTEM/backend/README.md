# Hospital Information System (HIS) - Backend API

Enterprise-grade Hospital Management System backend built with Node.js, Express, and PostgreSQL.

## Features

- **Patient Management**: Complete EMR/EHR with patient registration, medical history, and visit tracking
- **Appointment Scheduling**: Smart appointment booking with doctor availability and slot management
- **OPD/IPD Management**: Outpatient and inpatient department operations
- **Laboratory Management**: Lab test orders, sample tracking, and result management
- **Pharmacy Management**: Medicine inventory, sales, and stock management
- **Billing & Payments**: Comprehensive billing with multiple payment methods
- **ABDM Integration Ready**: Ayushman Bharat Digital Mission integration support
- **Role-Based Access Control**: Multi-role support (Admin, Doctor, Nurse, Receptionist, etc.)
- **Real-time Notifications**: SMS and Email notifications
- **Reports & Analytics**: Comprehensive reporting and analytics

## Tech Stack

- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Authentication**: JWT
- **Validation**: Joi, Express Validator
- **Logging**: Winston
- **Documentation**: Swagger/OpenAPI
- **Caching**: Redis
- **Job Scheduling**: Node-cron

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- PostgreSQL >= 14.0
- Redis >= 6.0
- npm >= 10.0.0

### Installation

1. Clone the repository
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up database
```bash
# Create database
createdb hospital_management

# Run migrations
npm run migrate
```

5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:5001/api-docs
- Health Check: http://localhost:5001/health

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── repositories/    # Database queries
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── jobs/            # Scheduled jobs
│   ├── validators/      # Request validation
│   └── server.js        # Application entry point
├── logs/                # Application logs
├── uploads/             # Uploaded files
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user

### Patients
- `POST /api/v1/patients` - Register new patient
- `GET /api/v1/patients/:id` - Get patient details
- `GET /api/v1/patients/search?q=term` - Search patients
- `PUT /api/v1/patients/:id` - Update patient
- `GET /api/v1/patients/stats` - Get patient statistics

### Appointments
- `POST /api/v1/appointments` - Book appointment
- `GET /api/v1/appointments/:id` - Get appointment details
- `GET /api/v1/appointments/doctor/:doctorId` - Get doctor appointments
- `PATCH /api/v1/appointments/:id/status` - Update status
- `POST /api/v1/appointments/:id/cancel` - Cancel appointment
- `GET /api/v1/appointments/stats` - Get statistics

### Doctors
- `GET /api/v1/doctors` - Get all doctors
- `POST /api/v1/doctors` - Add new doctor
- `GET /api/v1/doctors/:id` - Get doctor details
- `PUT /api/v1/doctors/:id` - Update doctor

### Billing
- `POST /api/v1/billing` - Create bill
- `GET /api/v1/billing/:id` - Get bill details
- `PATCH /api/v1/billing/:id/payment` - Update payment
- `GET /api/v1/billing/revenue` - Get revenue report
- `GET /api/v1/billing/:id/invoice` - Generate invoice

### Laboratory
- `POST /api/v1/lab/tests` - Create lab test
- `GET /api/v1/lab/tests/:id` - Get test details
- `PATCH /api/v1/lab/tests/:id/status` - Update test status
- `GET /api/v1/lab/tests/pending` - Get pending tests
- `GET /api/v1/lab/tests/:id/report` - Generate report

### IPD (Inpatient)
- `POST /api/v1/ipd/admissions` - Admit patient
- `GET /api/v1/ipd/admissions/:id` - Get admission details
- `GET /api/v1/ipd/admissions/active` - Get active admissions
- `POST /api/v1/ipd/admissions/:id/discharge` - Discharge patient
- `POST /api/v1/ipd/admissions/:id/treatment` - Add treatment record
- `GET /api/v1/ipd/occupancy` - Get bed occupancy

### Pharmacy
- `POST /api/v1/pharmacy/sales` - Create sale
- `GET /api/v1/pharmacy/medicines/search?q=term` - Search medicine
- `GET /api/v1/pharmacy/medicines/low-stock` - Get low stock medicines
- `GET /api/v1/pharmacy/medicines/expiring` - Get expiring medicines

## Environment Variables

See `.env.example` for all available configuration options.

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## Scheduled Jobs

- **Appointment Reminders**: Daily at 8:00 AM
- **Expiring Medicines Check**: Daily at 9:00 AM
- **Appointment Status Update**: Every hour
- **Daily Reports**: Daily at 11:00 PM

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "field_name",
      "message": "Field-specific error"
    }
  ]
}
```

## Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error logs
- `combined.log` - All logs
- `exceptions.log` - Uncaught exceptions

## Testing

```bash
npm test
```

## Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Configure production database
3. Set strong JWT secret
4. Configure SMTP for emails
5. Set up Redis for caching
6. Configure file upload limits
7. Set up SSL/TLS
8. Configure backup strategy
9. Set up monitoring and alerts
10. Review and update CORS origins

## License

Proprietary - Varanasi Empire Solutions

## Support

For support, email support@varanasi-empire.com

## Version

1.0.0 - Production Ready
