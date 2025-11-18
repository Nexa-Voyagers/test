import cron from 'node-cron';
import { logger } from '../config/logger.js';

// Send reminders for pending tasks at 10 AM
cron.schedule('0 10 * * *', async () => {
  try {
    logger.info('Sending pending task reminders...');
    // Implement reminder logic
  } catch (error) {
    logger.error('Reminder job error:', error);
  }
});

export default {};
