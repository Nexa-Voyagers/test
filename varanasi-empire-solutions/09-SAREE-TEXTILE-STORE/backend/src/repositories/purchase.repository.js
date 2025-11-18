import { pool, query, transaction } from '../config/database.js';

/**
 * Purchase Repository
 * Handles all database operations for purchase orders to weavers
 */
class PurchaseRepository {
  /**
   * Create a new purchase order with items (transactional)
   * @param {Object} orderData - Purchase order information
   * @param {Array} items - Purchase order items
   * @returns {Promise<Object>} Created purchase order with items
   */
  async createPurchaseOrder(orderData, items) {
    return await transaction(async (client) => {
      const {
        store_id,
        weaver_id,
        order_number,
        order_date,
        expected_delivery_date,
        advance_amount,
        payment_terms,
        notes,
        status
      } = orderData;

      // Calculate total from items
      let totalAmount = 0;
      items.forEach(item => {
        totalAmount += item.quantity * item.unit_price;
      });

      const orderSql = `
        INSERT INTO purchase_orders (
          store_id, weaver_id, order_number, order_date,
          expected_delivery_date, total_amount, advance_amount,
          payment_terms, status, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const orderValues = [
        store_id,
        weaver_id,
        order_number,
        order_date || new Date(),
        expected_delivery_date || null,
        totalAmount,
        advance_amount || 0,
        payment_terms || null,
        status || 'PENDING',
        notes || null
      ];

      const orderResult = await client.query(orderSql, orderValues);
      const order = orderResult.rows[0];

      // Create purchase order items
      const purchaseItems = [];
      for (const item of items) {
        const itemSql = `
          INSERT INTO purchase_order_items (
            order_id, product_id, quantity, unit_price, total_price
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;

        const totalPrice = item.quantity * item.unit_price;

        const itemValues = [
          order.order_id,
          item.product_id,
          item.quantity,
          item.unit_price,
          totalPrice
        ];

        const itemResult = await client.query(itemSql, itemValues);
        purchaseItems.push(itemResult.rows[0]);
      }

      return {
        ...order,
        items: purchaseItems
      };
    });
  }

  /**
   * Find purchase order by ID with items
   * @param {number} id - Order ID
   * @returns {Promise<Object|null>} Purchase order with items or null
   */
  async findById(id) {
    const orderSql = `
      SELECT po.*,
        w.weaver_name,
        w.contact_person,
        w.phone as weaver_phone,
        s.store_name
      FROM purchase_orders po
      LEFT JOIN weavers w ON po.weaver_id = w.weaver_id
      LEFT JOIN textile_stores s ON po.store_id = s.store_id
      WHERE po.order_id = $1
    `;
    const orderResult = await query(orderSql, [id]);

    if (orderResult.rows.length === 0) {
      return null;
    }

    const order = orderResult.rows[0];

    // Get purchase order items
    const itemsSql = `
      SELECT poi.*,
        p.product_name,
        p.product_code
      FROM purchase_order_items poi
      LEFT JOIN products p ON poi.product_id = p.product_id
      WHERE poi.order_id = $1
      ORDER BY poi.item_id
    `;
    const itemsResult = await query(itemsSql, [id]);

    return {
      ...order,
      items: itemsResult.rows
    };
  }

  /**
   * Find purchase order by order number
   * @param {string} orderNumber - Order number
   * @returns {Promise<Object|null>} Purchase order with items or null
   */
  async findByOrderNumber(orderNumber) {
    const sql = 'SELECT order_id FROM purchase_orders WHERE order_number = $1';
    const result = await query(sql, [orderNumber]);

    if (result.rows.length === 0) {
      return null;
    }

    return await this.findById(result.rows[0].order_id);
  }

  /**
   * Find all purchase orders with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of purchase orders
   */
  async findAll(filters = {}) {
    let sql = `
      SELECT po.*,
        w.weaver_name,
        w.contact_person,
        s.store_name
      FROM purchase_orders po
      LEFT JOIN weavers w ON po.weaver_id = w.weaver_id
      LEFT JOIN textile_stores s ON po.store_id = s.store_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND po.store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.weaver_id) {
      sql += ` AND po.weaver_id = $${paramCount}`;
      values.push(filters.weaver_id);
      paramCount++;
    }

    if (filters.status) {
      sql += ` AND po.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.start_date) {
      sql += ` AND po.order_date >= $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      sql += ` AND po.order_date <= $${paramCount}`;
      values.push(filters.end_date);
      paramCount++;
    }

    sql += ' ORDER BY po.order_date DESC, po.created_at DESC';

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
   * Update purchase order status
   * @param {number} id - Order ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional fields to update
   * @returns {Promise<Object|null>} Updated order or null
   */
  async updateStatus(id, status, additionalData = {}) {
    return await transaction(async (client) => {
      const setClause = ['status = $1', 'updated_at = CURRENT_TIMESTAMP'];
      const values = [status];
      let paramCount = 2;

      if (status === 'COMPLETED' && !additionalData.delivery_date) {
        setClause.push(`delivery_date = CURRENT_TIMESTAMP`);
      } else if (additionalData.delivery_date) {
        setClause.push(`delivery_date = $${paramCount}`);
        values.push(additionalData.delivery_date);
        paramCount++;
      }

      if (additionalData.quality_check_notes) {
        setClause.push(`quality_check_notes = $${paramCount}`);
        values.push(additionalData.quality_check_notes);
        paramCount++;
      }

      values.push(id);

      const sql = `
        UPDATE purchase_orders
        SET ${setClause.join(', ')}
        WHERE order_id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(sql, values);

      // If order is completed, update product stock
      if (status === 'COMPLETED' && result.rows.length > 0) {
        const itemsSql = 'SELECT * FROM purchase_order_items WHERE order_id = $1';
        const itemsResult = await client.query(itemsSql, [id]);

        for (const item of itemsResult.rows) {
          const stockSql = `
            UPDATE products
            SET stock_quantity = stock_quantity + $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE product_id = $2
          `;
          await client.query(stockSql, [item.quantity, item.product_id]);
        }

        // Increment weaver's completed orders count
        const order = result.rows[0];
        const weaverSql = `
          UPDATE weavers
          SET total_orders_completed = total_orders_completed + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE weaver_id = $1
        `;
        await client.query(weaverSql, [order.weaver_id]);
      }

      return result.rows[0] || null;
    });
  }

  /**
   * Update purchase order
   * @param {number} id - Order ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated order or null
   */
  async update(id, updates) {
    const allowedFields = [
      'weaver_id', 'order_date', 'expected_delivery_date',
      'delivery_date', 'total_amount', 'advance_amount',
      'payment_terms', 'status', 'quality_check_notes', 'notes'
    ];

    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      return null;
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const sql = `
      UPDATE purchase_orders
      SET ${setClause.join(', ')}
      WHERE order_id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Get purchase orders pending delivery
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Pending orders
   */
  async getPendingOrders(storeId = null) {
    let sql = `
      SELECT po.*,
        w.weaver_name,
        w.contact_person,
        w.phone as weaver_phone,
        s.store_name
      FROM purchase_orders po
      LEFT JOIN weavers w ON po.weaver_id = w.weaver_id
      LEFT JOIN textile_stores s ON po.store_id = s.store_id
      WHERE po.status IN ('PENDING', 'CONFIRMED', 'IN_PRODUCTION')
    `;
    const values = [];

    if (storeId) {
      sql += ' AND po.store_id = $1';
      values.push(storeId);
    }

    sql += ' ORDER BY po.expected_delivery_date ASC';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get overdue purchase orders
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Overdue orders
   */
  async getOverdueOrders(storeId = null) {
    let sql = `
      SELECT po.*,
        w.weaver_name,
        w.contact_person,
        w.phone as weaver_phone,
        s.store_name
      FROM purchase_orders po
      LEFT JOIN weavers w ON po.weaver_id = w.weaver_id
      LEFT JOIN textile_stores s ON po.store_id = s.store_id
      WHERE po.status NOT IN ('COMPLETED', 'CANCELLED')
        AND po.expected_delivery_date < CURRENT_DATE
    `;
    const values = [];

    if (storeId) {
      sql += ' AND po.store_id = $1';
      values.push(storeId);
    }

    sql += ' ORDER BY po.expected_delivery_date ASC';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get purchase summary
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Purchase summary
   */
  async getPurchaseSummary(filters = {}) {
    let sql = `
      SELECT
        COUNT(*) as total_orders,
        SUM(total_amount) as total_purchase_value,
        SUM(advance_amount) as total_advance_paid,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(CASE WHEN status IN ('PENDING', 'CONFIRMED', 'IN_PRODUCTION') THEN 1 ELSE 0 END) as pending_orders
      FROM purchase_orders
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
   * Count purchase orders with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    let sql = 'SELECT COUNT(*) FROM purchase_orders WHERE 1=1';
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
   * Delete purchase order
   * @param {number} id - Order ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const sql = 'DELETE FROM purchase_orders WHERE order_id = $1';
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }
}

export default new PurchaseRepository();
