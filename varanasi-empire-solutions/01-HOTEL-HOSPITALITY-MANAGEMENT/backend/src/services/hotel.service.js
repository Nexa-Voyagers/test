import { hotelRepository } from '../repositories/hotel.repository.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Create property
 * @param {Object} propertyData - Property data
 * @returns {Promise<Object>}
 */
const createProperty = async (propertyData) => {
  return await hotelRepository.create(propertyData);
};

/**
 * Get property details
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>}
 */
const getProperty = async (propertyId) => {
  const property = await hotelRepository.findById(propertyId);
  if (!property) {
    throw new NotFoundError('Property');
  }
  return property;
};

/**
 * Get properties by group
 * @param {string} groupId - Hotel group ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const getPropertiesByGroup = async (groupId, options = {}) => {
  return await hotelRepository.findByGroup(groupId, options);
};

/**
 * Update property
 * @param {string} propertyId - Property ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 */
const updateProperty = async (propertyId, updateData) => {
  const property = await hotelRepository.findById(propertyId);
  if (!property) {
    throw new NotFoundError('Property');
  }
  return await hotelRepository.update(propertyId, updateData);
};

/**
 * Get property statistics and dashboard data
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>}
 */
const getPropertyStats = async (propertyId) => {
  const property = await hotelRepository.findById(propertyId);
  if (!property) {
    throw new NotFoundError('Property');
  }
  return await hotelRepository.getStats(propertyId);
};

/**
 * Get property settings
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>}
 */
const getPropertySettings = async (propertyId) => {
  const property = await hotelRepository.findById(propertyId);
  if (!property) {
    throw new NotFoundError('Property');
  }

  return {
    checkInTime: property.check_in_time,
    checkOutTime: property.check_out_time,
    currency: property.currency,
    timezone: property.timezone,
    language: property.default_language,
    gstNumber: property.gst_number,
    cancellationPolicy: property.cancellation_policy_hours,
  };
};

export const hotelService = {
  createProperty,
  getProperty,
  getPropertiesByGroup,
  updateProperty,
  getPropertyStats,
  getPropertySettings,
};
