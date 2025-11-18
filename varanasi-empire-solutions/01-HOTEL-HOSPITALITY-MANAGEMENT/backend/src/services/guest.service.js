import { guestRepository } from '../repositories/guest.repository.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Create guest profile
 * @param {Object} guestData - Guest data
 * @returns {Promise<Object>}
 */
const createGuest = async (guestData) => {
  return await guestRepository.create(guestData);
};

/**
 * Get guest details
 * @param {string} guestId - Guest ID
 * @returns {Promise<Object>}
 */
const getGuest = async (guestId) => {
  const guest = await guestRepository.findById(guestId);
  if (!guest) {
    throw new NotFoundError('Guest');
  }
  return guest;
};

/**
 * Update guest profile
 * @param {string} guestId - Guest ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 */
const updateGuest = async (guestId, updateData) => {
  const guest = await guestRepository.findById(guestId);
  if (!guest) {
    throw new NotFoundError('Guest');
  }
  return await guestRepository.update(guestId, updateData);
};

/**
 * Search guests
 * @param {string} search - Search query
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const searchGuests = async (search, options = {}) => {
  return await guestRepository.search(search, options);
};

/**
 * Find guest by email
 * @param {string} email - Guest email
 * @returns {Promise<Object>}
 */
const findByEmail = async (email) => {
  return await guestRepository.findByEmail(email);
};

/**
 * Find guests by phone
 * @param {string} phone - Guest phone
 * @returns {Promise<Array>}
 */
const findByPhone = async (phone) => {
  return await guestRepository.findByPhone(phone);
};

/**
 * Get VIP guests
 * @param {number} limit - Number of results
 * @returns {Promise<Array>}
 */
const getVIPGuests = async (limit = 10) => {
  return await guestRepository.getVIPGuests(limit);
};

/**
 * Get repeat guests
 * @param {number} limit - Number of results
 * @returns {Promise<Array>}
 */
const getRepeatGuests = async (limit = 10) => {
  return await guestRepository.getRepeatGuests(limit);
};

/**
 * Award loyalty points
 * @param {string} guestId - Guest ID
 * @param {number} points - Points to award
 * @returns {Promise<Object>}
 */
const awardLoyaltyPoints = async (guestId, points) => {
  const guest = await guestRepository.findById(guestId);
  if (!guest) {
    throw new NotFoundError('Guest');
  }
  return await guestRepository.updateLoyaltyPoints(guestId, points);
};

/**
 * Redeem loyalty points
 * @param {string} guestId - Guest ID
 * @param {number} points - Points to redeem
 * @returns {Promise<Object>}
 */
const redeemLoyaltyPoints = async (guestId, points) => {
  const guest = await guestRepository.findById(guestId);
  if (!guest) {
    throw new NotFoundError('Guest');
  }

  if (guest.loyalty_points < points) {
    throw new Error('Insufficient loyalty points');
  }

  return await guestRepository.updateLoyaltyPoints(guestId, -points);
};

/**
 * Get guest preferences
 * @param {string} guestId - Guest ID
 * @returns {Promise<Object>}
 */
const getGuestPreferences = async (guestId) => {
  const guest = await guestRepository.findById(guestId);
  if (!guest) {
    throw new NotFoundError('Guest');
  }

  return {
    preferredRoomCategory: guest.preferred_room_category,
    preferredFloor: guest.preferred_floor,
    preferredView: guest.preferred_view,
    bedPreference: guest.bed_preference,
    pillowPreference: guest.pillow_preference,
    temperaturePreference: guest.temperature_preference,
    dietaryPreferences: guest.dietary_preferences,
    allergies: guest.allergies,
    specialRequests: guest.special_requests,
  };
};

export const guestService = {
  createGuest,
  getGuest,
  updateGuest,
  searchGuests,
  findByEmail,
  findByPhone,
  getVIPGuests,
  getRepeatGuests,
  awardLoyaltyPoints,
  redeemLoyaltyPoints,
  getGuestPreferences,
};
