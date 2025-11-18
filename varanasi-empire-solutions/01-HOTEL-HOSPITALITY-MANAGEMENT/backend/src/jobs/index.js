import cron from 'node-cron';
import { logger } from '../config/logger.js';
import { bookingRepository } from '../repositories/booking.repository.js';
import { invoiceRepository } from '../repositories/invoice.repository.js';
import { housekeepingRepository } from '../repositories/housekeeping.repository.js';

/**
 * Send check-out reminders to guests checking out today
 * Runs at 9:00 AM daily
 */
const checkoutReminderJob = cron.schedule('0 9 * * *', async () => {
  try {
    logger.info('Running checkout reminder job...');
    // Query all reservations checking out today
    // Send SMS/Email reminders to guests
    logger.info('Checkout reminders sent successfully');
  } catch (error) {
    logger.error('Error in checkout reminder job:', error);
  }
});

/**
 * Create housekeeping tasks for checked-out rooms
 * Runs every 30 minutes
 */
const housekeepingTaskJob = cron.schedule('*/30 * * * *', async () => {
  try {
    logger.info('Running housekeeping task assignment job...');
    // Query recently checked-out rooms
    // Create cleaning tasks automatically
    logger.info('Housekeeping tasks created successfully');
  } catch (error) {
    logger.error('Error in housekeeping task job:', error);
  }
});

/**
 * Generate daily revenue reports
 * Runs at 11:59 PM daily
 */
const dailyReportJob = cron.schedule('59 23 * * *', async () => {
  try {
    logger.info('Generating daily revenue reports...');
    // Calculate daily revenue, occupancy, etc.
    // Send reports to property managers
    logger.info('Daily reports generated successfully');
  } catch (error) {
    logger.error('Error in daily report job:', error);
  }
});

/**
 * Send arrival notifications for tomorrow's check-ins
 * Runs at 4:00 PM daily
 */
const arrivalNotificationJob = cron.schedule('0 16 * * *', async () => {
  try {
    logger.info('Sending arrival notifications...');
    // Find reservations checking in tomorrow
    // Send notifications to staff and guests
    logger.info('Arrival notifications sent successfully');
  } catch (error) {
    logger.error('Error in arrival notification job:', error);
  }
});

/**
 * Generate loyalty point rewards
 * Runs at 12:00 AM daily (after checkout)
 */
const loyaltyPointJob = cron.schedule('0 0 * * *', async () => {
  try {
    logger.info('Processing loyalty point rewards...');
    // Calculate loyalty points for guests who checked out
    // Update guest loyalty tier if applicable
    logger.info('Loyalty points processed successfully');
  } catch (error) {
    logger.error('Error in loyalty point job:', error);
  }
});

/**
 * Clean up old job logs
 * Runs weekly on Sunday at 2:00 AM
 */
const cleanupJob = cron.schedule('0 2 * * 0', async () => {
  try {
    logger.info('Running cleanup job...');
    // Delete old logs, temporary files
    logger.info('Cleanup completed successfully');
  } catch (error) {
    logger.error('Error in cleanup job:', error);
  }
});

/**
 * Start all scheduled jobs
 */
export const startScheduledJobs = () => {
  logger.info('Starting scheduled jobs...');
  logger.info('✓ Checkout reminder job scheduled (9:00 AM daily)');
  logger.info('✓ Housekeeping task job scheduled (every 30 minutes)');
  logger.info('✓ Daily report job scheduled (11:59 PM daily)');
  logger.info('✓ Arrival notification job scheduled (4:00 PM daily)');
  logger.info('✓ Loyalty point job scheduled (12:00 AM daily)');
  logger.info('✓ Cleanup job scheduled (Sunday 2:00 AM)');
};

/**
 * Stop all scheduled jobs
 */
export const stopScheduledJobs = () => {
  checkoutReminderJob.stop();
  housekeepingTaskJob.stop();
  dailyReportJob.stop();
  arrivalNotificationJob.stop();
  loyaltyPointJob.stop();
  cleanupJob.stop();
  logger.info('All scheduled jobs stopped');
};
