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
import companyRoutes from './routes/company.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import driverRoutes from './routes/driver.routes.js';
import customerRoutes from './routes/customer.routes.js';
import consignmentRoutes from './routes/consignment.routes.js';
import tripRoutes from './routes/trip.routes.js';
import routeRoutes from './routes/route.routes.js';
import warehouseRoutes from './routes/warehouse.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import reportRoutes from './routes/report.routes.js';
import healthRoutes from './routes/health.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5016;
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/health', healthRoutes);

const apiRouter = express.Router();
apiRouter.use('/companies', authMiddleware, companyRoutes);
apiRouter.use('/vehicles', authMiddleware, vehicleRoutes);
apiRouter.use('/drivers', authMiddleware, driverRoutes);
apiRouter.use('/customers', authMiddleware, customerRoutes);
apiRouter.use('/consignments', authMiddleware, consignmentRoutes);
apiRouter.use('/trips', authMiddleware, tripRoutes);
apiRouter.use('/routes', authMiddleware, routeRoutes);
apiRouter.use('/warehouses', authMiddleware, warehouseRoutes);
apiRouter.use('/expenses', authMiddleware, expenseRoutes);
apiRouter.use('/reports', authMiddleware, reportRoutes);

app.use(\`/api/\${API_VERSION}\`, apiRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Transport & Logistics Management System API',
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
      logger.info(\`🚀 Transport & Logistics Server running on port \${PORT}\`);
      logger.info(\`📚 API Documentation: http://localhost:\${PORT}/api-docs\`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
export default app;
