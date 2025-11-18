import { propertyService } from '../services/property.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Create property
 * POST /api/properties
 */
const createProperty = asyncHandler(async (req, res) => {
  const propertyData = {
    ...req.body,
    agency_id: req.user.agency_id,
    created_by: req.user.id,
  };

  const property = await propertyService.createProperty(propertyData);

  logger.info(`Property created: ${property.id} by user ${req.user.id}`);

  res.status(201).json({
    success: true,
    message: 'Property created successfully',
    data: property,
  });
});

/**
 * Get property by ID
 * GET /api/properties/:id
 */
const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await propertyService.getProperty(id);

  res.json({
    success: true,
    data: property,
  });
});

/**
 * Get all properties with filters
 * GET /api/properties
 */
const getProperties = asyncHandler(async (req, res) => {
  const filters = {
    agency_id: req.query.agency_id || req.user.agency_id,
    property_type: req.query.property_type,
    transaction_type: req.query.transaction_type,
    city: req.query.city,
    bhk_type: req.query.bhk_type,
    min_price: req.query.min_price,
    max_price: req.query.max_price,
    status: req.query.status,
    is_featured: req.query.is_featured,
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0,
    sortBy: req.query.sortBy || 'created_at',
    sortOrder: req.query.sortOrder || 'DESC',
  };

  const result = await propertyService.getProperties(filters);

  res.json({
    success: true,
    data: result.properties,
    pagination: {
      total: result.totalCount,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.totalCount / result.limit),
    },
  });
});

/**
 * Update property
 * PUT /api/properties/:id
 */
const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await propertyService.updateProperty(id, req.body);

  logger.info(`Property updated: ${id} by user ${req.user.id}`);

  res.json({
    success: true,
    message: 'Property updated successfully',
    data: property,
  });
});

/**
 * Delete property
 * DELETE /api/properties/:id
 */
const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await propertyService.deleteProperty(id);

  logger.info(`Property deleted: ${id} by user ${req.user.id}`);

  res.json({
    success: true,
    message: 'Property deleted successfully',
  });
});

/**
 * Change property status
 * PATCH /api/properties/:id/status
 */
const changeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const property = await propertyService.changePropertyStatus(id, status);

  logger.info(`Property status changed: ${id} -> ${status}`);

  res.json({
    success: true,
    message: 'Property status updated successfully',
    data: property,
  });
});

/**
 * Add property images
 * POST /api/properties/:id/images
 */
const addImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { images } = req.body;

  const uploadedImages = await propertyService.addPropertyImages(id, images);

  logger.info(`Images added to property: ${id}`);

  res.status(201).json({
    success: true,
    message: 'Images added successfully',
    data: uploadedImages,
  });
});

/**
 * Get property statistics
 * GET /api/properties/statistics
 */
const getStatistics = asyncHandler(async (req, res) => {
  const agencyId = req.query.agency_id || req.user.agency_id;

  const stats = await propertyService.getPropertyStatistics(agencyId);

  res.json({
    success: true,
    data: stats,
  });
});

/**
 * Search properties by location
 * GET /api/properties/search
 */
const searchByLocation = asyncHandler(async (req, res) => {
  const searchParams = {
    locality: req.query.locality,
    city: req.query.city,
    state: req.query.state,
    radius: req.query.radius,
    transaction_type: req.query.transaction_type,
    property_type: req.query.property_type,
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0,
  };

  const result = await propertyService.searchByLocation(searchParams);

  res.json({
    success: true,
    data: result,
  });
});

/**
 * Get featured properties
 * GET /api/properties/featured
 */
const getFeatured = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const result = await propertyService.getFeaturedProperties(limit);

  res.json({
    success: true,
    data: result.properties,
  });
});

export const propertyController = {
  createProperty,
  getProperty,
  getProperties,
  updateProperty,
  deleteProperty,
  changeStatus,
  addImages,
  getStatistics,
  searchByLocation,
  getFeatured,
};
