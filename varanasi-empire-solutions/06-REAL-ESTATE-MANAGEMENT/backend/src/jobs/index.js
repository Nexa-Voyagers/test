import cron from 'node-cron';
import { logger } from '../config/logger.js';
import { query } from '../config/database.js';

/**
 * Start all scheduled jobs
 */
export const startScheduledJobs = () => {
  logger.info('Initializing scheduled jobs for Real Estate Management...');

  // Send follow-up reminders - runs every day at 9 AM
  scheduleFollowUpReminders();

  // Check RERA expiry - runs daily at 8 AM
  checkRERAExpiry();

  // Generate daily reports - runs at 11:59 PM
  generateDailyReports();

  // Clean old data - runs weekly on Sunday at 2 AM
  cleanOldData();

  logger.info('All scheduled jobs initialized');
};

/**
 * Send follow-up reminders for enquiries
 */
const scheduleFollowUpReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running follow-up reminders job...');

    try {
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() - parseInt(process.env.LEAD_FOLLOWUP_REMINDER_DAYS || 3));

      const sql = `
        SELECT e.id, e.customer_name, e.customer_phone, e.customer_email,
               a.agent_name, a.phone as agent_phone
        FROM enquiries e
        JOIN agents a ON e.assigned_agent_id = a.id
        WHERE e.status = 'OPEN'
          AND e.last_followup_date < $1
          AND e.next_followup_date IS NOT NULL
      `;

      const result = await query(sql, [reminderDate]);

      logger.info(`Found ${result.rows.length} enquiries requiring follow-up`);

      // Here you would send SMS/Email notifications to agents
      // This is a placeholder for the actual notification logic

    } catch (error) {
      logger.error('Error in follow-up reminders job:', error.message);
    }
  });
};

/**
 * Check RERA registration expiry
 */
const checkRERAExpiry = () => {
  cron.schedule('0 8 * * *', async () => {
    logger.info('Checking RERA registration expiry...');

    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days notice

      const sql = `
        SELECT id, agency_name, rera_registration_number, rera_validity_date
        FROM agencies
        WHERE rera_registered = true
          AND rera_validity_date <= $1
          AND is_active = true
      `;

      const result = await query(sql, [expiryDate]);

      if (result.rows.length > 0) {
        logger.warn(`RERA expiry alert: ${result.rows.length} agencies have RERA registration expiring soon`);
        // Send notifications to agency admins
      }

    } catch (error) {
      logger.error('Error in RERA expiry check:', error.message);
    }
  });
};

/**
 * Generate daily reports
 */
const generateDailyReports = () => {
  cron.schedule('59 23 * * *', async () => {
    logger.info('Generating daily reports...');

    try {
      const today = new Date().toISOString().split('T')[0];

      const sql = `
        INSERT INTO daily_reports (
          report_date,
          total_enquiries,
          total_site_visits,
          total_deals_closed,
          total_revenue,
          active_properties
        )
        SELECT
          $1::date,
          (SELECT COUNT(*) FROM enquiries WHERE DATE(created_at) = $1),
          (SELECT COUNT(*) FROM site_visits WHERE DATE(visit_date) = $1),
          (SELECT COUNT(*) FROM deals WHERE DATE(deal_date) = $1 AND status = 'CLOSED'),
          (SELECT COALESCE(SUM(deal_amount), 0) FROM deals WHERE DATE(deal_date) = $1 AND status = 'CLOSED'),
          (SELECT COUNT(*) FROM properties WHERE status = 'AVAILABLE')
      `;

      await query(sql, [today]);

      logger.info('Daily report generated successfully');

    } catch (error) {
      logger.error('Error generating daily report:', error.message);
    }
  });
};

/**
 * Clean old data
 */
const cleanOldData = () => {
  cron.schedule('0 2 * * 0', async () => {
    logger.info('Cleaning old data...');

    try {
      // Delete old logs (older than 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      await query(
        'DELETE FROM activity_logs WHERE created_at < $1',
        [ninetyDaysAgo]
      );

      logger.info('Old data cleaned successfully');

    } catch (error) {
      logger.error('Error cleaning old data:', error.message);
    }
  });
};

export default { startScheduledJobs };
