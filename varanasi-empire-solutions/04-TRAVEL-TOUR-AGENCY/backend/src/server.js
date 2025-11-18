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

import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import tourPackageRoutes from './routes/tourPackage.routes.js';
import healthRoutes from './routes/health.routes.js';

import { pool, testConnection } from './config/database.js';
import { startScheduledJobs } from './jobs/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;
const API_VERSION = process.env.API_VERSION || 'v1';

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(requestLogger);
app.use(rateLimiter);

app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Travel & Tour Agency API Docs',
}));

app.use('/health', healthRoutes);

const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/bookings', authMiddleware, bookingRoutes);
apiRouter.use('/packages', authMiddleware, tourPackageRoutes);

app.use(`/api/${API_VERSION}`, apiRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Travel & Tour Agency Management System API',
    version: API_VERSION,
    documentation: '/api-docs',
    health: '/health',
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  try {
    await pool.end();
    logger.info('Database pool closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const startServer = async () => {
  try {
    await testConnection();
    startScheduledJobs();

    app.listen(PORT, () => {
      logger.info(`🚀 Travel & Tour Agency Server running on port ${PORT}`);
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
