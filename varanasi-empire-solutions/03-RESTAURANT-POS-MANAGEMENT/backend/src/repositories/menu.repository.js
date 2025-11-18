import { query } from '../config/database.js';

/**
 * Create menu category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} Created category
 */
const createCategory = async (categoryData) => {
  const sql = `
    INSERT INTO menu_categories (
      restaurant_id, category_name, category_code, description,
      parent_category_id, display_order, is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, true)
    RETURNING id, restaurant_id, category_name, category_code, parent_category_id, is_active, created_at
  `;

  const values = [
    categoryData.restaurant_id,
    categoryData.category_name,
    categoryData.category_code || null,
    categoryData.description || null,
    categoryData.parent_category_id || null,
    categoryData.display_order || 0,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Create menu item
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Created menu item
 */
const createItem = async (itemData) => {
  const sql = `
    INSERT INTO menu_items (
      restaurant_id, category_id, item_name, item_code, description,
      short_description, base_price, cost_price, has_variants,
      cuisine_type, course_type, food_type, spice_level,
      is_gluten_free, is_dairy_free, allergens,
      preparation_time_minutes, cooking_station,
      available_for_dine_in, available_for_takeaway, available_for_delivery,
      track_inventory, current_stock, low_stock_threshold,
      is_featured, is_chef_special, is_seasonal,
      image_url, is_available, is_active, display_order
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, true, true, $29
    )
    RETURNING id, restaurant_id, category_id, item_name, base_price, is_active, created_at
  `;

  const values = [
    itemData.restaurant_id,
    itemData.category_id,
    itemData.item_name,
    itemData.item_code || null,
    itemData.description || null,
    itemData.short_description || null,
    itemData.base_price,
    itemData.cost_price || null,
    itemData.has_variants || false,
    itemData.cuisine_type || null,
    itemData.course_type || null,
    itemData.food_type || 'VEG',
    itemData.spice_level || null,
    itemData.is_gluten_free || false,
    itemData.is_dairy_free || false,
    itemData.allergens || [],
    itemData.preparation_time_minutes || 15,
    itemData.cooking_station || 'KITCHEN_HOT',
    itemData.available_for_dine_in !== false,
    itemData.available_for_takeaway !== false,
    itemData.available_for_delivery !== false,
    itemData.track_inventory || false,
    itemData.current_stock || 0,
    itemData.low_stock_threshold || 0,
    itemData.is_featured || false,
    itemData.is_chef_special || false,
    itemData.is_seasonal || false,
    itemData.image_url || null,
    itemData.display_order || 0,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find menu item by ID
 * @param {string} id - Menu item ID
 * @returns {Promise<Object>} Menu item with variants
 */
const findItemById = async (id) => {
  const sql = `
    SELECT * FROM menu_items WHERE id = $1 AND is_active = true
  `;

  const result = await query(sql, [id]);
  if (!result.rows[0]) return null;

  const item = result.rows[0];

  // Get variants if item has variants
  if (item.has_variants) {
    const variantSql = `
      SELECT id, menu_item_id, variant_name, variant_type,
             price_adjustment, is_default, is_available
      FROM menu_item_variants
      WHERE menu_item_id = $1 AND is_available = true
      ORDER BY variant_name
    `;
    const variantResult = await query(variantSql, [id]);
    item.variants = variantResult.rows;
  }

  return item;
};

/**
 * Find menu items by category
 * @param {string} categoryId - Category ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Menu items
 */
const findByCategory = async (categoryId, { limit = 50, offset = 0 } = {}) => {
  const sql = `
    SELECT id, restaurant_id, category_id, item_name, item_code, base_price,
           food_type, spice_level, preparation_time_minutes, image_url,
           is_available, is_featured, is_chef_special
    FROM menu_items
    WHERE category_id = $1 AND is_active = true AND is_available = true
    ORDER BY display_order, item_name
    LIMIT $2 OFFSET $3
  `;

  const result = await query(sql, [categoryId, limit, offset]);
  return result.rows;
};

/**
 * Find menu categories by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Menu categories
 */
const findCategoriesByRestaurant = async (restaurantId) => {
  const sql = `
    SELECT id, restaurant_id, category_name, category_code, description,
           parent_category_id, display_order, is_active
    FROM menu_categories
    WHERE restaurant_id = $1 AND is_active = true
    ORDER BY display_order, category_name
  `;

  const result = await query(sql, [restaurantId]);
  return result.rows;
};

/**
 * Find all menu items by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Menu items and total count
 */
const findByRestaurant = async (restaurantId, { limit = 50, offset = 0, search = null, available = true } = {}) => {
  let sql = `
    SELECT id, restaurant_id, category_id, item_name, item_code, base_price,
           food_type, spice_level, preparation_time_minutes, image_url,
           is_available, is_featured, is_chef_special
    FROM menu_items
    WHERE restaurant_id = $1 AND is_active = true
  `;

  const values = [restaurantId];
  let paramCount = 2;

  if (available) {
    sql += ` AND is_available = true`;
  }

  if (search) {
    sql += ` AND (item_name ILIKE $${paramCount} OR item_code ILIKE $${paramCount})`;
    values.push(`%${search}%`);
    paramCount++;
  }

  sql += ` ORDER BY display_order, item_name LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);

  // Get total count
  let countSql = 'SELECT COUNT(*) FROM menu_items WHERE restaurant_id = $1 AND is_active = true';
  const countValues = [restaurantId];

  if (available) {
    countSql += ' AND is_available = true';
  }

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
 * Create menu item variant
 * @param {Object} variantData - Variant data
 * @returns {Promise<Object>} Created variant
 */
const createVariant = async (variantData) => {
  const sql = `
    INSERT INTO menu_item_variants (
      menu_item_id, variant_name, variant_type, price_adjustment,
      is_default, is_available
    )
    VALUES ($1, $2, $3, $4, $5, true)
    RETURNING id, menu_item_id, variant_name, variant_type, price_adjustment, is_default
  `;

  const values = [
    variantData.menu_item_id,
    variantData.variant_name,
    variantData.variant_type || 'SIZE',
    variantData.price_adjustment || 0,
    variantData.is_default || false,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Update menu item
 * @param {string} id - Menu item ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated menu item
 */
const updateItem = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updateData).forEach(key => {
    if (key !== 'id' && key !== 'restaurant_id') {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return await findItemById(id);
  }

  fields.push('updated_at = NOW()');

  const sql = `
    UPDATE menu_items
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, restaurant_id, category_id, item_name, base_price, is_active, created_at, updated_at
  `;

  values.push(id);

  const result = await query(sql, values);
  return result.rows[0];
};

export const menuRepository = {
  createCategory,
  createItem,
  findItemById,
  findByCategory,
  findCategoriesByRestaurant,
  findByRestaurant,
  createVariant,
  updateItem,
};
