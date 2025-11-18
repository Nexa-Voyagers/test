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
import healthRoutes from './routes/health.routes.js';
import centerRoutes from './routes/center.routes.js';
import serviceRoutes from './routes/service.routes.js';
import therapistRoutes from './routes/therapist.routes.js';
import memberRoutes from './routes/member.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import packageRoutes from './routes/package.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reportRoutes from './routes/report.routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5018;
const API_VERSION = process.env.API_VERSION || 'v1';
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(requestLogger);
app.use(rateLimiter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/health', healthRoutes);
const apiRouter = express.Router();
apiRouter.use('/centers', authMiddleware, centerRoutes);
apiRouter.use('/services', authMiddleware, serviceRoutes);
apiRouter.use('/therapists', authMiddleware, therapistRoutes);
apiRouter.use('/members', authMiddleware, memberRoutes);
apiRouter.use('/appointments', authMiddleware, appointmentRoutes);
apiRouter.use('/packages', authMiddleware, packageRoutes);
apiRouter.use('/assessments', authMiddleware, assessmentRoutes);
apiRouter.use('/payments', authMiddleware, paymentRoutes);
apiRouter.use('/reports', authMiddleware, reportRoutes);
app.use(`/api/${API_VERSION}`, apiRouter);
app.get('/', (req, res) => {
  res.json({ success: true, message: 'HEALTH FITNESS CENTER API', version: API_VERSION, documentation: '/api-docs', health: '/health' });
});
app.use(notFoundHandler);
app.use(errorHandler);
const gracefulShutdown = async () => {
  logger.info('Shutting down...');
  try { await pool.end(); process.exit(0); } catch (error) { process.exit(1); }
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
const startServer = async () => {
  try {
    await testConnection();
    startScheduledJobs();
    app.listen(PORT, () => {
      logger.info(`🚀 HEALTH FITNESS CENTER Server running on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();
export default app;
