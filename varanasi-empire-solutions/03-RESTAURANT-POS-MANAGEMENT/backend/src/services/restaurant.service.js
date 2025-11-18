import { restaurantRepository } from '../repositories/restaurant.repository.js';
import { AppError, NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Create restaurant
 * @param {Object} restaurantData - Restaurant data
 * @returns {Promise<Object>} Created restaurant
 */
const createRestaurant = async (restaurantData) => {
  // Check if restaurant code already exists
  const existing = await restaurantRepository.findByCode(restaurantData.restaurant_code);
  if (existing) {
    throw new ConflictError('Restaurant with this code already exists');
  }

  const restaurant = await restaurantRepository.create(restaurantData);
  return restaurant;
};

/**
 * Get restaurant by ID
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} Restaurant object
 */
const getRestaurant = async (restaurantId) => {
  const restaurant = await restaurantRepository.findById(restaurantId);
  if (!restaurant) {
    throw new NotFoundError('Restaurant');
  }
  return restaurant;
};

/**
 * Get restaurant with detailed info
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} Restaurant with settings
 */
const getRestaurantWithSettings = async (restaurantId) => {
  const restaurant = await restaurantRepository.findById(restaurantId);
  if (!restaurant) {
    throw new NotFoundError('Restaurant');
  }

  const settings = await restaurantRepository.getSettings(restaurantId);

  return {
    ...restaurant,
    settings,
  };
};

/**
 * Update restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated restaurant
 */
const updateRestaurant = async (restaurantId, updateData) => {
  // Prevent updating restaurant_code
  delete updateData.restaurant_code;

  const restaurant = await restaurantRepository.update(restaurantId, updateData);
  if (!restaurant) {
    throw new NotFoundError('Restaurant');
  }

  return restaurant;
};

/**
 * Get restaurants by group
 * @param {string} groupId - Group ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Restaurants
 */
const getByGroup = async (groupId, options = {}) => {
  const restaurants = await restaurantRepository.findByGroup(groupId, options);
  return restaurants;
};

/**
 * Get all restaurants
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Restaurants and pagination info
 */
const getAllRestaurants = async (options = {}) => {
  const { restaurants, totalCount } = await restaurantRepository.findAll(options);

  return {
    restaurants,
    totalCount,
    page: Math.ceil((options.offset || 0) / (options.limit || 10)) + 1,
    limit: options.limit || 10,
  };
};

/**
 * Update restaurant settings
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} settings - Settings to update
 * @returns {Promise<Object>} Updated settings
 */
const updateSettings = async (restaurantId, settings) => {
  // Validate settings
  if (settings.tax_rate_cgst !== undefined && (settings.tax_rate_cgst < 0 || settings.tax_rate_cgst > 100)) {
    throw new AppError('CGST rate must be between 0 and 100', 400);
  }

  if (settings.tax_rate_sgst !== undefined && (settings.tax_rate_sgst < 0 || settings.tax_rate_sgst > 100)) {
    throw new AppError('SGST rate must be between 0 and 100', 400);
  }

  if (settings.service_charge_percent !== undefined && (settings.service_charge_percent < 0 || settings.service_charge_percent > 100)) {
    throw new AppError('Service charge must be between 0 and 100', 400);
  }

  const updated = await restaurantRepository.update(restaurantId, settings);
  if (!updated) {
    throw new NotFoundError('Restaurant');
  }

  return await restaurantRepository.getSettings(restaurantId);
};

/**
 * Disable restaurant
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<void>}
 */
const disableRestaurant = async (restaurantId) => {
  const restaurant = await restaurantRepository.findById(restaurantId);
  if (!restaurant) {
    throw new NotFoundError('Restaurant');
  }

  await restaurantRepository.softDelete(restaurantId);
};

export const restaurantService = {
  createRestaurant,
  getRestaurant,
  getRestaurantWithSettings,
  updateRestaurant,
  getByGroup,
  getAllRestaurants,
  updateSettings,
  disableRestaurant,
};
