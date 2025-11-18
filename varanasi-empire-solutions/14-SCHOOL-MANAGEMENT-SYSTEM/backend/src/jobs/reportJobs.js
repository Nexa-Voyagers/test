import cron from 'node-cron';
import { logger } from '../config/logger.js';

// Generate monthly reports on 1st of every month
cron.schedule('0 0 1 * *', async () => {
  try {
    logger.info('Running monthly report generation job...');
    // Implement report generation logic
  } catch (error) {
    logger.error('Report job error:', error);
  }
});

export default {};
