import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { corsOptions } from './config/cors.js';
import { rateLimiter } from './config/rateLimiter.js';
import { logger, requestLogger } from './config/logger.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { pool, testConnection } from './config/database.js';
import { startScheduledJobs } from './jobs/index.js';

// Import routes
import instituteRoutes from './routes/institute.routes.js';
import courseRoutes from './routes/course.routes.js';
import batchRoutes from './routes/batch.routes.js';
import facultyRoutes from './routes/faculty.routes.js';
import studentRoutes from './routes/student.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import testRoutes from './routes/test.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import healthRoutes from './routes/health.routes.js';

// Import additional controllers for special routes
import { getAvailableBatches } from './controllers/batch.controller.js';
import { getFeeDefaulters } from './controllers/enrollment.controller.js';
import { getAttendancePercentage, getBatchAttendanceReport, getStudentAttendanceSummary, getLowAttendanceStudents } from './controllers/attendance.controller.js';
import { getPaymentHistory, getPendingPayments, getDailyCollection } from './controllers/payment.controller.js';
import { getStudentPerformance as getTestPerformance } from './controllers/test.controller.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(compression());
app.use(requestLogger);
app.use(rateLimiter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const apiRouter = express.Router();

// Register routes
apiRouter.use('/institutes', instituteRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/batches', batchRoutes);
apiRouter.use('/faculty', facultyRoutes);
apiRouter.use('/students', studentRoutes);
apiRouter.use('/enrollments', enrollmentRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/tests', testRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/health', healthRoutes);

// Special routes for cross-entity operations
apiRouter.get('/courses/:courseId/available-batches', getAvailableBatches);
apiRouter.get('/institutes/:instituteId/fee-defaulters', getFeeDefaulters);
apiRouter.get('/enrollments/:enrollmentId/attendance-percentage', getAttendancePercentage);
apiRouter.get('/batches/:batchId/attendance-report', getBatchAttendanceReport);
apiRouter.get('/students/:studentId/attendance-summary', getStudentAttendanceSummary);
apiRouter.get('/batches/:batchId/low-attendance', getLowAttendanceStudents);
apiRouter.get('/enrollments/:enrollmentId/payment-history', getPaymentHistory);
apiRouter.get('/institutes/:instituteId/pending-payments', getPendingPayments);
apiRouter.get('/institutes/:instituteId/daily-collection', getDailyCollection);
apiRouter.get('/students/:studentId/test-performance', getTestPerformance);

app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Running', version: 'v1' });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await testConnection();
  startScheduledJobs();
  app.listen(PORT, () => logger.info(\`Server running on port \${PORT}\`));
};

startServer();
export default app;
