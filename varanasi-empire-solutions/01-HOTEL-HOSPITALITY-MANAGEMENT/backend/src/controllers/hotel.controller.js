import { hotelService } from '../services/hotel.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Create property
 * POST /api/v1/hotels
 */
const createProperty = asyncHandler(async (req, res) => {
  const property = await hotelService.createProperty(req.body);

  res.status(201).json({
    success: true,
    message: 'Property created successfully',
    data: property,
  });
});

/**
 * Get property
 * GET /api/v1/hotels/:id
 */
const getProperty = asyncHandler(async (req, res) => {
  const property = await hotelService.getProperty(req.params.id);

  res.json({
    success: true,
    data: property,
  });
});

/**
 * Get properties by group
 * GET /api/v1/hotels
 */
const getProperties = asyncHandler(async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;

  const result = await hotelService.getPropertiesByGroup(req.user.group_id, {
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  res.json({
    success: true,
    data: result.properties,
    pagination: {
      total: result.totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});

/**
 * Update property
 * PUT /api/v1/hotels/:id
 */
const updateProperty = asyncHandler(async (req, res) => {
  const property = await hotelService.updateProperty(req.params.id, req.body);

  res.json({
    success: true,
    message: 'Property updated successfully',
    data: property,
  });
});

/**
 * Get property statistics
 * GET /api/v1/hotels/:id/stats
 */
const getPropertyStats = asyncHandler(async (req, res) => {
  const stats = await hotelService.getPropertyStats(req.params.id);

  res.json({
    success: true,
    data: stats,
  });
});

/**
 * Get property settings
 * GET /api/v1/hotels/:id/settings
 */
const getPropertySettings = asyncHandler(async (req, res) => {
  const settings = await hotelService.getPropertySettings(req.params.id);

  res.json({
    success: true,
    data: settings,
  });
});

/**
 * Update property settings
 * PUT /api/v1/hotels/:id/settings
 */
const updatePropertySettings = asyncHandler(async (req, res) => {
  const property = await hotelService.updateProperty(req.params.id, req.body);

  res.json({
    success: true,
    message: 'Property settings updated successfully',
    data: property,
  });
});

export const hotelController = {
  createProperty,
  getProperty,
  getProperties,
  updateProperty,
  getPropertyStats,
  getPropertySettings,
  updatePropertySettings,
};
