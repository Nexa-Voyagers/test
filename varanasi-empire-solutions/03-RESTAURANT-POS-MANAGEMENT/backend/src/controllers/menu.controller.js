import { menuService } from '../services/menu.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Create menu category
 * POST /api/menu/categories
 */
const createCategory = asyncHandler(async (req, res) => {
  const { category_name, category_code, description, parent_category_id, display_order } = req.body;

  const category = await menuService.createCategory({
    restaurant_id: req.user.restaurant_id,
    category_name,
    category_code,
    description,
    parent_category_id,
    display_order,
  });

  logger.info(`Menu category created: ${category_name}`);

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

/**
 * Create menu item
 * POST /api/menu/items
 */
const createItem = asyncHandler(async (req, res) => {
  const itemData = req.body;

  const item = await menuService.createItem({
    ...itemData,
    restaurant_id: req.user.restaurant_id,
  });

  logger.info(`Menu item created: ${item.item_name}`);

  res.status(201).json({
    success: true,
    message: 'Menu item created successfully',
    data: item,
  });
});

/**
 * Get menu item with variants
 * GET /api/menu/items/:id
 */
const getMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await menuService.getMenuItem(id);

  res.json({
    success: true,
    data: item,
  });
});

/**
 * Get menu items by category
 * GET /api/menu/categories/:categoryId/items
 */
const getByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  const items = await menuService.getByCategory(categoryId, {
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  res.json({
    success: true,
    data: items,
  });
});

/**
 * Get complete menu structure
 * GET /api/menu
 */
const getMenu = asyncHandler(async (req, res) => {
  const menu = await menuService.getMenu(req.user.restaurant_id);

  res.json({
    success: true,
    data: menu,
  });
});

/**
 * Get restaurant items
 * GET /api/menu/items
 */
const getRestaurantItems = asyncHandler(async (req, res) => {
  const { limit = 50, offset = 0, search, available = true } = req.query;

  const result = await menuService.getRestaurantItems(req.user.restaurant_id, {
    limit: parseInt(limit),
    offset: parseInt(offset),
    search,
    available: available !== 'false',
  });

  res.json({
    success: true,
    data: result,
  });
});

/**
 * Get categories
 * GET /api/menu/categories
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await menuService.getCategories(req.user.restaurant_id);

  res.json({
    success: true,
    data: categories,
  });
});

/**
 * Add item variant
 * POST /api/menu/items/:itemId/variants
 */
const addVariant = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { variant_name, variant_type, price_adjustment, is_default } = req.body;

  const variant = await menuService.addVariant(itemId, {
    variant_name,
    variant_type,
    price_adjustment,
    is_default,
  });

  logger.info(`Variant added to item: ${itemId}`);

  res.status(201).json({
    success: true,
    message: 'Variant added successfully',
    data: variant,
  });
});

/**
 * Update menu item
 * PATCH /api/menu/items/:id
 */
const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const item = await menuService.updateItem(id, updateData);

  logger.info(`Menu item updated: ${id}`);

  res.json({
    success: true,
    message: 'Menu item updated successfully',
    data: item,
  });
});

/**
 * Get featured items
 * GET /api/menu/featured
 */
const getFeaturedItems = asyncHandler(async (req, res) => {
  const items = await menuService.getFeaturedItems(req.user.restaurant_id);

  res.json({
    success: true,
    data: items,
  });
});

/**
 * Get chef specials
 * GET /api/menu/chef-specials
 */
const getChefSpecials = asyncHandler(async (req, res) => {
  const items = await menuService.getChefSpecials(req.user.restaurant_id);

  res.json({
    success: true,
    data: items,
  });
});


/**
 * Delete menu item
 * DELETE /api/menu/items/:id
 */
const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await menuService.deleteItem(id);

  logger.info(`Menu item deleted: ${id}`);

  res.json({
    success: true,
    message: 'Menu item deleted successfully',
  });
});

/**
 * Update item availability
 * PATCH /api/menu/items/:id/availability
 */
const updateAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_available } = req.body;

  const item = await menuService.updateItem(id, { is_available });

  logger.info(`Menu item availability updated: ${id} - ${is_available}`);

  res.json({
    success: true,
    message: 'Item availability updated successfully',
    data: item,
  });
});
export const menuController = {
  createCategory,
  createItem,
  getMenuItem,
  getByCategory,
  getMenu,
  getRestaurantItems,
  getCategories,
  addVariant,
  updateItem,
  getFeaturedItems,
  getChefSpecials,
  deleteItem,
  updateAvailability,
};
