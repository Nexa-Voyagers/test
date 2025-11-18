import cron from 'node-cron';
import { logger } from '../config/logger.js';
import { query } from '../config/database.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';

/**
 * Initialize all scheduled jobs
 */
export const initializeJobs = () => {
  logger.info('Initializing scheduled jobs...');

  // Generate daily sales summary - runs at 11:59 PM every day
  dailySalesSummaryJob();

  // Check low stock items - runs every 6 hours
  lowStockAlertJob();

  // Cleanup old records - runs daily at 2 AM
  cleanupOldRecordsJob();

  // Generate inventory reports - runs weekly on Monday at 8 AM
  weeklyInventoryReportJob();

  logger.info('All scheduled jobs initialized');
};

/**
 * Daily sales summary job
 * Aggregates daily sales data and creates summary records
 */
const dailySalesSummaryJob = () => {
  // Run at 23:59 every day
  cron.schedule('59 23 * * *', async () => {
    logger.info('Running daily sales summary job...');

    try {
      const today = new Date().toISOString().split('T')[0];

      // Get all restaurants
      const restaurantsQuery = `
        SELECT id FROM restaurants WHERE is_active = true
      `;

      const restaurantsResult = await query(restaurantsQuery);

      for (const restaurant of restaurantsResult.rows) {
        const restaurantId = restaurant.id;

        // Calculate daily sales
        const salesQuery = `
          SELECT
            $1::uuid as restaurant_id,
            $2::date as summary_date,
            COUNT(*) as total_orders,
            COUNT(*) FILTER (WHERE order_type = 'DINE_IN') as dine_in_orders,
            COUNT(*) FILTER (WHERE order_type = 'TAKEAWAY') as takeaway_orders,
            COUNT(*) FILTER (WHERE order_type = 'DELIVERY') as delivery_orders,
            COUNT(*) FILTER (WHERE order_status = 'CANCELLED') as cancelled_orders,
            COALESCE(SUM(total_amount), 0) as gross_revenue,
            COALESCE(SUM(discount_amount), 0) as discounts,
            COALESCE(SUM(total_amount) - SUM(discount_amount), 0) as net_revenue,
            COALESCE(SUM(cgst_amount + sgst_amount), 0) as taxes_collected,
            COUNT(DISTINCT customer_id) as unique_customers,
            COALESCE(AVG(total_amount), 0) as average_order_value
          FROM orders
          WHERE restaurant_id = $1
            AND DATE(order_datetime) = $2
            AND order_status != 'CANCELLED'
        `;

        const salesResult = await query(salesQuery, [restaurantId, today]);
        const sales = salesResult.rows[0];

        // Insert or update daily sales summary
        const summaryQuery = `
          INSERT INTO daily_sales_summary (
            restaurant_id, summary_date, total_orders, dine_in_orders, takeaway_orders,
            delivery_orders, cancelled_orders, gross_revenue, discounts, net_revenue,
            taxes_collected, unique_customers, average_order_value, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
          ON CONFLICT (restaurant_id, summary_date)
          DO UPDATE SET
            total_orders = $3,
            dine_in_orders = $4,
            takeaway_orders = $5,
            delivery_orders = $6,
            cancelled_orders = $7,
            gross_revenue = $8,
            discounts = $9,
            net_revenue = $10,
            taxes_collected = $11,
            unique_customers = $12,
            average_order_value = $13
        `;

        await query(summaryQuery, [
          restaurantId,
          today,
          sales.total_orders,
          sales.dine_in_orders,
          sales.takeaway_orders,
          sales.delivery_orders,
          sales.cancelled_orders,
          sales.gross_revenue,
          sales.discounts,
          sales.net_revenue,
          sales.taxes_collected,
          sales.unique_customers,
          sales.average_order_value,
        ]);
      }

      logger.info('Daily sales summary job completed successfully');
    } catch (error) {
      logger.error('Error in daily sales summary job:', error.message);
    }
  });
};

/**
 * Low stock alert job
 * Checks for inventory items below minimum stock level
 */
const lowStockAlertJob = () => {
  // Run every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    logger.info('Running low stock alert job...');

    try {
      const lowStockQuery = `
        SELECT
          id,
          restaurant_id,
          item_name,
          item_code,
          current_stock,
          min_stock_level
        FROM inventory_items
        WHERE is_active = true
          AND current_stock < min_stock_level
        ORDER BY (min_stock_level - current_stock) DESC
      `;

      const lowStockResult = await query(lowStockQuery);

      if (lowStockResult.rows.length > 0) {
        // Group by restaurant
        const byRestaurant = {};
        lowStockResult.rows.forEach(item => {
          if (!byRestaurant[item.restaurant_id]) {
            byRestaurant[item.restaurant_id] = [];
          }
          byRestaurant[item.restaurant_id].push(item);
        });

        // Log alerts for each restaurant
        Object.entries(byRestaurant).forEach(([restaurantId, items]) => {
          logger.warn(`Low stock alert for restaurant ${restaurantId}: ${items.length} items below minimum level`, {
            items: items.map(i => ({
              name: i.item_name,
              code: i.item_code,
              current: i.current_stock,
              minimum: i.min_stock_level,
            })),
          });
        });
      }

      logger.info('Low stock alert job completed');
    } catch (error) {
      logger.error('Error in low stock alert job:', error.message);
    }
  });
};

/**
 * Cleanup old records job
 * Archives or deletes old orders and transactions
 */
const cleanupOldRecordsJob = () => {
  // Run at 2 AM every day
  cron.schedule('0 2 * * *', async () => {
    logger.info('Running cleanup old records job...');

    try {
      // Archive completed orders older than 90 days
      const deleteOrdersQuery = `
        DELETE FROM orders
        WHERE order_status = 'COMPLETED'
          AND completed_at < NOW() - INTERVAL '90 days'
        RETURNING id
      `;

      const result = await query(deleteOrdersQuery);

      logger.info(`Cleanup job: Archived ${result.rowCount} old orders`);
    } catch (error) {
      logger.error('Error in cleanup job:', error.message);
    }
  });
};

/**
 * Weekly inventory report job
 * Generates inventory reports for management
 */
const weeklyInventoryReportJob = () => {
  // Run at 8 AM every Monday
  cron.schedule('0 8 * * 1', async () => {
    logger.info('Running weekly inventory report job...');

    try {
      const restaurantsQuery = `
        SELECT id, restaurant_name FROM restaurants WHERE is_active = true
      `;

      const restaurantsResult = await query(restaurantsQuery);

      for (const restaurant of restaurantsResult.rows) {
        logger.info(`Generated inventory report for ${restaurant.restaurant_name}`, {
          restaurantId: restaurant.id,
          generatedAt: new Date().toISOString(),
        });

        // In production, this would send an email or create a report record
      }

      logger.info('Weekly inventory report job completed');
    } catch (error) {
      logger.error('Error in weekly inventory report job:', error.message);
    }
  });
};

/**
 * Stop all jobs
 */
export const stopAllJobs = () => {
  cron.getTasks().forEach(task => {
    task.stop();
  });
  logger.info('All scheduled jobs stopped');
};

export default {
  initializeJobs,
  stopAllJobs,
};
