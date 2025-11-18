import { roomRepository } from '../repositories/room.repository.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Create room
 * @param {Object} roomData - Room data
 * @returns {Promise<Object>}
 */
const createRoom = async (roomData) => {
  return await roomRepository.create(roomData);
};

/**
 * Get room details
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const getRoom = async (roomId) => {
  const room = await roomRepository.findWithCategory(roomId);
  if (!room) {
    throw new NotFoundError('Room');
  }
  return room;
};

/**
 * Get rooms by property
 * @param {string} propertyId - Property ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const getRoomsByProperty = async (propertyId, options = {}) => {
  return await roomRepository.findByProperty(propertyId, options);
};

/**
 * Update room
 * @param {string} roomId - Room ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 */
const updateRoom = async (roomId, updateData) => {
  const room = await roomRepository.findById(roomId);
  if (!room) {
    throw new NotFoundError('Room');
  }

  if (updateData.operational_status) {
    await roomRepository.updateStatus(roomId, updateData.operational_status);
  }

  if (updateData.housekeeping_status) {
    await roomRepository.updateHousekeepingStatus(roomId, updateData.housekeeping_status);
  }

  return await roomRepository.findById(roomId);
};

/**
 * Check room availability
 * @param {string} propertyId - Property ID
 * @param {string} categoryId - Room category ID
 * @param {string} checkInDate - Check-in date
 * @param {string} checkOutDate - Check-out date
 * @returns {Promise<Array>}
 */
const checkAvailability = async (propertyId, categoryId, checkInDate, checkOutDate) => {
  return await roomRepository.findAvailableRooms(propertyId, categoryId, checkInDate, checkOutDate);
};

/**
 * Get room status summary
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>}
 */
const getRoomStatusSummary = async (propertyId) => {
  const rooms = await roomRepository.findByProperty(propertyId, { limit: 1000 });

  const summary = {
    total: rooms.totalCount,
    available: 0,
    occupied: 0,
    cleaning: 0,
    maintenance: 0,
    blocked: 0,
  };

  rooms.rooms.forEach(room => {
    switch (room.operational_status) {
      case 'AVAILABLE':
        summary.available++;
        break;
      case 'OCCUPIED':
        summary.occupied++;
        break;
      case 'CLEANING':
        summary.cleaning++;
        break;
      case 'MAINTENANCE':
        summary.maintenance++;
        break;
      case 'BLOCKED':
        summary.blocked++;
        break;
    }
  });

  summary.occupancyRate = ((summary.occupied / summary.total) * 100).toFixed(2);

  return summary;
};

/**
 * Mark room as available
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const markAvailable = async (roomId) => {
  const room = await roomRepository.findById(roomId);
  if (!room) {
    throw new NotFoundError('Room');
  }

  return await roomRepository.updateStatus(roomId, 'AVAILABLE');
};

/**
 * Mark room for maintenance
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const markMaintenance = async (roomId) => {
  const room = await roomRepository.findById(roomId);
  if (!room) {
    throw new NotFoundError('Room');
  }

  return await roomRepository.updateStatus(roomId, 'MAINTENANCE');
};

/**
 * Mark room as blocked
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const blockRoom = async (roomId) => {
  const room = await roomRepository.findById(roomId);
  if (!room) {
    throw new NotFoundError('Room');
  }

  return await roomRepository.updateStatus(roomId, 'BLOCKED');
};

export const roomService = {
  createRoom,
  getRoom,
  getRoomsByProperty,
  updateRoom,
  checkAvailability,
  getRoomStatusSummary,
  markAvailable,
  markMaintenance,
  blockRoom,
};
