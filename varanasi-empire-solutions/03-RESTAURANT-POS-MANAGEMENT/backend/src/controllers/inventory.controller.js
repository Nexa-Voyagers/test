import { inventoryService } from '../services/inventory.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Create inventory item
 * POST /api/inventory/items
 */
const createItem = asyncHandler(async (req, res) => {
  const {
    category_id,
    item_name,
    item_code,
    description,
    base_unit,
    current_stock,
    min_stock_level,
    max_stock_level,
    avg_cost_price,
    primary_supplier_id,
    is_perishable,
    shelf_life_days,
  } = req.body;

  const item = await inventoryService.createItem({
    restaurant_id: req.user.restaurant_id,
    category_id,
    item_name,
    item_code,
    description,
    base_unit,
    current_stock,
    min_stock_level,
    max_stock_level,
    avg_cost_price,
    primary_supplier_id,
    is_perishable,
    shelf_life_days,
  });

  logger.info(`Inventory item created: ${item_name}`);

  res.status(201).json({
    success: true,
    message: 'Inventory item created successfully',
    data: item,
  });
});

/**
 * Get inventory item
 * GET /api/inventory/items/:id
 */
const getItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await inventoryService.getItem(id);

  res.json({
    success: true,
    data: item,
  });
});

/**
 * Get restaurant inventory items
 * GET /api/inventory/items
 */
const getItems = asyncHandler(async (req, res) => {
  const { limit = 20, offset = 0, search } = req.query;

  const result = await inventoryService.getItemsByRestaurant(req.user.restaurant_id, {
    limit: parseInt(limit),
    offset: parseInt(offset),
    search,
  });

  res.json({
    success: true,
    data: result,
  });
});

/**
 * Get low stock items
 * GET /api/inventory/low-stock
 */
const getLowStockItems = asyncHandler(async (req, res) => {
  const items = await inventoryService.getLowStockItems(req.user.restaurant_id);

  res.json({
    success: true,
    data: items,
  });
});

/**
 * Add stock to item
 * POST /api/inventory/items/:id/add-stock
 */
const addStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, reason = 'PURCHASE', unit_cost, reference_id, reference_type, notes } = req.body;

  const result = await inventoryService.addStock(id, quantity, reason, {
    restaurant_id: req.user.restaurant_id,
    unit_cost,
    reference_id,
    reference_type,
    notes,
    created_by: req.user.id,
  });

  logger.info(`Stock added to item: ${id} - Quantity: ${quantity}`);

  res.json({
    success: true,
    message: 'Stock added successfully',
    data: result,
  });
});

/**
 * Consume stock (for order preparation)
 * POST /api/inventory/items/:id/consume
 */
const consumeStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, reference_id, reference_type, notes } = req.body;

  const result = await inventoryService.consumeStock(id, quantity, {
    restaurant_id: req.user.restaurant_id,
    reference_id,
    reference_type,
    notes,
    created_by: req.user.id,
  });

  logger.info(`Stock consumed from item: ${id} - Quantity: ${quantity}`);

  res.json({
    success: true,
    message: 'Stock consumed successfully',
    data: result,
  });
});

/**
 * Adjust stock
 * PATCH /api/inventory/items/:id/adjust-stock
 */
const adjustStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { adjustment, reason = 'ADJUSTMENT', notes } = req.body;

  const item = await inventoryService.adjustStock(id, adjustment, reason, {
    restaurant_id: req.user.restaurant_id,
    notes,
    created_by: req.user.id,
  });

  logger.info(`Stock adjusted for item: ${id} - Adjustment: ${adjustment}`);

  res.json({
    success: true,
    message: 'Stock adjusted successfully',
    data: item,
  });
});

/**
 * Get stock transactions
 * GET /api/inventory/items/:id/transactions
 */
const getTransactions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit = 20, offset = 0 } = req.query;

  const transactions = await inventoryService.getTransactions(id, {
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  res.json({
    success: true,
    data: transactions,
  });
});

/**
 * Get inventory value
 * GET /api/inventory/value
 */
const getInventoryValue = asyncHandler(async (req, res) => {
  const value = await inventoryService.getInventoryValue(req.user.restaurant_id);

  res.json({
    success: true,
    data: value,
  });
});

/**
 * Get inventory report
 * GET /api/inventory/report
 */
const getInventoryReport = asyncHandler(async (req, res) => {
  const report = await inventoryService.getInventoryReport(req.user.restaurant_id);

  res.json({
    success: true,
    data: report,
  });
});

/**
 * Update item
 * PATCH /api/inventory/items/:id
 */
const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const item = await inventoryService.updateItem(id, updateData);

  logger.info(`Inventory item updated: ${id}`);

  res.json({
    success: true,
    message: 'Item updated successfully',
    data: item,
  });
});

/**
 * Check stock availability
 * POST /api/inventory/check-availability
 */
const checkStockAvailability = asyncHandler(async (req, res) => {
  const { item_id, required_quantity } = req.body;

  const availability = await inventoryService.checkStockAvailability(item_id, required_quantity);

  res.json({
    success: true,
    data: availability,
  });
});

export const inventoryController = {
  createItem,
  getItem,
  getItems,
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
