import { query, transaction } from '../config/database.js';

/**
 * Create order
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} Created order
 */
const create = async (orderData) => {
  const sql = `
    INSERT INTO orders (
      restaurant_id, order_number, order_type, customer_id,
      customer_name, customer_phone, table_id, floor_id, guest_count,
      delivery_address, delivery_instructions, delivery_partner, delivery_charge,
      subtotal, discount_amount, discount_reason,
      cgst_amount, sgst_amount, service_charge_amount, packaging_charge,
      total_amount, payment_status, order_status,
      special_instructions, internal_notes, created_by
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18, $19, $20, $21, 'PENDING', 'PENDING',
      $22, $23, $24
    )
    RETURNING id, restaurant_id, order_number, order_type, order_status,
              total_amount, subtotal, payment_status, created_at
  `;

  const values = [
    orderData.restaurant_id,
    orderData.order_number,
    orderData.order_type,
    orderData.customer_id || null,
    orderData.customer_name || null,
    orderData.customer_phone || null,
    orderData.table_id || null,
    orderData.floor_id || null,
    orderData.guest_count || null,
    orderData.delivery_address || null,
    orderData.delivery_instructions || null,
    orderData.delivery_partner || null,
    orderData.delivery_charge || 0,
    orderData.subtotal,
    orderData.discount_amount || 0,
    orderData.discount_reason || null,
    orderData.cgst_amount || 0,
    orderData.sgst_amount || 0,
    orderData.service_charge_amount || 0,
    orderData.packaging_charge || 0,
    orderData.total_amount,
    orderData.special_instructions || null,
    orderData.internal_notes || null,
    orderData.created_by || null,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find order by ID
 * @param {string} id - Order ID
 * @returns {Promise<Object>} Order with items
 */
const findById = async (id) => {
  const sql = `
    SELECT * FROM orders WHERE id = $1
  `;

  const result = await query(sql, [id]);
  if (!result.rows[0]) return null;

  const order = result.rows[0];

  // Get order items
  const itemsSql = `
    SELECT id, menu_item_id, item_name, item_code, variant_name,
           quantity, unit_price, total_price, customizations,
           special_instructions, kot_status, cooking_station
    FROM order_items
    WHERE order_id = $1
    ORDER BY created_at
  `;

  const itemsResult = await query(itemsSql, [id]);
  order.items = itemsResult.rows;

  return order;
};

/**
 * Find orders by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Orders and total count
 */
const findByRestaurant = async (restaurantId, { limit = 20, offset = 0, status = null, orderType = null } = {}) => {
  let sql = `
    SELECT id, order_number, order_type, customer_name, customer_phone,
           order_status, total_amount, payment_status, created_at
    FROM orders
    WHERE restaurant_id = $1
  `;

  const values = [restaurantId];
  let paramCount = 2;

  if (status) {
    sql += ` AND order_status = $${paramCount}`;
    values.push(status);
    paramCount++;
  }

  if (orderType) {
    sql += ` AND order_type = $${paramCount}`;
    values.push(orderType);
    paramCount++;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);

  // Get total count
  let countSql = 'SELECT COUNT(*) FROM orders WHERE restaurant_id = $1';
  const countValues = [restaurantId];

  if (status) {
    countSql += ' AND order_status = $2';
  }

  if (orderType && !status) {
    countSql += ' AND order_type = $2';
  } else if (orderType && status) {
    countSql += ' AND order_type = $3';
  }

  const countResult = await query(countSql, countValues);

  return {
    orders: result.rows,
    totalCount: parseInt(countResult.rows[0].count),
  };
};

/**
 * Find orders by table
 * @param {string} tableId - Table ID
 * @returns {Promise<Array>} Orders
 */
const findByTable = async (tableId) => {
  const sql = `
    SELECT id, order_number, order_type, order_status, total_amount,
           payment_status, created_at
    FROM orders
    WHERE table_id = $1 AND order_status NOT IN ('COMPLETED', 'CANCELLED')
    ORDER BY created_at DESC
  `;

  const result = await query(sql, [tableId]);
  return result.rows;
};

/**
 * Find orders by date range
 * @param {string} restaurantId - Restaurant ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Orders
 */
const findByDateRange = async (restaurantId, startDate, endDate) => {
  const sql = `
    SELECT id, order_number, order_type, order_status, total_amount,
           subtotal, cgst_amount, sgst_amount, discount_amount, created_at
    FROM orders
    WHERE restaurant_id = $1
      AND DATE(created_at) >= $2
      AND DATE(created_at) <= $3
    ORDER BY created_at DESC
  `;

  const result = await query(sql, [restaurantId, startDate, endDate]);
  return result.rows;
};

/**
 * Update order status
 * @param {string} id - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
const updateStatus = async (id, status) => {
  const statusUpdateMap = {
    CONFIRMED: 'confirmed_at = NOW()',
    PREPARING: 'preparing_started_at = NOW()',
    READY: 'ready_at = NOW()',
    SERVED: 'served_at = NOW()',
    COMPLETED: 'completed_at = NOW()',
  };

  const sql = `
    UPDATE orders
    SET order_status = $1, ${statusUpdateMap[status] || ''}
    WHERE id = $2
    RETURNING id, order_number, order_status, created_at, updated_at
  `;

  const result = await query(sql, [status, id]);
  return result.rows[0];
};

/**
 * Add item to order
 * @param {string} orderId - Order ID
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Created order item
 */
const addItem = async (orderId, itemData) => {
  const sql = `
    INSERT INTO order_items (
      order_id, menu_item_id, item_name, item_code, variant_id, variant_name,
      quantity, unit_price, total_price, customizations, special_instructions,
      kot_status, cooking_station
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PENDING', $12)
    RETURNING id, item_name, quantity, unit_price, total_price
  `;

  const values = [
    orderId,
    itemData.menu_item_id,
    itemData.item_name,
    itemData.item_code || null,
    itemData.variant_id || null,
    itemData.variant_name || null,
    itemData.quantity,
    itemData.unit_price,
    itemData.total_price,
    itemData.customizations || [],
    itemData.special_instructions || null,
    itemData.cooking_station || 'KITCHEN_HOT',
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Update order
 * @param {string} id - Order ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated order
 */
const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updateData).forEach(key => {
    if (key !== 'id' && key !== 'restaurant_id' && key !== 'order_number') {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return await findById(id);
  }

  fields.push('updated_at = NOW()');

  const sql = `
    UPDATE orders
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, order_number, order_status, total_amount, payment_status, updated_at
  `;

  values.push(id);

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Update order item status
 * @param {string} itemId - Order item ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated item
 */
const updateItemStatus = async (itemId, status) => {
  const statusUpdateMap = {
    SENT_TO_KITCHEN: 'kot_printed_at = NOW()',
    PREPARING: 'preparation_started_at = NOW()',
    READY: 'ready_at = NOW()',
    SERVED: 'served_at = NOW()',
  };

  const sql = `
    UPDATE order_items
    SET kot_status = $1, ${statusUpdateMap[status] || ''}
    WHERE id = $2
    RETURNING id, item_name, kot_status
  `;

  const result = await query(sql, [status, itemId]);
  return result.rows[0];
};

/**
 * Get daily sales
 * @param {string} restaurantId - Restaurant ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Object>} Daily sales data
 */
const getDailySales = async (restaurantId, date) => {
  const sql = `
    SELECT
      COUNT(*) as total_orders,
      COUNT(*) FILTER (WHERE order_type = 'DINE_IN') as dine_in_orders,
      COUNT(*) FILTER (WHERE order_type = 'TAKEAWAY') as takeaway_orders,
      COUNT(*) FILTER (WHERE order_type = 'DELIVERY') as delivery_orders,
      COUNT(*) FILTER (WHERE order_status = 'CANCELLED') as cancelled_orders,
      COALESCE(SUM(total_amount), 0) as gross_revenue,
      COALESCE(SUM(discount_amount), 0) as discounts,
      COALESCE(SUM(cgst_amount + sgst_amount), 0) as taxes,
      COUNT(DISTINCT customer_id) as unique_customers
    FROM orders
    WHERE restaurant_id = $1 AND DATE(created_at) = $2
  `;

  const result = await query(sql, [restaurantId, date]);
  return result.rows[0];
};

/**
 * Create KOT log entry
 * @param {Object} kotData - KOT data
 * @returns {Promise<Object>} Created KOT log
 */
const createKOT = async (kotData) => {
  const sql = `
    INSERT INTO kot_logs (
      order_id, kot_number, cooking_station, items, printed_by
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, kot_number, cooking_station, printed_at
  `;

  const values = [
    kotData.order_id,
    kotData.kot_number,
    kotData.cooking_station,
    kotData.items,
    kotData.printed_by || null,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

export const orderRepository = {
  create,
  findById,
  findByRestaurant,
  findByTable,
  findByDateRange,
  updateStatus,
  addItem,
  update,
  updateItemStatus,
  getDailySales,
  createKOT,
};
