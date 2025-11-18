import { pool, query, transaction } from '../config/database.js';

/**
 * Customer Repository
 * Handles all database operations for customers
 */
class CustomerRepository {
  /**
   * Create a new customer
   * @param {Object} customerData - Customer information
   * @returns {Promise<Object>} Created customer
   */
  async create(customerData) {
    const {
      store_id,
      customer_name,
      customer_type,
      phone,
      email,
      gst_number,
      address,
      city,
      state,
      pincode,
      loyalty_tier,
      is_active
    } = customerData;

    const sql = `
      INSERT INTO customers (
        store_id, customer_name, customer_type, phone, email,
        gst_number, address, city, state, pincode,
        loyalty_tier, total_purchases, outstanding_balance, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      store_id, customer_name, customer_type, phone, email || null,
      gst_number || null, address || null, city || null,
      state || null, pincode || null,
      loyalty_tier || 'SILVER', 0, 0,
      is_active !== undefined ? is_active : true
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Find customer by ID
   * @param {number} id - Customer ID
   * @returns {Promise<Object|null>} Customer or null
   */
  async findById(id) {
    const sql = `
      SELECT c.*,
        s.store_name
      FROM customers c
      LEFT JOIN textile_stores s ON c.store_id = s.store_id
      WHERE c.customer_id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find customer by phone
   * @param {string} phone - Phone number
   * @returns {Promise<Object|null>} Customer or null
   */
  async findByPhone(phone) {
    const sql = 'SELECT * FROM customers WHERE phone = $1';
    const result = await query(sql, [phone]);
    return result.rows[0] || null;
  }

  /**
   * Find all customers with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of customers
   */
  async findAll(filters = {}) {
    let sql = `
      SELECT c.*,
        s.store_name
      FROM customers c
      LEFT JOIN textile_stores s ON c.store_id = s.store_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND c.store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.customer_type) {
      sql += ` AND c.customer_type = $${paramCount}`;
      values.push(filters.customer_type);
      paramCount++;
    }

    if (filters.loyalty_tier) {
      sql += ` AND c.loyalty_tier = $${paramCount}`;
      values.push(filters.loyalty_tier);
      paramCount++;
    }

    if (filters.city) {
      sql += ` AND c.city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.has_outstanding_balance) {
      sql += ` AND c.outstanding_balance > 0`;
    }

    if (filters.is_active !== undefined) {
      sql += ` AND c.is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    sql += ' ORDER BY c.created_at DESC';

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
   * Update customer by ID
   * @param {number} id - Customer ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated customer or null
   */
  async update(id, updates) {
    const allowedFields = [
      'store_id', 'customer_name', 'customer_type', 'phone', 'email',
      'gst_number', 'address', 'city', 'state', 'pincode',
      'loyalty_tier', 'total_purchases', 'outstanding_balance', 'is_active'
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
      UPDATE customers
      SET ${setClause.join(', ')}
      WHERE customer_id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Update customer total purchases and recalculate loyalty tier
   * @param {number} id - Customer ID
   * @param {number} amount - Purchase amount to add
   * @returns {Promise<Object|null>} Updated customer or null
   */
  async updateTotalPurchases(id, amount) {
    const sql = `
      UPDATE customers
      SET total_purchases = total_purchases + $1,
          loyalty_tier = CASE
            WHEN (total_purchases + $1) >= 200000 THEN 'PLATINUM'
            WHEN (total_purchases + $1) >= 50000 THEN 'GOLD'
            ELSE 'SILVER'
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE customer_id = $2
      RETURNING *
    `;
    const result = await query(sql, [amount, id]);
    return result.rows[0] || null;
  }

  /**
   * Update outstanding balance
   * @param {number} id - Customer ID
   * @param {number} amount - Amount to add/subtract
   * @param {string} operation - 'add' or 'subtract'
   * @returns {Promise<Object|null>} Updated customer or null
   */
  async updateOutstandingBalance(id, amount, operation = 'add') {
    const operator = operation === 'add' ? '+' : '-';
    const sql = `
      UPDATE customers
      SET outstanding_balance = outstanding_balance ${operator} $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE customer_id = $2
      RETURNING *
    `;
    const result = await query(sql, [amount, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete customer by ID (soft delete)
   * @param {number} id - Customer ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const sql = `
      UPDATE customers
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE customer_id = $1
      RETURNING customer_id
    `;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get customer purchase history
   * @param {number} customerId - Customer ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Purchase history
   */
  async getPurchaseHistory(customerId, options = {}) {
    const { limit = 50, offset = 0 } = options;

    const sql = `
      SELECT si.*,
        COUNT(DISTINCT sit.item_id) as total_items,
        SUM(sit.quantity) as total_quantity
      FROM sales_invoices si
      LEFT JOIN sale_items sit ON si.invoice_id = sit.invoice_id
      WHERE si.customer_id = $1
      GROUP BY si.invoice_id
      ORDER BY si.invoice_date DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await query(sql, [customerId, limit, offset]);
    return result.rows;
  }

  /**
   * Get customers with outstanding balance
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Customers with outstanding balance
   */
  async getWithOutstandingBalance(storeId = null) {
    let sql = `
      SELECT c.*,
        s.store_name
      FROM customers c
      LEFT JOIN textile_stores s ON c.store_id = s.store_id
      WHERE c.outstanding_balance > 0
        AND c.is_active = true
    `;
    const values = [];

    if (storeId) {
      sql += ' AND c.store_id = $1';
      values.push(storeId);
    }

    sql += ' ORDER BY c.outstanding_balance DESC';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get top customers by purchase amount
   * @param {number} storeId - Store ID (optional)
   * @param {number} limit - Number of customers to return
   * @returns {Promise<Array>} Top customers
   */
  async getTopCustomers(storeId = null, limit = 10) {
    let sql = `
      SELECT c.*,
        s.store_name
      FROM customers c
      LEFT JOIN textile_stores s ON c.store_id = s.store_id
      WHERE c.is_active = true
    `;
    const values = [];
    let paramCount = 1;

    if (storeId) {
      sql += ` AND c.store_id = $${paramCount}`;
      values.push(storeId);
      paramCount++;
    }

    sql += ` ORDER BY c.total_purchases DESC LIMIT $${paramCount}`;
    values.push(limit);

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get customers by loyalty tier
   * @param {string} tier - Loyalty tier
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Customers in tier
   */
  async getByLoyaltyTier(tier, storeId = null) {
    let sql = `
      SELECT c.*,
        s.store_name
      FROM customers c
      LEFT JOIN textile_stores s ON c.store_id = s.store_id
      WHERE c.loyalty_tier = $1
        AND c.is_active = true
    `;
    const values = [tier];

    if (storeId) {
      sql += ' AND c.store_id = $2';
      values.push(storeId);
    }

    sql += ' ORDER BY c.total_purchases DESC';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Search customers
   * @param {string} searchTerm - Search term
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Matching customers
   */
  async search(searchTerm, storeId = null) {
    let sql = `
      SELECT c.*,
        s.store_name
      FROM customers c
      LEFT JOIN textile_stores s ON c.store_id = s.store_id
      WHERE (c.customer_name ILIKE $1
         OR c.phone ILIKE $1
         OR c.email ILIKE $1)
    `;
    const values = [`%${searchTerm}%`];

    if (storeId) {
      sql += ' AND c.store_id = $2';
      values.push(storeId);
    }

    sql += ' ORDER BY c.customer_name LIMIT 50';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Count customers with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    let sql = 'SELECT COUNT(*) FROM customers WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.customer_type) {
      sql += ` AND customer_type = $${paramCount}`;
      values.push(filters.customer_type);
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      sql += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
    }

    const result = await query(sql, values);
    return parseInt(result.rows[0].count);
  }
}

export default new CustomerRepository();
