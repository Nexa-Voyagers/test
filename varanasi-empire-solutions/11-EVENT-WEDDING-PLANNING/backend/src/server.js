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
