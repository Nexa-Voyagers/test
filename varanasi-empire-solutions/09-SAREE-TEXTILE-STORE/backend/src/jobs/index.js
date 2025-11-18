import cron from 'node-cron';
import { logger } from '../config/logger.js';
import { query } from '../config/database.js';

export const startScheduledJobs = () => {
  logger.info('Initializing Saree Store scheduled jobs...');
  
  // Low stock alert - every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    logger.info('Checking low stock items...');
    try {
      const result = await query(
        'SELECT * FROM inventory WHERE quantity < min_stock_level'
      );
      if (result.rows.length > 0) {
        logger.warn(`Low stock alert: ${result.rows.length} items below minimum level`);
      }
    } catch (error) {
      logger.error('Low stock check failed:', error);
    }
  });
  
  // Daily sales report - 11:59 PM
  cron.schedule('59 23 * * *', async () => {
    logger.info('Generating daily sales report...');
    try {
      const today = new Date().toISOString().split('T')[0];
      await query(
        'INSERT INTO daily_sales_reports (report_date) VALUES ($1)',
        [today]
      );
    } catch (error) {
      logger.error('Daily report generation failed:', error);
    }
  });
  
  logger.info('Scheduled jobs initialized');
};

export default { startScheduledJobs };
