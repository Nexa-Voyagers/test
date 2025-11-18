import { menuRepository } from '../repositories/menu.repository.js';
import { NotFoundError, AppError } from '../utils/errors.js';

/**
 * Create category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} Created category
 */
const createCategory = async (categoryData) => {
  const category = await menuRepository.createCategory(categoryData);
  return category;
};

/**
 * Create menu item
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Created menu item
 */
const createItem = async (itemData) => {
  // Validate base price
  if (itemData.base_price <= 0) {
    throw new AppError('Base price must be greater than 0', 400);
  }

  const item = await menuRepository.createItem(itemData);
  return item;
};

/**
 * Get menu item with variants
 * @param {string} itemId - Item ID
 * @returns {Promise<Object>} Menu item with variants
 */
const getMenuItem = async (itemId) => {
  const item = await menuRepository.findItemById(itemId);
  if (!item) {
    throw new NotFoundError('Menu item');
  }
  return item;
};

/**
 * Get menu by category
 * @param {string} categoryId - Category ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Menu items
 */
const getByCategory = async (categoryId, options = {}) => {
  const items = await menuRepository.findByCategory(categoryId, options);
  if (items.length === 0) {
    throw new NotFoundError('Items in category');
  }
  return items;
};

/**
 * Get restaurant menu
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Complete menu structure
 */
const getMenu = async (restaurantId, options = {}) => {
  // Get categories
  const categories = await menuRepository.findCategoriesByRestaurant(restaurantId);

  // Get items for each category
  const menu = await Promise.all(
    categories.map(async (category) => {
      const items = await menuRepository.findByCategory(category.id, { limit: 100, offset: 0 });
      return {
        ...category,
        items,
      };
    })
  );

  return menu;
};

/**
 * Get all items by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Items and pagination info
 */
const getRestaurantItems = async (restaurantId, options = {}) => {
  const { items, totalCount } = await menuRepository.findByRestaurant(restaurantId, options);

  return {
    items,
    totalCount,
    page: Math.ceil((options.offset || 0) / (options.limit || 50)) + 1,
    limit: options.limit || 50,
  };
};

/**
 * Get categories by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Categories
 */
const getCategories = async (restaurantId) => {
  const categories = await menuRepository.findCategoriesByRestaurant(restaurantId);
  return categories;
};

/**
 * Add item variant
 * @param {string} itemId - Item ID
 * @param {Object} variantData - Variant data
 * @returns {Promise<Object>} Created variant
 */
const addVariant = async (itemId, variantData) => {
  // Check if item exists
  const item = await menuRepository.findItemById(itemId);
  if (!item) {
    throw new NotFoundError('Menu item');
  }

  const variant = await menuRepository.createVariant({
    menu_item_id: itemId,
    ...variantData,
  });

  return variant;
};

/**
 * Update menu item
 * @param {string} itemId - Item ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated item
 */
const updateItem = async (itemId, updateData) => {
  // Validate price if updating
  if (updateData.base_price !== undefined && updateData.base_price <= 0) {
    throw new AppError('Base price must be greater than 0', 400);
  }

  const item = await menuRepository.updateItem(itemId, updateData);
  if (!item) {
    throw new NotFoundError('Menu item');
  }

  return item;
};

/**
 * Get featured items
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Featured items
 */
const getFeaturedItems = async (restaurantId) => {
  const { items } = await menuRepository.findByRestaurant(restaurantId, {
    limit: 100,
    offset: 0,
    available: true,
  });

  return items.filter(item => item.is_featured);
};

/**
 * Get chef specials
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Chef special items
 */
const getChefSpecials = async (restaurantId) => {
  const { items } = await menuRepository.findByRestaurant(restaurantId, {
    limit: 100,
    offset: 0,
    available: true,
  });

  return items.filter(item => item.is_chef_special);
};

/**
 * Calculate item total with variant
 * @param {Object} item - Menu item
 * @param {Object} variant - Variant (optional)
 * @param {number} quantity - Quantity
 * @returns {number} Total price
 */
const calculateItemTotal = (item, variant = null, quantity = 1) => {
  let price = item.base_price;

  if (variant && variant.price_adjustment) {
    price += variant.price_adjustment;
  }

  return price * quantity;
};

export const menuService = {
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
  calculateItemTotal,
};
