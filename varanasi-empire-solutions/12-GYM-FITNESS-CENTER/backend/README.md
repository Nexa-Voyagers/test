# Gym & Fitness Center Management System - Backend API

Complete production-ready backend for gym and fitness center management with member tracking, workout plans, and trainer management.

## Features

- **Gym Management**: Multi-gym support, branch management
- **Member Management**: Member profiles, body metrics, goals
- **Trainer Management**: Trainer profiles, certifications, schedules, client assignments
- **Membership Plans**: Flexible plans (monthly, quarterly, annual), pricing tiers
- **Attendance Tracking**: Member check-in/check-out, attendance reports
- **Workout Plans**: Customized workout routines, exercise library
- **Diet Plans**: Nutrition plans, meal suggestions, calorie tracking
- **Equipment Management**: Equipment inventory, maintenance schedules
- **Payment Processing**: Membership fees, renewals, payment history
- **Body Metrics**: Weight, BMI, body fat %, progress tracking
- **Reports**: Revenue reports, attendance reports, trainer performance

## Tech Stack

- Node.js 20+ & Express.js
- PostgreSQL 15+
- JWT Authentication
- Swagger Documentation

## API Endpoints

### Gyms
- `GET /api/v1/gyms` - List all gym branches
- `POST /api/v1/gyms` - Register new gym
- `GET /api/v1/gyms/:id` - Get gym details

### Members
- `GET /api/v1/members` - List all members
- `POST /api/v1/members` - Register new member
- `GET /api/v1/members/:id` - Get member profile
- `PATCH /api/v1/members/:id/metrics` - Update body metrics

### Trainers
- `GET /api/v1/trainers` - List all trainers
- `POST /api/v1/trainers` - Add new trainer
- `GET /api/v1/trainers/:id` - Get trainer profile
- `GET /api/v1/trainers/:id/clients` - Get trainer's clients

### Memberships
- `GET /api/v1/memberships/plans` - List membership plans
- `POST /api/v1/memberships` - Create new membership
- `PATCH /api/v1/memberships/:id/renew` - Renew membership
- `GET /api/v1/memberships/:id` - Get membership details

### Attendance
- `POST /api/v1/attendance/check-in` - Member check-in
- `POST /api/v1/attendance/check-out` - Member check-out
- `GET /api/v1/attendance/member/:memberId` - Get member attendance

### Workouts
- `GET /api/v1/workouts/member/:memberId` - Get member workout plan
- `POST /api/v1/workouts` - Create workout plan
- `GET /api/v1/workouts/exercises` - List all exercises
- `POST /api/v1/workouts/log` - Log workout session

### Diet
- `GET /api/v1/diet/member/:memberId` - Get member diet plan
- `POST /api/v1/diet` - Create diet plan
- `POST /api/v1/diet/log` - Log meals

### Equipment
- `GET /api/v1/equipment` - List all equipment
- `POST /api/v1/equipment` - Add new equipment
- `PATCH /api/v1/equipment/:id/maintenance` - Schedule maintenance

### Payments
- `GET /api/v1/payments` - List all payments
- `POST /api/v1/payments` - Record payment
- `GET /api/v1/payments/member/:memberId` - Get member payment history

### Reports
- `GET /api/v1/reports/revenue` - Revenue reports
- `GET /api/v1/reports/attendance` - Attendance reports
- `GET /api/v1/reports/membership` - Membership statistics

## Membership Plans

### Basic Plan
- Access to gym equipment
- Basic changing room facilities
- Valid for 1 month

### Standard Plan
- All Basic features
- Group classes included
- 3 month validity

### Premium Plan
- All Standard features
- Personal trainer sessions (4/month)
- Diet consultation
- 6 month validity

### Platinum Plan
- All Premium features
- Unlimited personal training
- Nutrition counseling
- Steam & sauna access
- 12 month validity

## Features

### Member Portal
- View membership details
- Check attendance history
- Access workout plans
- View diet plans
- Track body metrics and progress
- Book trainer sessions

### Trainer Portal
- View assigned clients
- Create workout plans
- Update client progress
- Schedule sessions
- Track certifications

### Admin Portal
- Manage memberships
- Track revenue and payments
- View attendance analytics
- Manage trainers and equipment
- Generate reports

## Body Metrics Tracked

- Weight
- Height
- BMI (Body Mass Index)
- Body Fat Percentage
- Muscle Mass
- Chest, Waist, Hip measurements
- Progress photos
- Fitness goals

## Workout Categories

- Strength Training
- Cardio
- HIIT (High Intensity Interval Training)
- Yoga
- Pilates
- Zumba
- CrossFit
- Functional Training

## Installation

```bash
cd /home/user/test/varanasi-empire-solutions/12-GYM-FITNESS-CENTER/backend
npm install
cp .env.example .env
npm run dev
```

## Scheduled Jobs

- **Membership Expiry Alert**: Daily - Alert members 7 days before expiry
- **Attendance Reports**: Weekly - Generate weekly attendance reports
- **Equipment Maintenance**: Monthly - Check equipment maintenance schedules
- **Inactive Member Alert**: Weekly - Identify and notify inactive members

## License

PROPRIETARY - Varanasi Empire Solutions

**Version**: 1.0.0
**Last Updated**: 2025-11-18
