import cron from 'node-cron';
import { logger } from '../config/logger.js';

// Update gold/silver rates every hour
cron.schedule('0 * * * *', async () => {
  try {
    logger.info('Updating metal rates...');
    // Implement rate update from external API
  } catch (error) {
    logger.error('Rate update job error:', error);
  }
});

export default {};
