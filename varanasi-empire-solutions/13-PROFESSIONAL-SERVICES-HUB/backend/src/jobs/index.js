import cron from 'node-cron';
import { logger } from '../config/logger.js';

export const startScheduledJobs = () => {
  logger.info('Scheduled jobs initialized');
  
  cron.schedule('0 0 * * *', () => {
    logger.info('Daily maintenance task running');
  });
};

export default { startScheduledJobs };
