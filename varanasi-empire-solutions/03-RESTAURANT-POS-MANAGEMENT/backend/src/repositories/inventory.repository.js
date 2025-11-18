import { query } from '../config/database.js';

/**
 * Create inventory item
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Created inventory item
 */
const createItem = async (itemData) => {
  const sql = `
    INSERT INTO inventory_items (
      restaurant_id, category_id, item_name, item_code, description,
      base_unit, current_stock, min_stock_level, max_stock_level,
      avg_cost_price, primary_supplier_id, is_perishable,
      shelf_life_days, is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true)
    RETURNING id, restaurant_id, item_name, item_code, current_stock,
              min_stock_level, max_stock_level, is_active, created_at
  `;

  const values = [
    itemData.restaurant_id,
    itemData.category_id || null,
    itemData.item_name,
    itemData.item_code || null,
    itemData.description || null,
    itemData.base_unit,
    itemData.current_stock || 0,
    itemData.min_stock_level || 0,
    itemData.max_stock_level || null,
    itemData.avg_cost_price || null,
    itemData.primary_supplier_id || null,
    itemData.is_perishable || false,
    itemData.shelf_life_days || null,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find inventory item by ID
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Inventory item
 */
const findById = async (id) => {
  const sql = 'SELECT * FROM inventory_items WHERE id = $1 AND is_active = true';
  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Find inventory items by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Items and total count
 */
const findByRestaurant = async (restaurantId, { limit = 20, offset = 0, search = null } = {}) => {
  let sql = `
    SELECT id, restaurant_id, category_id, item_name, item_code,
           base_unit, current_stock, min_stock_level, max_stock_level,
           avg_cost_price, is_perishable, is_active
    FROM inventory_items
    WHERE restaurant_id = $1 AND is_active = true
  `;

  const values = [restaurantId];
  let paramCount = 2;

  if (search) {
    sql += ` AND (item_name ILIKE $${paramCount} OR item_code ILIKE $${paramCount})`;
    values.push(`%${search}%`);
    paramCount++;
  }

  sql += ` ORDER BY item_name LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);

  // Get total count
  let countSql = 'SELECT COUNT(*) FROM inventory_items WHERE restaurant_id = $1 AND is_active = true';
  const countValues = [restaurantId];

  if (search) {
    countSql += ' AND (item_name ILIKE $2 OR item_code ILIKE $2)';
    countValues.push(`%${search}%`);
  }

  const countResult = await query(countSql, countValues);

  return {
    items: result.rows,
    totalCount: parseInt(countResult.rows[0].count),
  };
};

/**
 * Find low stock items
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Low stock items
 */
const findLowStock = async (restaurantId) => {
  const sql = `
    SELECT id, restaurant_id, item_name, item_code, base_unit,
           current_stock, min_stock_level,
           (min_stock_level - current_stock) as stock_deficit
    FROM inventory_items
    WHERE restaurant_id = $1 AND is_active = true
      AND current_stock < min_stock_level
    ORDER BY stock_deficit DESC
  `;

  const result = await query(sql, [restaurantId]);
  return result.rows;
};

/**
 * Create stock transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} Created transaction
 */
const createTransaction = async (transactionData) => {
  const sql = `
    INSERT INTO stock_transactions (
      restaurant_id, inventory_item_id, transaction_type, transaction_date,
      quantity, unit, stock_before, stock_after, unit_cost, total_cost,
      reference_id, reference_type, notes, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING id, inventory_item_id, transaction_type, quantity,
              stock_before, stock_after, transaction_date, created_at
  `;

  const values = [
    transactionData.restaurant_id,
    transactionData.inventory_item_id,
    transactionData.transaction_type,
    transactionData.transaction_date || new Date(),
    transactionData.quantity,
    transactionData.unit,
    transactionData.stock_before || null,
    transactionData.stock_after || null,
    transactionData.unit_cost || null,
    transactionData.total_cost || null,
    transactionData.reference_id || null,
    transactionData.reference_type || null,
    transactionData.notes || null,
    transactionData.created_by || null,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Update inventory stock
 * @param {string} id - Item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated item
 */
const updateStock = async (id, quantity) => {
  const sql = `
    UPDATE inventory_items
    SET current_stock = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, item_name, current_stock, min_stock_level
  `;

  const result = await query(sql, [quantity, id]);
  return result.rows[0];
};

/**
 * Get inventory item by code
 * @param {string} itemCode - Item code
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} Inventory item
 */
const findByCode = async (itemCode, restaurantId) => {
  const sql = `
    SELECT * FROM inventory_items
    WHERE item_code = $1 AND restaurant_id = $2 AND is_active = true
  `;

  const result = await query(sql, [itemCode, restaurantId]);
  return result.rows[0];
};

/**
 * Get stock transactions for item
 * @param {string} itemId - Item ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Stock transactions
 */
const getTransactions = async (itemId, { limit = 20, offset = 0 } = {}) => {
  const sql = `
    SELECT id, transaction_type, quantity, unit, stock_before, stock_after,
           unit_cost, total_cost, reference_type, notes, transaction_date, created_at
    FROM stock_transactions
    WHERE inventory_item_id = $1
    ORDER BY transaction_date DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await query(sql, [itemId, limit, offset]);
  return result.rows;
};

/**
 * Get inventory value
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} Total inventory value
 */
const getInventoryValue = async (restaurantId) => {
  const sql = `
    SELECT
      COALESCE(SUM(current_stock * avg_cost_price), 0) as total_value,
      COUNT(*) as total_items,
      COUNT(*) FILTER (WHERE current_stock < min_stock_level) as low_stock_count
    FROM inventory_items
    WHERE restaurant_id = $1 AND is_active = true
  `;

  const result = await query(sql, [restaurantId]);
  return result.rows[0];
};

/**
 * Adjust stock
 * @param {string} id - Item ID
 * @param {number} adjustment - Adjustment quantity
 * @param {string} reason - Adjustment reason
 * @returns {Promise<Object>} Updated item
 */
const adjustStock = async (id, adjustment, reason) => {
  const sql = `
    UPDATE inventory_items
    SET current_stock = current_stock + $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, item_name, current_stock
  `;

  const result = await query(sql, [adjustment, id]);

  // Log the transaction
  if (result.rows[0]) {
    const item = result.rows[0];
    await createTransaction({
      inventory_item_id: id,
      transaction_type: 'ADJUSTMENT',
      quantity: Math.abs(adjustment),
      unit: 'piece',
      stock_after: item.current_stock,
      notes: reason,
    });
  }

  return result.rows[0];
};

export const inventoryRepository = {
  createItem,
  findById,
  findByRestaurant,
  findLowStock,
  createTransaction,
  updateStock,
  findByCode,
  getTransactions,
  getInventoryValue,
  adjustStock,
};
