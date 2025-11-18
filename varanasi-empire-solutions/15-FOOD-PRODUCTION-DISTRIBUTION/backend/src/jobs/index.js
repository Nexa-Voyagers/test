import cron from 'node-cron';
import { logger } from '../config/logger.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';
import { reportService } from '../services/report.service.js';

export const startScheduledJobs = () => {
  // Check for low stock every day at 9 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      logger.info('Running daily low stock check...');
      const lowStockItems = await inventoryRepository.getLowStockItems();

      if (lowStockItems.length > 0) {
        logger.warn(`Low stock alert: ${lowStockItems.length} items below reorder point`);
        // TODO: Send email/SMS alerts
      }
    } catch (error) {
      logger.error('Error in low stock check job:', error);
    }
  });

  // Check for expiring batches every day at 10 AM
  cron.schedule('0 10 * * *', async () => {
    try {
      logger.info('Running daily expiry check...');
      const expiryReport = await reportService.getExpiryReport();

      if (expiryReport.length > 0) {
        logger.warn(`Expiry alert: ${expiryReport.length} batches expiring within 30 days`);
        // TODO: Send email/SMS alerts
      }
    } catch (error) {
      logger.error('Error in expiry check job:', error);
    }
  });

  // Generate daily production report at 11 PM
  cron.schedule('0 23 * * *', async () => {
    try {
      logger.info('Generating daily production report...');
      const report = await reportService.getProductionReport({
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
      });
      logger.info('Daily production report generated');
      // TODO: Save report or send to stakeholders
    } catch (error) {
      logger.error('Error generating production report:', error);
    }
  });

  // Clean up old logs every Sunday at 2 AM
  cron.schedule('0 2 * * 0', async () => {
    try {
      logger.info('Running weekly cleanup...');
      // TODO: Archive old logs and reports
      logger.info('Weekly cleanup completed');
    } catch (error) {
      logger.error('Error in cleanup job:', error);
    }
  });

  logger.info('✅ Scheduled jobs started');
};
