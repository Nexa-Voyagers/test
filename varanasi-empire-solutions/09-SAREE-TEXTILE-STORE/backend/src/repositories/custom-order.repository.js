import { pool, query, transaction } from '../config/database.js';

/**
 * Custom Order Repository
 * Handles all database operations for custom orders
 */
class CustomOrderRepository {
  /**
   * Create a new custom order
   * @param {Object} orderData - Custom order information
   * @returns {Promise<Object>} Created custom order
   */
  async create(orderData) {
    const {
      store_id,
      customer_id,
      order_number,
      order_date,
      fabric_type,
      design_requirements,
      measurements,
      colors,
      work_type,
      occasion,
      reference_images,
      weaver_id,
      estimated_price,
      advance_amount,
      expected_delivery_date,
      status,
      notes
    } = orderData;

    const sql = `
      INSERT INTO custom_orders (
        store_id, customer_id, order_number, order_date,
        fabric_type, design_requirements, measurements, colors,
        work_type, occasion, reference_images, weaver_id,
        estimated_price, advance_amount, expected_delivery_date,
        status, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const values = [
      store_id,
      customer_id,
      order_number,
      order_date || new Date(),
      fabric_type,
      design_requirements || null,
      measurements ? JSON.stringify(measurements) : null,
      colors || null,
      work_type || null,
      occasion || null,
      reference_images ? JSON.stringify(reference_images) : null,
      weaver_id || null,
      estimated_price || null,
      advance_amount || 0,
      expected_delivery_date || null,
      status || 'DESIGN_PENDING',
      notes || null
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Find custom order by ID
   * @param {number} id - Order ID
   * @returns {Promise<Object|null>} Custom order or null
   */
  async findById(id) {
    const sql = `
      SELECT co.*,
        c.customer_name,
        c.phone as customer_phone,
        c.email as customer_email,
        w.weaver_name,
        w.contact_person as weaver_contact,
        w.phone as weaver_phone,
        s.store_name
      FROM custom_orders co
      LEFT JOIN customers c ON co.customer_id = c.customer_id
      LEFT JOIN weavers w ON co.weaver_id = w.weaver_id
      LEFT JOIN textile_stores s ON co.store_id = s.store_id
      WHERE co.order_id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find custom order by order number
   * @param {string} orderNumber - Order number
   * @returns {Promise<Object|null>} Custom order or null
   */
  async findByOrderNumber(orderNumber) {
    const sql = 'SELECT * FROM custom_orders WHERE order_number = $1';
    const result = await query(sql, [orderNumber]);
    return result.rows[0] || null;
  }

  /**
   * Find all custom orders with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of custom orders
   */
  async findAll(filters = {}) {
    let sql = `
      SELECT co.*,
        c.customer_name,
        c.phone as customer_phone,
        w.weaver_name,
        s.store_name
      FROM custom_orders co
      LEFT JOIN customers c ON co.customer_id = c.customer_id
      LEFT JOIN weavers w ON co.weaver_id = w.weaver_id
      LEFT JOIN textile_stores s ON co.store_id = s.store_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND co.store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.customer_id) {
      sql += ` AND co.customer_id = $${paramCount}`;
      values.push(filters.customer_id);
      paramCount++;
    }

    if (filters.weaver_id) {
      sql += ` AND co.weaver_id = $${paramCount}`;
      values.push(filters.weaver_id);
      paramCount++;
    }

    if (filters.status) {
      sql += ` AND co.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.fabric_type) {
      sql += ` AND co.fabric_type ILIKE $${paramCount}`;
      values.push(`%${filters.fabric_type}%`);
      paramCount++;
    }

    if (filters.start_date) {
      sql += ` AND co.order_date >= $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      sql += ` AND co.order_date <= $${paramCount}`;
      values.push(filters.end_date);
      paramCount++;
    }

    sql += ' ORDER BY co.order_date DESC, co.created_at DESC';

    if (filters.limit) {
      sql += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      sql += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Update custom order
   * @param {number} id - Order ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated order or null
   */
  async update(id, updates) {
    const allowedFields = [
      'customer_id', 'fabric_type', 'design_requirements', 'measurements',
      'colors', 'work_type', 'occasion', 'reference_images', 'weaver_id',
      'estimated_price', 'advance_amount', 'final_price',
      'expected_delivery_date', 'delivery_date', 'status',
      'design_approval_date', 'production_start_date',
      'quality_check_date', 'quality_rating', 'notes'
    ];

    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        if ((key === 'measurements' || key === 'reference_images') && typeof updates[key] === 'object') {
          setClause.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(updates[key]));
        } else {
          setClause.push(`${key} = $${paramCount}`);
          values.push(updates[key]);
        }
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      return null;
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const sql = `
      UPDATE custom_orders
      SET ${setClause.join(', ')}
      WHERE order_id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Update custom order status with workflow tracking
   * @param {number} id - Order ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data based on status
   * @returns {Promise<Object|null>} Updated order or null
   */
  async updateStatus(id, status, additionalData = {}) {
    const updates = { status };

    // Set appropriate date fields based on status
    switch (status) {
      case 'WEAVER_ASSIGNED':
        if (additionalData.weaver_id) {
          updates.weaver_id = additionalData.weaver_id;
        }
        break;

      case 'DESIGN_APPROVED':
        updates.design_approval_date = new Date();
        if (additionalData.estimated_price) {
          updates.estimated_price = additionalData.estimated_price;
        }
        break;

      case 'IN_PRODUCTION':
        updates.production_start_date = new Date();
        break;

      case 'QUALITY_CHECK':
        updates.quality_check_date = new Date();
        if (additionalData.quality_rating) {
          updates.quality_rating = additionalData.quality_rating;
        }
        break;

      case 'READY_FOR_DELIVERY':
        if (additionalData.final_price) {
          updates.final_price = additionalData.final_price;
        }
        break;

      case 'COMPLETED':
        updates.delivery_date = new Date();
        if (additionalData.final_price) {
          updates.final_price = additionalData.final_price;
        }
        break;
    }

    if (additionalData.notes) {
      updates.notes = additionalData.notes;
    }

    return await this.update(id, updates);
  }

  /**
   * Assign weaver to custom order
   * @param {number} orderId - Order ID
   * @param {number} weaverId - Weaver ID
   * @returns {Promise<Object|null>} Updated order or null
   */
  async assignWeaver(orderId, weaverId) {
    return await this.updateStatus(orderId, 'WEAVER_ASSIGNED', { weaver_id: weaverId });
  }

  /**
   * Get orders by status
   * @param {string} status - Order status
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Orders with given status
   */
  async getByStatus(status, storeId = null) {
    let sql = `
      SELECT co.*,
        c.customer_name,
        c.phone as customer_phone,
        w.weaver_name,
        s.store_name
      FROM custom_orders co
      LEFT JOIN customers c ON co.customer_id = c.customer_id
      LEFT JOIN weavers w ON co.weaver_id = w.weaver_id
      LEFT JOIN textile_stores s ON co.store_id = s.store_id
      WHERE co.status = $1
    `;
    const values = [status];

    if (storeId) {
      sql += ' AND co.store_id = $2';
      values.push(storeId);
    }

    sql += ' ORDER BY co.order_date DESC';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get pending custom orders (not completed or cancelled)
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Pending orders
   */
  async getPendingOrders(storeId = null) {
    let sql = `
      SELECT co.*,
        c.customer_name,
        c.phone as customer_phone,
        w.weaver_name,
        s.store_name
      FROM custom_orders co
      LEFT JOIN customers c ON co.customer_id = c.customer_id
      LEFT JOIN weavers w ON co.weaver_id = w.weaver_id
      LEFT JOIN textile_stores s ON co.store_id = s.store_id
      WHERE co.status NOT IN ('COMPLETED', 'CANCELLED')
    `;
    const values = [];

    if (storeId) {
      sql += ' AND co.store_id = $1';
      values.push(storeId);
    }

    sql += ' ORDER BY co.expected_delivery_date ASC, co.order_date DESC';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get overdue custom orders
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Overdue orders
   */
  async getOverdueOrders(storeId = null) {
    let sql = `
      SELECT co.*,
        c.customer_name,
        c.phone as customer_phone,
        w.weaver_name,
        s.store_name
      FROM custom_orders co
      LEFT JOIN customers c ON co.customer_id = c.customer_id
      LEFT JOIN weavers w ON co.weaver_id = w.weaver_id
      LEFT JOIN textile_stores s ON co.store_id = s.store_id
      WHERE co.status NOT IN ('COMPLETED', 'CANCELLED')
        AND co.expected_delivery_date IS NOT NULL
        AND co.expected_delivery_date < CURRENT_DATE
    `;
    const values = [];

    if (storeId) {
      sql += ' AND co.store_id = $1';
      values.push(storeId);
    }

    sql += ' ORDER BY co.expected_delivery_date ASC';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get custom orders by customer
   * @param {number} customerId - Customer ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Customer's custom orders
   */
  async getByCustomer(customerId, options = {}) {
    const { limit = 50, offset = 0 } = options;

    const sql = `
      SELECT co.*,
        w.weaver_name,
        s.store_name
      FROM custom_orders co
      LEFT JOIN weavers w ON co.weaver_id = w.weaver_id
      LEFT JOIN textile_stores s ON co.store_id = s.store_id
      WHERE co.customer_id = $1
      ORDER BY co.order_date DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await query(sql, [customerId, limit, offset]);
    return result.rows;
  }

  /**
   * Get custom orders by weaver
   * @param {number} weaverId - Weaver ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Weaver's custom orders
   */
  async getByWeaver(weaverId, options = {}) {
    const { limit = 50, offset = 0 } = options;

    const sql = `
      SELECT co.*,
        c.customer_name,
        c.phone as customer_phone,
        s.store_name
      FROM custom_orders co
      LEFT JOIN customers c ON co.customer_id = c.customer_id
      LEFT JOIN textile_stores s ON co.store_id = s.store_id
      WHERE co.weaver_id = $1
      ORDER BY co.order_date DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await query(sql, [weaverId, limit, offset]);
    return result.rows;
  }

  /**
   * Get custom order statistics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Order statistics
   */
  async getStatistics(filters = {}) {
    let sql = `
      SELECT
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(CASE WHEN status NOT IN ('COMPLETED', 'CANCELLED') THEN 1 ELSE 0 END) as pending_orders,
        SUM(estimated_price) as total_estimated_value,
        SUM(final_price) as total_final_value,
        SUM(advance_amount) as total_advance_received,
        AVG(quality_rating) as average_quality_rating
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

  /**
   * Count custom orders with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    let sql = 'SELECT COUNT(*) FROM custom_orders WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.status) {
      sql += ` AND status = $${paramCount}`;
      values.push(filters.status);
    }

    const result = await query(sql, values);
    return parseInt(result.rows[0].count);
  }

  /**
   * Delete custom order
   * @param {number} id - Order ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const sql = 'DELETE FROM custom_orders WHERE order_id = $1';
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }
}

export default new CustomOrderRepository();
