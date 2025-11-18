# Educational Institute (Coaching Center) Management System - Backend API

Complete production-ready backend for coaching institutes offering NEET, JEE, UPSC, and other competitive exam preparation.

## Features

- **Center Management**: Multi-center support with branch management
- **Course Management**: NEET, JEE, UPSC, and custom course creation
- **Batch Management**: Batch scheduling, capacity management, timing slots
- **Student Management**: Student enrollment, attendance, performance tracking
- **Faculty Management**: Teacher profiles, qualifications, schedules
- **Enrollment System**: Online enrollment, fee payment, course allocation
- **Attendance Tracking**: Student and faculty attendance with reports
- **Fee Management**: Fee collection, installments, receipts, dues tracking
- **Test Management**: Mock tests, practice tests, result analysis
- **Result Analytics**: Performance tracking, rank prediction, improvement metrics
- **Reports**: Attendance reports, fee reports, performance reports

## Tech Stack

- Node.js 20+ & Express.js
- PostgreSQL 15+
- JWT Authentication
- Swagger Documentation

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database, logger, CORS, rate limiter, swagger
│   ├── controllers/     # center, course, batch, student, faculty, enrollment, attendance, fee, test, result, report
│   ├── services/        # Business logic layer
│   ├── repositories/    # Database access layer
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, error handling, validation
│   ├── utils/           # Helper functions
│   ├── jobs/            # Scheduled tasks
│   └── server.js
├── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Centers
- `GET /api/v1/centers` - List all centers
- `POST /api/v1/centers` - Create new center
- `GET /api/v1/centers/:id` - Get center details

### Courses
- `GET /api/v1/courses` - List all courses (NEET, JEE, UPSC, etc.)
- `POST /api/v1/courses` - Create new course
- `PUT /api/v1/courses/:id` - Update course

### Batches
- `GET /api/v1/batches` - List all batches
- `POST /api/v1/batches` - Create new batch
- `GET /api/v1/batches/:id/students` - Get batch students

### Students
- `GET /api/v1/students` - List all students
- `POST /api/v1/students` - Register new student
- `GET /api/v1/students/:id` - Get student profile
- `GET /api/v1/students/:id/performance` - Get performance metrics

### Faculty
- `GET /api/v1/faculty` - List all faculty members
- `POST /api/v1/faculty` - Add new faculty
- `GET /api/v1/faculty/:id/schedule` - Get faculty schedule

### Enrollments
- `POST /api/v1/enrollments` - Enroll student in course
- `GET /api/v1/enrollments/:id` - Get enrollment details

### Attendance
- `POST /api/v1/attendance` - Mark attendance
- `GET /api/v1/attendance/batch/:batchId` - Get batch attendance
- `GET /api/v1/attendance/student/:studentId` - Get student attendance

### Fees
- `GET /api/v1/fees` - List fee structures
- `POST /api/v1/fees/payment` - Record fee payment
- `GET /api/v1/fees/dues` - Get pending dues

### Tests
- `GET /api/v1/tests` - List all tests
- `POST /api/v1/tests` - Create new test
- `POST /api/v1/tests/:id/submit` - Submit test answers

### Results
- `GET /api/v1/results/student/:studentId` - Get student results
- `GET /api/v1/results/test/:testId` - Get test results
- `POST /api/v1/results` - Publish results

### Reports
- `GET /api/v1/reports/attendance` - Attendance reports
- `GET /api/v1/reports/performance` - Performance reports
- `GET /api/v1/reports/fees` - Fee collection reports

## Installation

```bash
cd /home/user/test/varanasi-empire-solutions/10-EDUCATIONAL-INSTITUTE/backend
npm install
cp .env.example .env
# Configure database and other settings in .env
npm run dev
```

## Environment Variables

- `PORT` - Server port (default: 5010)
- `DB_*` - Database configuration
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - Environment (development/production)

## Course Types Supported

- **NEET** - Medical entrance preparation
- **JEE** - Engineering entrance preparation
- **UPSC** - Civil services preparation
- **SSC** - Staff Selection Commission
- **Banking** - Bank exams preparation
- **Railways** - Railway exams
- **State PSC** - State level competitive exams
- **School** - Class 6-12 coaching

## Features

### Student Portal
- View schedule and timetable
- Access study materials
- Take mock tests
- View results and performance
- Track attendance
- Pay fees online

### Faculty Portal
- Mark attendance
- Upload study materials
- Create and grade tests
- View student performance
- Manage batch schedule

### Admin Portal
- Manage centers and courses
- Enroll students
- Assign faculty
- Generate reports
- Track fees and revenue

## Scheduled Jobs

- **Daily Attendance Reminder**: 9 AM - Remind faculty to mark attendance
- **Fee Due Reminder**: Weekly - Send reminders for pending fees
- **Performance Reports**: Monthly - Generate monthly performance reports
- **Test Reminders**: Before tests - Send test reminders to students

## Security Features

- JWT-based authentication
- Role-based access control (Admin, Faculty, Student)
- Password hashing
- Input validation
- Rate limiting
- CORS protection

## License

PROPRIETARY - Varanasi Empire Solutions

**Version**: 1.0.0
**Last Updated**: 2025-11-18
