import cron from 'node-cron';
import { logger } from '../config/logger.js';
export const startScheduledJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running daily cleanup...');
  });
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running daily reports...');
  });
  logger.info('✅ Scheduled jobs started');
};
