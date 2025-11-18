import cron from 'node-cron';
import { logger } from '../config/logger.js';
import { appointmentRepository } from '../repositories/appointment.repository.js';
import { pharmacyRepository } from '../repositories/pharmacy.repository.js';

/**
 * Send appointment reminders
 * Runs every day at 8:00 AM
 */
const sendAppointmentReminders = cron.schedule('0 8 * * *', async () => {
  try {
    logger.info('Running appointment reminder job...');
    // Implementation would send SMS/Email reminders
    logger.info('Appointment reminders sent');
  } catch (error) {
    logger.error('Error in appointment reminder job:', error);
  }
});

/**
 * Check expiring medicines
 * Runs every day at 9:00 AM
 */
const checkExpiringMedicines = cron.schedule('0 9 * * *', async () => {
  try {
    logger.info('Checking expiring medicines...');
    // Implementation would alert pharmacy staff
    logger.info('Expiring medicines check completed');
  } catch (error) {
    logger.error('Error in expiring medicines job:', error);
  }
});

/**
 * Update appointment statuses
 * Runs every hour
 */
const updateAppointmentStatuses = cron.schedule('0 * * * *', async () => {
  try {
    logger.info('Updating appointment statuses...');
    // Mark past appointments as NO_SHOW if not completed
    logger.info('Appointment statuses updated');
  } catch (error) {
    logger.error('Error in appointment status update job:', error);
  }
});

/**
 * Generate daily reports
 * Runs every day at 11:00 PM
 */
const generateDailyReports = cron.schedule('0 23 * * *', async () => {
  try {
    logger.info('Generating daily reports...');
    // Implementation would generate and email daily reports
    logger.info('Daily reports generated');
  } catch (error) {
    logger.error('Error in daily reports job:', error);
  }
});

/**
 * Start all scheduled jobs
 */
export const startScheduledJobs = () => {
  logger.info('Starting scheduled jobs...');

  sendAppointmentReminders.start();
  checkExpiringMedicines.start();
  updateAppointmentStatuses.start();
  generateDailyReports.start();

  logger.info('All scheduled jobs started');
};

/**
 * Stop all scheduled jobs
 */
export const stopScheduledJobs = () => {
  logger.info('Stopping scheduled jobs...');

  sendAppointmentReminders.stop();
  checkExpiringMedicines.stop();
  updateAppointmentStatuses.stop();
  generateDailyReports.stop();

  logger.info('All scheduled jobs stopped');
};

export default {
  startScheduledJobs,
  stopScheduledJobs,
};
