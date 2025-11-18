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
import storeRoutes from './routes/store.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import customerRoutes from './routes/customer.routes.js';
import saleRoutes from './routes/sale.routes.js';
import customOrderRoutes from './routes/customOrder.routes.js';
import weaverRoutes from './routes/weaver.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import reportRoutes from './routes/report.routes.js';
import healthRoutes from './routes/health.routes.js';

import { pool, testConnection } from './config/database.js';
import { startScheduledJobs } from './jobs/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5009;

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(compression());
app.use(requestLogger);
app.use(rateLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/health', healthRoutes);

const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/stores', authMiddleware, storeRoutes);
apiRouter.use('/products', authMiddleware, productRoutes);
apiRouter.use('/categories', authMiddleware, categoryRoutes);
apiRouter.use('/inventory', authMiddleware, inventoryRoutes);
apiRouter.use('/customers', authMiddleware, customerRoutes);
apiRouter.use('/sales', authMiddleware, saleRoutes);
apiRouter.use('/custom-orders', authMiddleware, customOrderRoutes);
apiRouter.use('/weavers', authMiddleware, weaverRoutes);
apiRouter.use('/suppliers', authMiddleware, supplierRoutes);
apiRouter.use('/reports', authMiddleware, reportRoutes);

app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Saree & Textile Store Management API - Banarasi Silk Specialists',
    version: 'v1',
    features: ['Product Catalog', 'Custom Orders', 'GST Billing', 'Weaver Management', 'Inventory Tracking']
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await testConnection();
  startScheduledJobs();
  app.listen(PORT, () => {
    logger.info(`🧵 Saree & Textile Store API running on port ${PORT}`);
  });
};

startServer();
export default app;
