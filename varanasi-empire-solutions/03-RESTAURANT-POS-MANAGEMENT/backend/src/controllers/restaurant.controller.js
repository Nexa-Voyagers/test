import { restaurantService } from '../services/restaurant.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Create restaurant
 * POST /api/restaurants
 */
const createRestaurant = asyncHandler(async (req, res) => {
  const restaurantData = req.body;

  const restaurant = await restaurantService.createRestaurant(restaurantData);

  logger.info(`New restaurant created: ${restaurant.restaurant_code}`);

  res.status(201).json({
    success: true,
    message: 'Restaurant created successfully',
    data: restaurant,
  });
});

/**
 * Get restaurant by ID
 * GET /api/restaurants/:id
 */
const getRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await restaurantService.getRestaurant(id);

  res.json({
    success: true,
    data: restaurant,
  });
});

/**
 * Get restaurant with settings
 * GET /api/restaurants/:id/settings
 */
const getRestaurantWithSettings = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await restaurantService.getRestaurantWithSettings(id);

  res.json({
    success: true,
    data: restaurant,
  });
});

/**
 * Get current restaurant
 * GET /api/restaurants/me/details
 */
const getCurrentRestaurant = asyncHandler(async (req, res) => {
  const restaurantId = req.user.restaurant_id;

  const restaurant = await restaurantService.getRestaurant(restaurantId);

  res.json({
    success: true,
    data: restaurant,
  });
});

/**
 * Update restaurant
 * PATCH /api/restaurants/:id
 */
const updateRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const restaurant = await restaurantService.updateRestaurant(id, updateData);

  logger.info(`Restaurant updated: ${id}`);

  res.json({
    success: true,
    message: 'Restaurant updated successfully',
    data: restaurant,
  });
});

/**
 * Get all restaurants
 * GET /api/restaurants
 */
const getAllRestaurants = asyncHandler(async (req, res) => {
  const { limit = 10, offset = 0, search } = req.query;

  const result = await restaurantService.getAllRestaurants({
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
 * Get restaurants by group
 * GET /api/restaurant-groups/:groupId/restaurants
 */
const getByGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { limit = 10, offset = 0 } = req.query;

  const restaurants = await restaurantService.getByGroup(groupId, {
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  res.json({
    success: true,
    data: restaurants,
  });
});

/**
 * Update restaurant settings
 * PATCH /api/restaurants/:id/settings
 */
const updateSettings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const settings = req.body;

  const updated = await restaurantService.updateSettings(id, settings);

  logger.info(`Restaurant settings updated: ${id}`);

  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: updated,
  });
});

/**
 * Disable restaurant
 * DELETE /api/restaurants/:id
 */
const disableRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await restaurantService.disableRestaurant(id);

  logger.info(`Restaurant disabled: ${id}`);

  res.json({
    success: true,
    message: 'Restaurant disabled successfully',
  });
});

export const restaurantController = {
  createRestaurant,
  getRestaurant,
  getRestaurantWithSettings,
  getCurrentRestaurant,
  updateRestaurant,
  getAllRestaurants,
  getByGroup,
  updateSettings,
  disableRestaurant,
};
