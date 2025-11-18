import { inventoryRepository } from '../repositories/inventory.repository.js';
import { NotFoundError, AppError, ValidationError } from '../utils/errors.js';

/**
 * Create inventory item
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Created inventory item
 */
const createItem = async (itemData) => {
  // Validate input
  if (!itemData.item_name || !itemData.base_unit) {
    throw new ValidationError([
      { field: 'item_name', message: 'Item name is required' },
      { field: 'base_unit', message: 'Base unit is required' },
    ]);
  }

  const item = await inventoryRepository.createItem(itemData);
  return item;
};

/**
 * Get inventory item
 * @param {string} itemId - Item ID
 * @returns {Promise<Object>} Inventory item
 */
const getItem = async (itemId) => {
  const item = await inventoryRepository.findById(itemId);
  if (!item) {
    throw new NotFoundError('Inventory item');
  }
  return item;
};

/**
 * Get inventory items by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Items and pagination
 */
const getItemsByRestaurant = async (restaurantId, options = {}) => {
  const { items, totalCount } = await inventoryRepository.findByRestaurant(restaurantId, options);

  return {
    items,
    totalCount,
    page: Math.ceil((options.offset || 0) / (options.limit || 20)) + 1,
    limit: options.limit || 20,
  };
};

/**
 * Get low stock items
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Low stock items
 */
const getLowStockItems = async (restaurantId) => {
  const items = await inventoryRepository.findLowStock(restaurantId);
  return items;
};

/**
 * Add stock to item
 * @param {string} itemId - Item ID
 * @param {number} quantity - Quantity to add
 * @param {string} reason - Reason for addition (PURCHASE, ADJUSTMENT)
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Updated item and transaction
 */
const addStock = async (itemId, quantity, reason = 'PURCHASE', metadata = {}) => {
  const item = await inventoryRepository.findById(itemId);
  if (!item) {
    throw new NotFoundError('Inventory item');
  }

  if (quantity <= 0) {
    throw new ValidationError([{ field: 'quantity', message: 'Quantity must be greater than 0' }]);
  }

  const newStock = item.current_stock + quantity;

  // Update stock
  const updated = await inventoryRepository.updateStock(itemId, newStock);

  // Log transaction
  const transaction = await inventoryRepository.createTransaction({
    restaurant_id: metadata.restaurant_id,
    inventory_item_id: itemId,
    transaction_type: reason,
    quantity,
    unit: item.base_unit,
    stock_before: item.current_stock,
    stock_after: newStock,
    unit_cost: metadata.unit_cost,
    total_cost: metadata.unit_cost ? metadata.unit_cost * quantity : null,
    reference_id: metadata.reference_id,
    reference_type: metadata.reference_type,
    notes: metadata.notes,
    created_by: metadata.created_by,
  });

  return {
    item: updated,
    transaction,
  };
};

/**
 * Consume stock (for order preparation)
 * @param {string} itemId - Item ID
 * @param {number} quantity - Quantity to consume
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Updated item and transaction
 */
const consumeStock = async (itemId, quantity, metadata = {}) => {
  const item = await inventoryRepository.findById(itemId);
  if (!item) {
    throw new NotFoundError('Inventory item');
  }

  if (quantity <= 0) {
    throw new ValidationError([{ field: 'quantity', message: 'Quantity must be greater than 0' }]);
  }

  if (item.current_stock < quantity) {
    throw new AppError('Insufficient stock available', 409);
  }

  const newStock = item.current_stock - quantity;

  // Update stock
  const updated = await inventoryRepository.updateStock(itemId, newStock);

  // Log transaction
  const transaction = await inventoryRepository.createTransaction({
    restaurant_id: metadata.restaurant_id,
    inventory_item_id: itemId,
    transaction_type: 'CONSUMPTION',
    quantity,
    unit: item.base_unit,
    stock_before: item.current_stock,
    stock_after: newStock,
    reference_id: metadata.reference_id,
    reference_type: metadata.reference_type,
    notes: metadata.notes,
    created_by: metadata.created_by,
  });

  return {
    item: updated,
    transaction,
  };
};

/**
 * Adjust stock
 * @param {string} itemId - Item ID
 * @param {number} adjustment - Adjustment amount (can be negative)
 * @param {string} reason - Adjustment reason
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Updated item
 */
const adjustStock = async (itemId, adjustment, reason = 'ADJUSTMENT', metadata = {}) => {
  const item = await inventoryRepository.findById(itemId);
  if (!item) {
    throw new NotFoundError('Inventory item');
  }

  const newStock = item.current_stock + adjustment;

  if (newStock < 0) {
    throw new AppError('Adjustment would result in negative stock', 400);
  }

  const updated = await inventoryRepository.updateStock(itemId, newStock);

  // Log transaction
  await inventoryRepository.createTransaction({
    restaurant_id: metadata.restaurant_id,
    inventory_item_id: itemId,
    transaction_type: reason,
    quantity: Math.abs(adjustment),
    unit: item.base_unit,
    stock_before: item.current_stock,
    stock_after: newStock,
    notes: metadata.notes,
    created_by: metadata.created_by,
  });

  return updated;
};

/**
 * Get stock transactions
 * @param {string} itemId - Item ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Transactions
 */
const getTransactions = async (itemId, options = {}) => {
  const transactions = await inventoryRepository.getTransactions(itemId, options);
  return transactions;
};

/**
 * Get inventory value
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} Inventory value details
 */
const getInventoryValue = async (restaurantId) => {
  const value = await inventoryRepository.getInventoryValue(restaurantId);
  return value;
};

/**
 * Get inventory report
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} Comprehensive inventory report
 */
const getInventoryReport = async (restaurantId) => {
  const { items, totalCount } = await inventoryRepository.findByRestaurant(restaurantId, { limit: 1000, offset: 0 });
  const lowStockItems = await inventoryRepository.findLowStock(restaurantId);
  const inventoryValue = await inventoryRepository.getInventoryValue(restaurantId);

  return {
    totalItems: totalCount,
    totalValue: inventoryValue.total_value,
    lowStockCount: inventoryValue.low_stock_count,
    lowStockItems,
    items,
  };
};

/**
 * Update item details
 * @param {string} itemId - Item ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated item
 */
const updateItem = async (itemId, updateData) => {
  const item = await inventoryRepository.findById(itemId);
  if (!item) {
    throw new NotFoundError('Inventory item');
  }

  // Validate min/max stock levels if updating
  if (updateData.min_stock_level !== undefined && updateData.max_stock_level !== undefined) {
    if (updateData.min_stock_level > updateData.max_stock_level) {
      throw new AppError('Min stock level cannot be greater than max stock level', 400);
    }
  }

  // Update using query (simulating update endpoint)
  const updated = await inventoryRepository.updateStock(itemId, updateData.current_stock || item.current_stock);

  return updated;
};

/**
 * Check stock availability
 * @param {string} itemId - Item ID
 * @param {number} requiredQuantity - Required quantity
 * @returns {Promise<Object>} Stock availability
 */
const checkStockAvailability = async (itemId, requiredQuantity) => {
  const item = await inventoryRepository.findById(itemId);
  if (!item) {
    throw new NotFoundError('Inventory item');
  }

  const isAvailable = item.current_stock >= requiredQuantity;
  const shortfall = Math.max(0, requiredQuantity - item.current_stock);

  return {
    itemId,
    itemName: item.item_name,
    requiredQuantity,
    currentStock: item.current_stock,
    isAvailable,
    shortfall,
    minStockLevel: item.min_stock_level,
    belowMinStock: item.current_stock < item.min_stock_level,
  };
};

export const inventoryService = {
  createItem,
  getItem,
  getItemsByRestaurant,
  getLowStockItems,
  addStock,
  consumeStock,
  adjustStock,
  getTransactions,
  getInventoryValue,
  getInventoryReport,
  updateItem,
  checkStockAvailability,
};
