import { inventoryService } from '../services/inventory.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllInventory = asyncHandler(async (req, res) => {
  const filters = {
    unit_id: req.query.unit_id,
    product_id: req.query.product_id,
    low_stock: req.query.low_stock === 'true',
    limit: parseInt(req.query.limit) || 50,
    offset: parseInt(req.query.offset) || 0,
  };
  const inventory = await inventoryService.getAllInventory(filters);
  res.json({ success: true, count: inventory.length, data: inventory });
});

export const getInventory = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getInventory(req.params.id);
  res.json({ success: true, data: inventory });
});

export const addStock = asyncHandler(async (req, res) => {
  const { quantity, notes } = req.body;
  const inventory = await inventoryService.addStock(req.params.id, quantity, notes);
  res.json({ success: true, message: 'Stock added', data: inventory });
});

export const removeStock = asyncHandler(async (req, res) => {
  const { quantity, notes } = req.body;
  const inventory = await inventoryService.removeStock(req.params.id, quantity, notes);
  res.json({ success: true, message: 'Stock removed', data: inventory });
});

export const reserveStock = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const inventory = await inventoryService.reserveStock(req.params.id, quantity);
  res.json({ success: true, message: 'Stock reserved', data: inventory });
});

export const getLowStockItems = asyncHandler(async (req, res) => {
  const items = await inventoryService.getLowStockItems(req.query.unit_id);
  res.json({ success: true, count: items.length, data: items });
});

export const getInventoryValue = asyncHandler(async (req, res) => {
  const value = await inventoryService.getInventoryValue(req.query.unit_id);
  res.json({ success: true, data: value });
});

export const transferStock = asyncHandler(async (req, res) => {
  const { to_inventory_id, quantity, notes } = req.body;
  const result = await inventoryService.transferStock(req.params.id, to_inventory_id, quantity, notes);
  res.json({ success: true, message: 'Stock transferred', data: result });
});
