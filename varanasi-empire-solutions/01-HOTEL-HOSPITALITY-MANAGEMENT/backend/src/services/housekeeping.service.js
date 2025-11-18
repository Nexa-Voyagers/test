import { housekeepingRepository } from '../repositories/housekeeping.repository.js';
import { roomRepository } from '../repositories/room.repository.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Get rooms needing cleaning
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array>}
 */
const getRoomsNeedingCleaning = async (propertyId) => {
  return await housekeepingRepository.getRoomsNeedingCleaning(propertyId);
};

/**
 * Get rooms for inspection
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array>}
 */
const getRoomsForInspection = async (propertyId) => {
  return await housekeepingRepository.getRoomsForInspection(propertyId);
};

/**
 * Get cleaned and ready rooms
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array>}
 */
const getCleanedRooms = async (propertyId) => {
  return await housekeepingRepository.getCleanedRooms(propertyId);
};

/**
 * Create housekeeping task
 * @param {Object} taskData - Task data
 * @returns {Promise<Object>}
 */
const createTask = async (taskData) => {
  const room = await roomRepository.findById(taskData.room_id);
  if (!room) {
    throw new NotFoundError('Room');
  }

  return await housekeepingRepository.createTask(taskData);
};

/**
 * Get tasks by property
 * @param {string} propertyId - Property ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
const getTasksByProperty = async (propertyId, options = {}) => {
  return await housekeepingRepository.getTasksByProperty(propertyId, options);
};

/**
 * Assign task to staff
 * @param {string} taskId - Task ID
 * @param {string} staffId - Staff user ID
 * @returns {Promise<Object>}
 */
const assignTask = async (taskId, staffId) => {
  return await housekeepingRepository.assignTask(taskId, staffId);
};

/**
 * Start cleaning room
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const startCleaning = async (roomId) => {
  const room = await roomRepository.findById(roomId);
  if (!room) {
    throw new NotFoundError('Room');
  }

  return await housekeepingRepository.startCleaning(roomId);
};

/**
 * Mark room as ready for inspection
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const completeCleaning = async (roomId) => {
  const room = await roomRepository.findById(roomId);
  if (!room) {
    throw new NotFoundError('Room');
  }

  // Mark for inspection
  await roomRepository.updateHousekeepingStatus(roomId, 'CLEANING_IN_PROGRESS');

  return await roomRepository.findById(roomId);
};

/**
 * Inspect and approve room
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const inspectRoom = async (roomId) => {
  const room = await roomRepository.findById(roomId);
  if (!room) {
    throw new NotFoundError('Room');
  }

  return await housekeepingRepository.inspectAndApproveRoom(roomId);
};

/**
 * Mark room as clean and available
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const markRoomClean = async (roomId) => {
  const room = await roomRepository.findById(roomId);
  if (!room) {
    throw new NotFoundError('Room');
  }

  return await housekeepingRepository.markRoomClean(roomId);
};

/**
 * Get housekeeping statistics
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>}
 */
const getStats = async (propertyId) => {
  return await housekeepingRepository.getStats(propertyId);
};

/**
 * Get room maintenance schedule
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array>}
 */
const getMaintenanceSchedule = async (propertyId) => {
  // This would query the database for rooms with maintenance due
  // Placeholder implementation
  return [];
};

export const housekeepingService = {
  getRoomsNeedingCleaning,
  getRoomsForInspection,
  getCleanedRooms,
  createTask,
  getTasksByProperty,
  assignTask,
  startCleaning,
  completeCleaning,
  inspectRoom,
  markRoomClean,
  getStats,
  getMaintenanceSchedule,
};
