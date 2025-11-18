import { pool } from '../config/database.js';
import { productionRepository } from '../repositories/production.repository.js';
import { qualityRepository } from '../repositories/quality.repository.js';
import { orderRepository } from '../repositories/order.repository.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';

export const reportService = {
  async getProductionReport(filters = {}) {
    const stats = await productionRepository.getProductionStats(filters);
    const batches = await productionRepository.findAll({ ...filters, limit: 100 });

    return {
      stats,
      batches,
      generated_at: new Date(),
    };
  },

  async getQualityReport(filters = {}) {
    const stats = await qualityRepository.getQualityStats(filters);
    const checks = await qualityRepository.findAll({ ...filters, limit: 100 });

    const passRate = stats[0] ? (stats[0].passed / stats[0].total_checks * 100).toFixed(2) : 0;

    return {
      pass_rate: passRate,
      stats,
      checks,
      generated_at: new Date(),
    };
  },

  async getSalesReport(filters = {}) {
    const stats = await orderRepository.getSalesStats(filters);
    const orders = await orderRepository.findAll({ ...filters, limit: 100 });

    return {
      stats,
      orders,
      generated_at: new Date(),
    };
  },

  async getInventoryReport(filters = {}) {
    const inventory = await inventoryRepository.findAll(filters);
    const value = await inventoryRepository.getInventoryValue(filters.unit_id);
    const lowStock = await inventoryRepository.getLowStockItems(filters.unit_id);

    return {
      inventory,
      value,
      low_stock_items: lowStock,
      low_stock_count: lowStock.length,
      generated_at: new Date(),
    };
  },

  async getDashboardStats() {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM production_units WHERE status = 'active') as active_units,
        (SELECT COUNT(*) FROM products WHERE status = 'active') as active_products,
        (SELECT COUNT(*) FROM production_batches WHERE status = 'in_progress') as active_batches,
        (SELECT COUNT(*) FROM distribution_orders WHERE status IN ('pending', 'approved', 'processing')) as pending_orders,
        (SELECT COUNT(*) FROM quality_checks WHERE DATE(check_date) = CURRENT_DATE) as today_qc_checks,
        (SELECT COUNT(*) FROM inventory WHERE current_stock <= reorder_point) as low_stock_alerts,
        (SELECT COALESCE(SUM(quantity_produced), 0) FROM production_batches WHERE DATE(created_at) = CURRENT_DATE) as today_production,
        (SELECT COALESCE(SUM(total_amount), 0) FROM distribution_orders WHERE DATE(order_date) = CURRENT_DATE) as today_sales
    `;

    const result = await pool.query(query);
    return result.rows[0];
  },

  async getDistributorPerformance(filters = {}) {
    let query = `
      SELECT
        d.id,
        d.name,
        d.city,
        COUNT(DISTINCT do.id) as total_orders,
        SUM(do.total_amount) as total_business,
        SUM(do.paid_amount) as total_paid,
        SUM(CASE WHEN do.payment_status = 'paid' THEN 1 ELSE 0 END) as on_time_payments,
        AVG(EXTRACT(EPOCH FROM (do.updated_at - do.created_at))/86400) as avg_delivery_days
      FROM distributors d
      LEFT JOIN distribution_orders do ON d.id = do.distributor_id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.from_date) {
      query += ` AND do.order_date >= $${paramCount}`;
      values.push(filters.from_date);
      paramCount++;
    }

    if (filters.to_date) {
      query += ` AND do.order_date <= $${paramCount}`;
      values.push(filters.to_date);
    }

    query += ' GROUP BY d.id, d.name, d.city ORDER BY total_business DESC';

    const result = await pool.query(query, values);
    return result.rows;
  },

  async getProductPerformance(filters = {}) {
    let query = `
      SELECT
        p.id,
        p.name,
        p.sku,
        p.category,
        COUNT(DISTINCT pb.id) as batches_produced,
        SUM(pb.quantity_produced) as total_quantity,
        COUNT(DISTINCT oi.order_id) as orders_count,
        SUM(oi.quantity) as quantity_sold,
        SUM(oi.total) as revenue
      FROM products p
      LEFT JOIN production_batches pb ON p.id = pb.product_id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND p.category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.from_date) {
      query += ` AND pb.production_date >= $${paramCount}`;
      values.push(filters.from_date);
    }

    query += ' GROUP BY p.id, p.name, p.sku, p.category ORDER BY revenue DESC';

    const result = await pool.query(query, values);
    return result.rows;
  },

  async getExpiryReport() {
    const query = `
      SELECT
        pb.id,
        pb.batch_number,
        pb.expiry_date,
        p.name as product_name,
        p.sku,
        pu.name as unit_name,
        i.current_stock,
        EXTRACT(DAY FROM (pb.expiry_date - CURRENT_DATE)) as days_to_expiry
      FROM production_batches pb
      LEFT JOIN products p ON pb.product_id = p.id
      LEFT JOIN production_units pu ON pb.unit_id = pu.id
      LEFT JOIN inventory i ON (pb.product_id = i.product_id AND pb.unit_id = i.unit_id)
      WHERE pb.expiry_date IS NOT NULL
        AND pb.expiry_date > CURRENT_DATE
        AND pb.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY pb.expiry_date ASC
    `;

    const result = await pool.query(query);
    return result.rows;
  },
};
