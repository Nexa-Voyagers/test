import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const orderRepository = {
  async create(data) {
    const query = `
      INSERT INTO distribution_orders (
        order_number, distributor_id, order_date, delivery_date, priority,
        subtotal, discount_amount, tax_amount, delivery_charge, total_amount,
        payment_terms, payment_status, paid_amount, payment_date, status,
        shipping_address, delivery_instructions, approved_by, notes, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `;

    const values = [
      data.order_number, data.distributor_id, data.order_date,
      data.delivery_date, data.priority || 'normal', data.subtotal,
      data.discount_amount || 0, data.tax_amount, data.delivery_charge || 0,
      data.total_amount, data.payment_terms, data.payment_status || 'pending',
      data.paid_amount || 0, data.payment_date, data.status || 'pending',
      data.shipping_address, data.delivery_instructions, data.approved_by,
      data.notes, data.metadata || {}
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async createItem(data) {
    const query = `
      INSERT INTO order_items (
        order_id, product_id, batch_id, quantity, unit_price, discount,
        tax_rate, tax_amount, total, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      data.order_id, data.product_id, data.batch_id, data.quantity,
      data.unit_price, data.discount || 0, data.tax_rate, data.tax_amount,
      data.total, data.notes
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = `
      SELECT do.*, d.name as distributor_name, d.city as distributor_city
      FROM distribution_orders do
      LEFT JOIN distributors d ON do.distributor_id = d.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.distributor_id) {
      query += ` AND do.distributor_id = $${paramCount}`;
      values.push(filters.distributor_id);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND do.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.payment_status) {
      query += ` AND do.payment_status = $${paramCount}`;
      values.push(filters.payment_status);
      paramCount++;
    }

    if (filters.from_date) {
      query += ` AND do.order_date >= $${paramCount}`;
      values.push(filters.from_date);
      paramCount++;
    }

    if (filters.to_date) {
      query += ` AND do.order_date <= $${paramCount}`;
      values.push(filters.to_date);
      paramCount++;
    }

    query += ' ORDER BY do.order_date DESC, do.created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  },

  async findById(id) {
    const query = `
      SELECT do.*, d.name as distributor_name, d.contact_person, d.contact_phone
      FROM distribution_orders do
      LEFT JOIN distributors d ON do.distributor_id = d.id
      WHERE do.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Order not found');
    }

    return result.rows[0];
  },

  async findByOrderNumber(orderNumber) {
    const query = 'SELECT * FROM distribution_orders WHERE order_number = $1';
    const result = await pool.query(query, [orderNumber]);
    return result.rows[0];
  },

  async findOrderItems(orderId) {
    const query = `
      SELECT oi.*, p.name as product_name, p.sku, pb.batch_number
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN production_batches pb ON oi.batch_id = pb.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at ASC
    `;
    const result = await pool.query(query, [orderId]);
    return result.rows;
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE distribution_orders
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Order not found');
    }

    return result.rows[0];
  },

  async updateStatus(id, status, notes = null) {
    const query = `
      UPDATE distribution_orders
      SET status = $1, notes = COALESCE($2, notes), updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [status, notes, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Order not found');
    }

    return result.rows[0];
  },

  async getSalesStats(filters = {}) {
    let query = `
      SELECT
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        SUM(paid_amount) as total_collected,
        AVG(total_amount) as avg_order_value,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders
      FROM distribution_orders
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.distributor_id) {
      query += ` AND distributor_id = $${paramCount}`;
      values.push(filters.distributor_id);
      paramCount++;
    }

    if (filters.from_date) {
      query += ` AND order_date >= $${paramCount}`;
      values.push(filters.from_date);
      paramCount++;
    }

    if (filters.to_date) {
      query += ` AND order_date <= $${paramCount}`;
      values.push(filters.to_date);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  },
};
