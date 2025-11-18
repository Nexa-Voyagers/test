import { pool, query, transaction } from '../config/database.js';

/**
 * Analytics Repository
 * Handles all database operations for analytics and reporting
 */
class AnalyticsRepository {
  /**
   * Create or update daily sales summary
   * @param {Object} summaryData - Daily summary data
   * @returns {Promise<Object>} Created/updated summary
   */
  async upsertDailySummary(summaryData) {
    const {
      store_id,
      summary_date,
      total_invoices,
      total_sales,
      total_cgst,
      total_sgst,
      cash_sales,
      card_sales,
      upi_sales,
      total_items_sold
    } = summaryData;

    const sql = `
      INSERT INTO daily_sales_summary (
        store_id, summary_date, total_invoices, total_sales,
        total_cgst, total_sgst, cash_sales, card_sales,
        upi_sales, total_items_sold
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (store_id, summary_date)
      DO UPDATE SET
        total_invoices = EXCLUDED.total_invoices,
        total_sales = EXCLUDED.total_sales,
        total_cgst = EXCLUDED.total_cgst,
        total_sgst = EXCLUDED.total_sgst,
        cash_sales = EXCLUDED.cash_sales,
        card_sales = EXCLUDED.card_sales,
        upi_sales = EXCLUDED.upi_sales,
        total_items_sold = EXCLUDED.total_items_sold,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      store_id, summary_date, total_invoices, total_sales,
      total_cgst, total_sgst, cash_sales, card_sales,
      upi_sales, total_items_sold
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Generate daily sales summary from sales_invoices
   * @param {number} storeId - Store ID
   * @param {Date} date - Date to generate summary for
   * @returns {Promise<Object>} Generated summary
   */
  async generateDailySummary(storeId, date) {
    const sql = `
      SELECT
        $1::integer as store_id,
        $2::date as summary_date,
        COUNT(*) as total_invoices,
        SUM(total_amount) as total_sales,
        SUM(cgst) as total_cgst,
        SUM(sgst) as total_sgst,
        SUM(CASE WHEN payment_method = 'CASH' THEN total_amount ELSE 0 END) as cash_sales,
        SUM(CASE WHEN payment_method = 'CARD' THEN total_amount ELSE 0 END) as card_sales,
        SUM(CASE WHEN payment_method = 'UPI' THEN total_amount ELSE 0 END) as upi_sales,
        (
          SELECT SUM(quantity)
          FROM sale_items sit
          INNER JOIN sales_invoices si2 ON sit.invoice_id = si2.invoice_id
          WHERE si2.store_id = $1
            AND DATE(si2.invoice_date) = $2
        ) as total_items_sold
      FROM sales_invoices
      WHERE store_id = $1
        AND DATE(invoice_date) = $2
    `;

    const result = await query(sql, [storeId, date]);
    const summaryData = result.rows[0];

    return await this.upsertDailySummary(summaryData);
  }

  /**
   * Get daily sales summary for a date range
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Daily summaries
   */
  async getDailySummaries(filters = {}) {
    let sql = `
      SELECT dss.*,
        s.store_name
      FROM daily_sales_summary dss
      LEFT JOIN textile_stores s ON dss.store_id = s.store_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND dss.store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.start_date) {
      sql += ` AND dss.summary_date >= $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      sql += ` AND dss.summary_date <= $${paramCount}`;
      values.push(filters.end_date);
      paramCount++;
    }

    sql += ' ORDER BY dss.summary_date DESC';

    if (filters.limit) {
      sql += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
    }

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get sales dashboard statistics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(filters = {}) {
    let sql = `
      SELECT
        COUNT(DISTINCT si.invoice_id) as total_invoices,
        SUM(si.total_amount) as total_sales,
        SUM(si.cgst + si.sgst) as total_gst,
        SUM(si.payment_received) as total_received,
        SUM(si.total_amount - si.payment_received) as total_outstanding,
        AVG(si.total_amount) as average_sale_value,
        COUNT(DISTINCT si.customer_id) as unique_customers,
        (
          SELECT SUM(quantity)
          FROM sale_items sit
          INNER JOIN sales_invoices si2 ON sit.invoice_id = si2.invoice_id
          WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    const conditions = [];
    if (filters.store_id) {
      conditions.push(`si2.store_id = $${paramCount}`);
      values.push(filters.store_id);
      paramCount++;
    }
    if (filters.start_date) {
      conditions.push(`si2.invoice_date >= $${paramCount}`);
      values.push(filters.start_date);
      paramCount++;
    }
    if (filters.end_date) {
      conditions.push(`si2.invoice_date <= $${paramCount}`);
      values.push(filters.end_date);
      paramCount++;
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ');
    }

    sql += `
        ) as total_items_sold
      FROM sales_invoices si
      WHERE 1=1
    `;

    let mainParamCount = 1;
    if (filters.store_id) {
      sql += ` AND si.store_id = $1`;
      mainParamCount++;
    }
    if (filters.start_date) {
      sql += ` AND si.invoice_date >= $${mainParamCount}`;
      mainParamCount++;
    }
    if (filters.end_date) {
      sql += ` AND si.invoice_date <= $${mainParamCount}`;
    }

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Get top selling products
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Top selling products
   */
  async getTopSellingProducts(filters = {}) {
    const { limit = 10, start_date, end_date, store_id } = filters;

    let sql = `
      SELECT
        p.product_id,
        p.product_name,
        p.product_code,
        p.fabric_type,
        p.weave_type,
        SUM(sit.quantity) as total_quantity_sold,
        SUM(sit.total_price) as total_revenue,
        COUNT(DISTINCT sit.invoice_id) as number_of_sales,
        AVG(sit.unit_price) as average_unit_price
      FROM sale_items sit
      INNER JOIN products p ON sit.product_id = p.product_id
      INNER JOIN sales_invoices si ON sit.invoice_id = si.invoice_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (store_id) {
      sql += ` AND si.store_id = $${paramCount}`;
      values.push(store_id);
      paramCount++;
    }

    if (start_date) {
      sql += ` AND si.invoice_date >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      sql += ` AND si.invoice_date <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    sql += `
      GROUP BY p.product_id, p.product_name, p.product_code, p.fabric_type, p.weave_type
      ORDER BY total_quantity_sold DESC
      LIMIT $${paramCount}
    `;
    values.push(limit);

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get inventory status report
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Object>} Inventory statistics
   */
  async getInventoryReport(storeId = null) {
    let sql = `
      SELECT
        COUNT(*) as total_products,
        SUM(stock_quantity) as total_stock_quantity,
        SUM(stock_quantity * retail_price) as total_stock_value,
        COUNT(CASE WHEN stock_quantity = 0 THEN 1 END) as out_of_stock_count,
        COUNT(CASE WHEN stock_quantity > 0 AND stock_quantity <= reorder_level THEN 1 END) as low_stock_count,
        COUNT(CASE WHEN stock_quantity > reorder_level THEN 1 END) as adequate_stock_count
      FROM products
      WHERE is_active = true
    `;
    const values = [];

    if (storeId) {
      sql += ' AND store_id = $1';
      values.push(storeId);
    }

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Get customer analytics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Customer analytics
   */
  async getCustomerAnalytics(filters = {}) {
    let sql = `
      SELECT
        COUNT(*) as total_customers,
        COUNT(CASE WHEN loyalty_tier = 'SILVER' THEN 1 END) as silver_customers,
        COUNT(CASE WHEN loyalty_tier = 'GOLD' THEN 1 END) as gold_customers,
        COUNT(CASE WHEN loyalty_tier = 'PLATINUM' THEN 1 END) as platinum_customers,
        SUM(total_purchases) as total_customer_purchases,
        SUM(outstanding_balance) as total_outstanding_balance,
        AVG(total_purchases) as average_customer_value,
        COUNT(CASE WHEN outstanding_balance > 0 THEN 1 END) as customers_with_outstanding
      FROM customers
      WHERE is_active = true
    `;
    const values = [];

    if (filters.store_id) {
      sql += ' AND store_id = $1';
      values.push(filters.store_id);
    }

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Get weaver performance analytics
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Weaver performance data
   */
  async getWeaverPerformance(filters = {}) {
    const { limit = 10, start_date, end_date } = filters;

    let sql = `
      SELECT
        w.weaver_id,
        w.weaver_name,
        w.specialization,
        w.quality_rating,
        COUNT(po.order_id) as total_orders,
        SUM(CASE WHEN po.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN po.status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(po.total_amount) as total_order_value,
        AVG(CASE WHEN po.status = 'COMPLETED' AND po.delivery_date IS NOT NULL
          THEN EXTRACT(DAY FROM (po.delivery_date - po.order_date))
        END) as avg_delivery_days
      FROM weavers w
      LEFT JOIN purchase_orders po ON w.weaver_id = po.weaver_id
      WHERE w.is_active = true
    `;
    const values = [];
    let paramCount = 1;

    if (start_date) {
      sql += ` AND po.order_date >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      sql += ` AND po.order_date <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    sql += `
      GROUP BY w.weaver_id, w.weaver_name, w.specialization, w.quality_rating
      ORDER BY total_order_value DESC
      LIMIT $${paramCount}
    `;
    values.push(limit);

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get sales by payment method
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Sales by payment method
   */
  async getSalesByPaymentMethod(filters = {}) {
    let sql = `
      SELECT
        payment_method,
        COUNT(*) as transaction_count,
        SUM(total_amount) as total_sales,
        AVG(total_amount) as average_transaction_value
      FROM sales_invoices
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.start_date) {
      sql += ` AND invoice_date >= $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      sql += ` AND invoice_date <= $${paramCount}`;
      values.push(filters.end_date);
      paramCount++;
    }

    sql += `
      GROUP BY payment_method
      ORDER BY total_sales DESC
    `;

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get sales trends (daily/weekly/monthly)
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Sales trend data
   */
  async getSalesTrends(filters = {}) {
    const { period = 'daily', start_date, end_date, store_id } = filters;

    let dateFormat;
    switch (period) {
      case 'weekly':
        dateFormat = "TO_CHAR(invoice_date, 'IYYY-IW')";
        break;
      case 'monthly':
        dateFormat = "TO_CHAR(invoice_date, 'YYYY-MM')";
        break;
      default:
        dateFormat = "DATE(invoice_date)";
    }

    let sql = `
      SELECT
        ${dateFormat} as period,
        COUNT(*) as total_invoices,
        SUM(total_amount) as total_sales,
        AVG(total_amount) as average_sale,
        SUM(cgst + sgst) as total_gst
      FROM sales_invoices
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (store_id) {
      sql += ` AND store_id = $${paramCount}`;
      values.push(store_id);
      paramCount++;
    }

    if (start_date) {
      sql += ` AND invoice_date >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      sql += ` AND invoice_date <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    sql += `
      GROUP BY period
      ORDER BY period DESC
    `;

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get product category performance
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Category performance data
   */
  async getCategoryPerformance(filters = {}) {
    const { start_date, end_date, store_id } = filters;

    let sql = `
      SELECT
        c.category_id,
        c.category_name,
        COUNT(DISTINCT p.product_id) as total_products,
        SUM(p.stock_quantity) as total_stock,
        SUM(sit.quantity) as total_quantity_sold,
        SUM(sit.total_price) as total_revenue,
        COUNT(DISTINCT sit.invoice_id) as number_of_sales
      FROM product_categories c
      LEFT JOIN products p ON c.category_id = p.category_id
      LEFT JOIN sale_items sit ON p.product_id = sit.product_id
      LEFT JOIN sales_invoices si ON sit.invoice_id = si.invoice_id
      WHERE c.is_active = true
    `;
    const values = [];
    let paramCount = 1;

    if (store_id) {
      sql += ` AND p.store_id = $${paramCount}`;
      values.push(store_id);
      paramCount++;
    }

    if (start_date) {
      sql += ` AND si.invoice_date >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      sql += ` AND si.invoice_date <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    sql += `
      GROUP BY c.category_id, c.category_name
      ORDER BY total_revenue DESC
    `;

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get custom order analytics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Custom order statistics
   */
  async getCustomOrderAnalytics(filters = {}) {
    let sql = `
      SELECT
        COUNT(*) as total_custom_orders,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(CASE WHEN status NOT IN ('COMPLETED', 'CANCELLED') THEN 1 ELSE 0 END) as pending_orders,
        SUM(estimated_price) as total_estimated_value,
        SUM(final_price) as total_final_value,
        AVG(quality_rating) as average_quality_rating,
        AVG(CASE WHEN status = 'COMPLETED' AND delivery_date IS NOT NULL
          THEN EXTRACT(DAY FROM (delivery_date - order_date))
        END) as avg_completion_days
      FROM custom_orders
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.start_date) {
      sql += ` AND order_date >= $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      sql += ` AND order_date <= $${paramCount}`;
      values.push(filters.end_date);
    }

    const result = await query(sql, values);
    return result.rows[0];
  }
}

export default new AnalyticsRepository();
