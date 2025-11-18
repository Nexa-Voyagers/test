import { propertyRepository } from '../repositories/property.repository.js';
import { NotFoundError, ValidationError, AppError } from '../utils/errors.js';

/**
 * Create new property listing
 */
const createProperty = async (propertyData) => {
  // Validate property type
  const validPropertyTypes = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'AGRICULTURAL', 'PLOT'];
  if (!validPropertyTypes.includes(propertyData.property_type)) {
    throw new ValidationError([{ field: 'property_type', message: 'Invalid property type' }]);
  }

  // Validate transaction type
  const validTransactionTypes = ['SALE', 'RENT', 'LEASE', 'PG'];
  if (!validTransactionTypes.includes(propertyData.transaction_type)) {
    throw new ValidationError([{ field: 'transaction_type', message: 'Invalid transaction type' }]);
  }

  // RERA validation for UP
  if (propertyData.rera_registered && !propertyData.rera_id) {
    throw new ValidationError([{ field: 'rera_id', message: 'RERA ID is required for registered properties' }]);
  }

  const property = await propertyRepository.create(propertyData);
  return property;
};

/**
 * Get property by ID
 */
const getProperty = async (propertyId) => {
  const property = await propertyRepository.findById(propertyId);
  if (!property) {
    throw new NotFoundError('Property');
  }

  // Increment view count
  // await propertyRepository.incrementViews(propertyId);

  return property;
};

/**
 * Get all properties with filters
 */
const getProperties = async (filters) => {
  const result = await propertyRepository.findAll(filters);
  return result;
};

/**
 * Update property
 */
const updateProperty = async (propertyId, updateData) => {
  const property = await propertyRepository.findById(propertyId);
  if (!property) {
    throw new NotFoundError('Property');
  }

  const updated = await propertyRepository.update(propertyId, updateData);
  return updated;
};

/**
 * Delete property (soft delete)
 */
const deleteProperty = async (propertyId) => {
  const property = await propertyRepository.findById(propertyId);
  if (!property) {
    throw new NotFoundError('Property');
  }

  await propertyRepository.softDelete(propertyId);
  return { message: 'Property deleted successfully' };
};

/**
 * Change property status
 */
const changePropertyStatus = async (propertyId, status) => {
  const validStatuses = ['AVAILABLE', 'SOLD', 'RENTED', 'INACTIVE', 'UNDER_NEGOTIATION'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError([{ field: 'status', message: 'Invalid status' }]);
  }

  const property = await propertyRepository.updateStatus(propertyId, status);
  if (!property) {
    throw new NotFoundError('Property');
  }

  return property;
};

/**
 * Add property images
 */
const addPropertyImages = async (propertyId, images) => {
  const property = await propertyRepository.findById(propertyId);
  if (!property) {
    throw new NotFoundError('Property');
  }

  const uploadedImages = [];
  for (const image of images) {
    const uploaded = await propertyRepository.addImage(propertyId, image);
    uploadedImages.push(uploaded);
  }

  return uploadedImages;
};

/**
 * Get property statistics for agency
 */
const getPropertyStatistics = async (agencyId) => {
  const stats = await propertyRepository.getStatistics(agencyId);
  return stats;
};

/**
 * Search properties by location
 */
const searchByLocation = async (searchParams) => {
  const { locality, city, state, radius } = searchParams;

  const filters = {
    ...searchParams,
    locality: locality?.toLowerCase(),
    city: city?.toLowerCase(),
    state: state?.toUpperCase(),
  };

  return await propertyRepository.findAll(filters);
};

/**
 * Get featured properties
 */
const getFeaturedProperties = async (limit = 10) => {
  return await propertyRepository.findAll({
    is_featured: true,
    status: 'AVAILABLE',
    limit,
    offset: 0,
  });
};

export const propertyService = {
  createProperty,
  getProperty,
  getProperties,
  updateProperty,
  deleteProperty,
  changePropertyStatus,
  addPropertyImages,
  getPropertyStatistics,
  searchByLocation,
  getFeaturedProperties,
};
