import cron from 'node-cron';
import { logger } from '../config/logger.js';

const sendDarshanReminders = cron.schedule('0 18 * * *', async () => {
  try {
    logger.info('Sending darshan booking reminders...');
    // Implementation would send SMS/Email reminders for next day darshan
    logger.info('Darshan reminders sent');
  } catch (error) {
    logger.error('Error in darshan reminder job:', error);
  }
});

const generateDailyDonationReport = cron.schedule('0 23 * * *', async () => {
  try {
    logger.info('Generating daily donation report...');
    // Implementation would generate and email daily donation summary
    logger.info('Daily donation report generated');
  } catch (error) {
    logger.error('Error in donation report job:', error);
  }
});

const checkPoojaSchedules = cron.schedule('*/30 * * * *', async () => {
  try {
    logger.info('Checking upcoming pooja schedules...');
    // Implementation would notify priests of upcoming poojas
    logger.info('Pooja schedule check completed');
  } catch (error) {
    logger.error('Error in pooja schedule job:', error);
  }
});

export const startScheduledJobs = () => {
  logger.info('Starting temple scheduled jobs...');
  sendDarshanReminders.start();
  generateDailyDonationReport.start();
  checkPoojaSchedules.start();
  logger.info('All temple scheduled jobs started');
};

export const stopScheduledJobs = () => {
  logger.info('Stopping temple scheduled jobs...');
  sendDarshanReminders.stop();
  generateDailyDonationReport.stop();
  checkPoojaSchedules.stop();
  logger.info('All temple scheduled jobs stopped');
};

export default { startScheduledJobs, stopScheduledJobs };
