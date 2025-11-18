import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import configurations
import { corsOptions } from './config/cors.js';
import { rateLimiter } from './config/rateLimiter.js';
import { logger, requestLogger } from './config/logger.js';
import { swaggerSpec } from './config/swagger.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { authMiddleware } from './middleware/auth.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import schoolRoutes from './routes/school.routes.js';
import classRoutes from './routes/class.routes.js';
import sectionRoutes from './routes/section.routes.js';
import studentRoutes from './routes/student.routes.js';
import parentRoutes from './routes/parent.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import subjectRoutes from './routes/subject.routes.js';
import timetableRoutes from './routes/timetable.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import examRoutes from './routes/exam.routes.js';
import gradeRoutes from './routes/grade.routes.js';
import feeRoutes from './routes/fee.routes.js';
import libraryRoutes from './routes/library.routes.js';
import transportRoutes from './routes/transport.routes.js';
import reportRoutes from './routes/report.routes.js';
import healthRoutes from './routes/health.routes.js';

// Import database
import { pool, testConnection } from './config/database.js';

// Import cron jobs
import './jobs/attendanceJobs.js';
import './jobs/feeJobs.js';
import './jobs/reportJobs.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'School Management System API Docs',
}));

// Health check route (no version prefix)
app.use('/health', healthRoutes);

// API Routes
const apiRouter = express.Router();

// Public routes
apiRouter.use('/auth', authRoutes);

// Protected routes (require authentication)
apiRouter.use('/users', authMiddleware, userRoutes);
apiRouter.use('/schools', authMiddleware, schoolRoutes);
apiRouter.use('/classes', authMiddleware, classRoutes);
apiRouter.use('/sections', authMiddleware, sectionRoutes);
apiRouter.use('/students', authMiddleware, studentRoutes);
apiRouter.use('/parents', authMiddleware, parentRoutes);
apiRouter.use('/teachers', authMiddleware, teacherRoutes);
apiRouter.use('/subjects', authMiddleware, subjectRoutes);
apiRouter.use('/timetable', authMiddleware, timetableRoutes);
apiRouter.use('/attendance', authMiddleware, attendanceRoutes);
apiRouter.use('/exams', authMiddleware, examRoutes);
apiRouter.use('/grades', authMiddleware, gradeRoutes);
apiRouter.use('/fees', authMiddleware, feeRoutes);
apiRouter.use('/library', authMiddleware, libraryRoutes);
apiRouter.use('/transport', authMiddleware, transportRoutes);
apiRouter.use('/reports', authMiddleware, reportRoutes);

// Mount API router with version prefix
app.use(`/api/${API_VERSION}`, apiRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'School Management System API',
    version: API_VERSION,
    documentation: '/api-docs',
    health: '/health',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Received shutdown signal, closing server gracefully...');

  try {
    await pool.end();
    logger.info('Database pool closed');

    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    app.listen(PORT, () => {
      logger.info(`🚀 School Management System running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🌐 API Endpoint: http://localhost:${PORT}/api/${API_VERSION}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
