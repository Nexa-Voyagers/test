# School Management System (SIS) - Backend API

Complete production-ready backend API for School Management System supporting CBSE, ICSE, UP Board, and State Board schools.

## Features

### Core Modules
- **Student Management**: Complete student information system with admissions, promotions, ID cards, report cards
- **Attendance Management**: Daily attendance marking, low attendance tracking, parent notifications
- **Fee Management**: Fee structure, invoice generation, payment collection, defaulter tracking, GST billing
- **Exam Management**: Exam scheduling, timetable, marks entry, result publishing, toppers, performance analysis
- **Academic Management**: Classes, sections, subjects, timetable, teacher assignments
- **Library Management**: Book catalog, issue/return, overdue tracking, student history
- **Transport Management**: Route management, student assignments, vehicle tracking, GPS integration
- **Parent Portal**: Children info, attendance, fees, results, notifications
- **Staff Management**: Teacher profiles, attendance, timetable, performance
- **Reports & Analytics**: Admission, attendance, fee collection, exam performance, student strength

### Technical Features
- RESTful API architecture
- MVC + Service + Repository pattern
- PostgreSQL database with 80+ tables
- JWT authentication & authorization
- Role-based access control (Admin, Principal, Teacher, Parent, Student)
- Input validation & sanitization
- Error handling & logging
- Rate limiting & security
- Swagger API documentation
- Scheduled jobs (cron) for notifications
- Multi-school support (Enterprise tier)
- Academic year management

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Authentication**: JWT
- **Validation**: Joi, express-validator
- **Logging**: Winston
- **Documentation**: Swagger/OpenAPI 3.0
- **Scheduling**: node-cron
- **PDF Generation**: PDFKit
- **Excel Export**: ExcelJS

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL >= 14.0
- Redis (optional, for caching)

## Installation

1. Clone the repository
```bash
cd varanasi-empire-solutions/14-SCHOOL-MANAGEMENT-SYSTEM/backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Setup database
```bash
# Create database
createdb school_management_db

# Run migrations (import complete-schema.sql)
psql school_management_db < ../database/complete-schema.sql
```

5. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:5000/api-docs
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # Database connection
│   │   ├── logger.js     # Winston logger
│   │   ├── cors.js       # CORS configuration
│   │   ├── rateLimiter.js # Rate limiting
│   │   └── swagger.js    # API documentation
│   ├── controllers/      # Request handlers (17 controllers)
│   │   ├── auth.controller.js
│   │   ├── student.controller.js
│   │   ├── attendance.controller.js
│   │   ├── fee.controller.js
│   │   ├── exam.controller.js
│   │   ├── library.controller.js
│   │   ├── transport.controller.js
│   │   ├── teacher.controller.js
│   │   ├── school.controller.js
│   │   ├── class.controller.js
│   │   ├── section.controller.js
│   │   ├── subject.controller.js
│   │   ├── timetable.controller.js
│   │   ├── grade.controller.js
│   │   ├── parent.controller.js
│   │   ├── report.controller.js
│   │   └── user.controller.js
│   ├── services/         # Business logic (17 services)
│   │   ├── auth.service.js
│   │   ├── student.service.js
│   │   ├── attendance.service.js
│   │   ├── fee.service.js
│   │   ├── exam.service.js
│   │   └── ...
│   ├── repositories/     # Database queries (17 repositories)
│   │   ├── user.repository.js
│   │   ├── student.repository.js
│   │   ├── attendance.repository.js
│   │   ├── fee.repository.js
│   │   ├── exam.repository.js
│   │   └── ...
│   ├── routes/           # API routes (17 route files)
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
│   │   ├── attendance.routes.js
│   │   └── ...
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication
│   │   ├── errorHandler.js # Error handling
│   │   ├── validate.js   # Input validation
│   │   └── notFoundHandler.js
│   ├── utils/            # Utility functions
│   │   ├── errors.js     # Custom error classes
│   │   ├── asyncHandler.js # Async wrapper
│   │   ├── jwt.js        # JWT utilities
│   │   └── password.js   # Password hashing
│   ├── validators/       # Input validation schemas
│   ├── jobs/             # Scheduled jobs
│   │   ├── attendanceJobs.js
│   │   ├── feeJobs.js
│   │   └── reportJobs.js
│   └── server.js         # Application entry point
├── logs/                 # Application logs
├── uploads/              # File uploads
├── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password/:token` - Reset password

### Students
- `GET /api/v1/students` - Get all students
- `GET /api/v1/students/:id` - Get student by ID
- `POST /api/v1/students` - Create student
- `PUT /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student
- `POST /api/v1/students/promote` - Promote students
- `GET /api/v1/students/:id/attendance` - Get student attendance
- `GET /api/v1/students/:id/results` - Get student results
- `GET /api/v1/students/:id/fees` - Get student fees
- `GET /api/v1/students/:id/id-card` - Generate ID card
- `GET /api/v1/students/:id/report-card` - Get report card

### Attendance
- `POST /api/v1/attendance/mark` - Mark attendance
- `GET /api/v1/attendance` - Get attendance
- `GET /api/v1/attendance/student/:studentId` - Student attendance summary
- `GET /api/v1/attendance/class/:classId/summary` - Class attendance summary
- `PUT /api/v1/attendance/:id` - Update attendance
- `GET /api/v1/attendance/low-attendance` - Low attendance students
- `GET /api/v1/attendance/staff` - Staff attendance
- `POST /api/v1/attendance/staff/mark` - Mark staff attendance
- `POST /api/v1/attendance/notify` - Send attendance notifications

### Fees
- `POST /api/v1/fees/structure` - Create fee structure
- `GET /api/v1/fees/structure` - Get fee structures
- `POST /api/v1/fees/generate-invoices` - Generate invoices
- `GET /api/v1/fees/student/:studentId/invoices` - Get student invoices
- `POST /api/v1/fees/payment` - Record payment
- `GET /api/v1/fees/student/:studentId/payments` - Payment history
- `GET /api/v1/fees/defaulters` - Fee defaulters
- `POST /api/v1/fees/discount` - Apply discount
- `GET /api/v1/fees/payment/:paymentId/receipt` - Generate receipt
- `GET /api/v1/fees/reports/collection` - Fee collection report
- `POST /api/v1/fees/send-reminders` - Send fee reminders

### Exams
- `POST /api/v1/exams` - Create exam
- `GET /api/v1/exams` - Get all exams
- `GET /api/v1/exams/:id` - Get exam by ID
- `PUT /api/v1/exams/:id` - Update exam
- `DELETE /api/v1/exams/:id` - Delete exam
- `POST /api/v1/exams/:examId/timetable` - Create exam timetable
- `GET /api/v1/exams/:examId/timetable` - Get exam timetable
- `POST /api/v1/exams/marks/entry` - Enter marks
- `GET /api/v1/exams/marks/student/:studentId` - Get student marks
- `GET /api/v1/exams/:examId/report-card/:studentId` - Generate report card
- `GET /api/v1/exams/:examId/analysis/class/:classId` - Class performance
- `GET /api/v1/exams/:examId/analysis/subject/:subjectId` - Subject performance
- `GET /api/v1/exams/:examId/toppers` - Get toppers
- `POST /api/v1/exams/:examId/publish` - Publish results

### Library, Transport, Teachers, etc.
Similar comprehensive endpoints for all modules...

## Security

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection protection (parameterized queries)
- Rate limiting
- CORS configuration
- Helmet.js security headers
- Environment variable protection

## Logging

- Winston logger with daily rotation
- Separate error and combined logs
- HTTP request logging
- Error stack traces in development

## Scheduled Jobs

- **Daily Attendance Summary**: 6:00 PM
- **Fee Reminders**: 9:00 AM daily
- **Monthly Reports**: 1st of every month

## Error Handling

Consistent error response format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [],
  "stack": "Stack trace (development only)"
}
```

## Database Schema

The system uses 80+ tables including:
- schools, school_groups
- students, parents, guardians
- teachers, staff
- classes, sections, subjects
- attendance, staff_attendance
- exams, exam_schedules, exam_marks
- fee_structures, fee_invoices, fee_payments
- library_books, library_issues
- transport_routes, vehicles, route_stops
- timetables, periods
- notifications, announcements

## Environment Variables

See `.env.example` for all required environment variables.

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Production Deployment

1. Set NODE_ENV=production
2. Configure production database
3. Set secure JWT secrets
4. Enable SSL/HTTPS
5. Configure reverse proxy (Nginx)
6. Set up process manager (PM2)
7. Configure backup strategy
8. Set up monitoring

## Support

For support and queries:
- Email: school@varanasi-empire.com
- Documentation: http://localhost:5000/api-docs

## License

Proprietary - Varanasi Empire Solutions

---

**Total Lines**: ~5,500+ lines of production-ready code
**Architecture**: MVC + Service + Repository Pattern
**Status**: Production Ready
