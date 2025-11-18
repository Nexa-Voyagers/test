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

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import pharmacyRoutes from './routes/pharmacy.routes.js';
import drugRoutes from './routes/drug.routes.js';
import categoryRoutes from './routes/category.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import prescriptionRoutes from './routes/prescription.routes.js';
import saleRoutes from './routes/sale.routes.js';
import purchaseRoutes from './routes/purchase.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import customerRoutes from './routes/customer.routes.js';
import reportRoutes from './routes/report.routes.js';
import healthRoutes from './routes/health.routes.js';

import { pool, testConnection } from './config/database.js';
import './jobs/expiryJobs.js';
import './jobs/stockJobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const API_VERSION = process.env.API_VERSION || 'v1';

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(requestLogger);
app.use(rateLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/health', healthRoutes);

const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', authMiddleware, userRoutes);
apiRouter.use('/pharmacies', authMiddleware, pharmacyRoutes);
apiRouter.use('/drugs', authMiddleware, drugRoutes);
apiRouter.use('/categories', authMiddleware, categoryRoutes);
apiRouter.use('/inventory', authMiddleware, inventoryRoutes);
apiRouter.use('/prescriptions', authMiddleware, prescriptionRoutes);
apiRouter.use('/sales', authMiddleware, saleRoutes);
apiRouter.use('/purchases', authMiddleware, purchaseRoutes);
apiRouter.use('/suppliers', authMiddleware, supplierRoutes);
apiRouter.use('/customers', authMiddleware, customerRoutes);
apiRouter.use('/reports', authMiddleware, reportRoutes);

app.use(`/api/${API_VERSION}`, apiRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Pharmacy Management System API',
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
    app.listen(PORT, () => {
      logger.info(`🚀 Pharmacy Management System running on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
export default app;
