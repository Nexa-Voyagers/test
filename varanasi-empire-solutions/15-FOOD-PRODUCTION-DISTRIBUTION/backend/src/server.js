import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { corsOptions } from './config/cors.js';
import { rateLimiter } from './config/rateLimiter.js';
import { logger, requestLogger } from './config/logger.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { authMiddleware } from './middleware/auth.js';

import unitRoutes from './routes/unit.routes.js';
import productRoutes from './routes/product.routes.js';
import productionRoutes from './routes/production.routes.js';
import qualityRoutes from './routes/quality.routes.js';
import distributorRoutes from './routes/distributor.routes.js';
import orderRoutes from './routes/order.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import reportRoutes from './routes/report.routes.js';
import healthRoutes from './routes/health.routes.js';

import { pool, testConnection } from './config/database.js';
import { startScheduledJobs } from './jobs/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5015;
const API_VERSION = process.env.API_VERSION || 'v1';

app.set('trust proxy', 1);

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

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(requestLogger);
app.use(rateLimiter);

app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Food Production & Distribution API Docs',
}));

app.use('/health', healthRoutes);

const apiRouter = express.Router();

apiRouter.use('/units', authMiddleware, unitRoutes);
apiRouter.use('/products', authMiddleware, productRoutes);
apiRouter.use('/production', authMiddleware, productionRoutes);
apiRouter.use('/quality', authMiddleware, qualityRoutes);
apiRouter.use('/distributors', authMiddleware, distributorRoutes);
apiRouter.use('/orders', authMiddleware, orderRoutes);
apiRouter.use('/inventory', authMiddleware, inventoryRoutes);
apiRouter.use('/reports', authMiddleware, reportRoutes);

app.use(`/api/${API_VERSION}`, apiRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Food Production & Distribution Management System API',
    version: API_VERSION,
    documentation: '/api-docs',
    health: '/health',
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

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

const startServer = async () => {
  try {
    await testConnection();
    startScheduledJobs();
    app.listen(PORT, () => {
      logger.info(`🚀 Food Production & Distribution Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
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
