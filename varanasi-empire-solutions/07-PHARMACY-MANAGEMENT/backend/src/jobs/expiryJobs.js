import cron from 'node-cron';
import { logger } from '../config/logger.js';

// Check for expiring drugs daily at 8 AM
cron.schedule('0 8 * * *', async () => {
  try {
    logger.info('Running drug expiry check...');
    // Implement expiry alert logic
  } catch (error) {
    logger.error('Expiry job error:', error);
  }
});

export default {};
