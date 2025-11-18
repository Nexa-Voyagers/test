import express from 'express';
import gymRoutes from './gym.routes.js';
import membershipPlanRoutes from './membership-plan.routes.js';
import memberRoutes from './member.routes.js';
import membershipRoutes from './membership.routes.js';
import trainerRoutes from './trainer.routes.js';
import sessionRoutes from './session.routes.js';
import attendanceRoutes from './attendance.routes.js';
import measurementRoutes from './measurement.routes.js';
import dietRoutes from './diet.routes.js';
import workoutRoutes from './workout.routes.js';
import analyticsRoutes from './analytics.routes.js';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';

const router = express.Router();

/**
 * API Routes v1
 * Base path: /api/v1
 */

// Health check (no auth required)
router.use('/health', healthRoutes);

// Authentication routes (no auth required)
router.use('/auth', authRoutes);

// Gym & Facility Management
router.use('/gyms', gymRoutes);

// Membership Management
router.use('/membership-plans', membershipPlanRoutes);
router.use('/memberships', membershipRoutes);

// Member Management
router.use('/members', memberRoutes);

// Trainer & Session Management
router.use('/trainers', trainerRoutes);
router.use('/sessions', sessionRoutes);

// Attendance & Check-in
router.use('/attendance', attendanceRoutes);

// Body Measurements & Progress Tracking
router.use('/measurements', measurementRoutes);

// Diet & Workout Plans
router.use('/diet-plans', dietRoutes);
router.use('/workout-plans', workoutRoutes);

// Analytics & Reports
router.use('/analytics', analyticsRoutes);

// API documentation
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Gym & Fitness Center Management API v1.0',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      gyms: '/api/v1/gyms',
      membership_plans: '/api/v1/membership-plans',
      memberships: '/api/v1/memberships',
      members: '/api/v1/members',
      trainers: '/api/v1/trainers',
      sessions: '/api/v1/sessions',
      attendance: '/api/v1/attendance',
      measurements: '/api/v1/measurements',
      diet_plans: '/api/v1/diet-plans',
      workout_plans: '/api/v1/workout-plans',
      analytics: '/api/v1/analytics'
    },
    documentation: '/api-docs'
  });
});

export default router;
