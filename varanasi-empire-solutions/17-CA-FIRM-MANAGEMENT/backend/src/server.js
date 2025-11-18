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
import firmRoutes from './routes/firm.routes.js';
import clientRoutes from './routes/client.routes.js';
import gstRoutes from './routes/gst.routes.js';
import itrRoutes from './routes/itr.routes.js';
import auditRoutes from './routes/audit.routes.js';
import tdsRoutes from './routes/tds.routes.js';
import complianceRoutes from './routes/compliance.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import documentRoutes from './routes/document.routes.js';
import reportRoutes from './routes/report.routes.js';
import healthRoutes from './routes/health.routes.js';

import { pool, testConnection } from './config/database.js';
import './jobs/complianceJobs.js';
import './jobs/reminderJobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
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
apiRouter.use('/firms', authMiddleware, firmRoutes);
apiRouter.use('/clients', authMiddleware, clientRoutes);
apiRouter.use('/gst', authMiddleware, gstRoutes);
apiRouter.use('/itr', authMiddleware, itrRoutes);
apiRouter.use('/audits', authMiddleware, auditRoutes);
apiRouter.use('/tds', authMiddleware, tdsRoutes);
apiRouter.use('/compliance', authMiddleware, complianceRoutes);
apiRouter.use('/invoices', authMiddleware, invoiceRoutes);
apiRouter.use('/documents', authMiddleware, documentRoutes);
apiRouter.use('/reports', authMiddleware, reportRoutes);

app.use(`/api/${API_VERSION}`, apiRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CA Firm Management System API',
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
      logger.info(`🚀 CA Firm Management System running on port ${PORT}`);
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
