import cron from 'node-cron';
import { logger } from '../config/logger.js';

// Process scheme installments daily at 10 AM
cron.schedule('0 10 * * *', async () => {
  try {
    logger.info('Processing scheme installments...');
    // Implement scheme installment processing
  } catch (error) {
    logger.error('Scheme job error:', error);
  }
});

export default {};
