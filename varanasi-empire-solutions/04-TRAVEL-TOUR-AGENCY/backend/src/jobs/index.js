import cron from 'node-cron';
import { logger } from '../config/logger.js';

const sendTravelReminders = cron.schedule('0 9 * * *', async () => {
  try {
    logger.info('Sending travel reminders for upcoming tours...');
    // Implementation would send reminders to customers
    logger.info('Travel reminders sent');
  } catch (error) {
    logger.error('Error in travel reminder job:', error);
  }
});

const checkPendingPayments = cron.schedule('0 10 * * *', async () => {
  try {
    logger.info('Checking pending payments...');
    // Implementation would follow up on pending payments
    logger.info('Pending payments check completed');
  } catch (error) {
    logger.error('Error in payment check job:', error);
  }
});

const generateDailyReport = cron.schedule('0 22 * * *', async () => {
  try {
    logger.info('Generating daily booking report...');
    // Implementation would generate and email daily reports
    logger.info('Daily report generated');
  } catch (error) {
    logger.error('Error in daily report job:', error);
  }
});

export const startScheduledJobs = () => {
  logger.info('Starting travel agency scheduled jobs...');
  sendTravelReminders.start();
  checkPendingPayments.start();
  generateDailyReport.start();
  logger.info('All travel agency jobs started');
};

export const stopScheduledJobs = () => {
  logger.info('Stopping travel agency jobs...');
  sendTravelReminders.stop();
  checkPendingPayments.stop();
  generateDailyReport.stop();
  logger.info('All travel agency jobs stopped');
};

export default { startScheduledJobs, stopScheduledJobs };
