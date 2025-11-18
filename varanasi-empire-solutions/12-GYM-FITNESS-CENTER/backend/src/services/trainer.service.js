import trainerRepository from '../repositories/trainer.repository.js';
import { ValidationError, ConflictError } from '../utils/errors.js';

/**
 * Trainer Service
 * Business logic for trainer operations
 */
class TrainerService {
  /**
   * Create a new trainer
   * @param {Object} trainerData - Trainer data
   * @returns {Promise<Object>} Created trainer
   */
  async createTrainer(trainerData) {
    // Validate required fields
    if (!trainerData.gym_id || !trainerData.first_name || !trainerData.last_name || !trainerData.email || !trainerData.phone) {
      throw new ValidationError(['gym_id, first_name, last_name, email, and phone are required']);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trainerData.email)) {
      throw new ValidationError(['Invalid email format']);
    }

    // Check if email already exists
    const existingEmail = await trainerRepository.findByEmail(trainerData.email);
    if (existingEmail) {
      throw new ConflictError('Email already registered');
    }

    // Validate hourly rate
    if (trainerData.hourly_rate && trainerData.hourly_rate < 0) {
      throw new ValidationError(['Hourly rate cannot be negative']);
    }

    return await trainerRepository.create(trainerData);
  }

  /**
   * Get all trainers
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Trainers and metadata
   */
  async getAllTrainers(filters = {}) {
    const trainers = await trainerRepository.findAll(filters);
    const total = await trainerRepository.count(filters);

    return {
      trainers,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50
    };
  }

  /**
   * Get trainer by ID
   * @param {number} id - Trainer ID
   * @returns {Promise<Object>} Trainer data
   */
  async getTrainerById(id) {
    return await trainerRepository.findById(id);
  }

  /**
   * Get trainer with statistics
   * @param {number} id - Trainer ID
   * @returns {Promise<Object>} Trainer with statistics
   */
  async getTrainerWithStats(id) {
    return await trainerRepository.findWithStats(id);
  }

  /**
   * Update trainer
   * @param {number} id - Trainer ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated trainer
   */
  async updateTrainer(id, updateData) {
    // Validate email if provided
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        throw new ValidationError(['Invalid email format']);
      }

      // Check if email is taken by another trainer
      const existing = await trainerRepository.findByEmail(updateData.email);
      if (existing && existing.trainer_id !== id) {
        throw new ConflictError('Email already registered');
      }
    }

    // Validate hourly rate if provided
    if (updateData.hourly_rate !== undefined && updateData.hourly_rate < 0) {
      throw new ValidationError(['Hourly rate cannot be negative']);
    }

    return await trainerRepository.update(id, updateData);
  }

  /**
   * Delete trainer
   * @param {number} id - Trainer ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteTrainer(id) {
    return await trainerRepository.delete(id);
  }

  /**
   * Get active trainers by gym
   * @param {number} gymId - Gym ID
   * @returns {Promise<Array>} Active trainers
   */
  async getActiveTrainersByGym(gymId) {
    return await trainerRepository.findActiveByGym(gymId);
  }

  /**
   * Check trainer availability
   * @param {number} trainerId - Trainer ID
   * @param {Date} sessionDate - Session date
   * @param {string} startTime - Start time
   * @param {string} endTime - End time
   * @param {number} excludeSessionId - Session ID to exclude
   * @returns {Promise<boolean>} Availability status
   */
  async checkAvailability(trainerId, sessionDate, startTime, endTime, excludeSessionId = null) {
    return await trainerRepository.checkAvailability(trainerId, sessionDate, startTime, endTime, excludeSessionId);
  }

  /**
   * Get trainer schedule
   * @param {number} trainerId - Trainer ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Trainer schedule
   */
  async getTrainerSchedule(trainerId, startDate, endDate) {
    return await trainerRepository.getSchedule(trainerId, startDate, endDate);
  }

  /**
   * Get trainers by specialization
   * @param {string} specialization - Specialization
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Array>} Trainers
   */
  async getTrainersBySpecialization(specialization, gymId = null) {
    return await trainerRepository.findBySpecialization(specialization, gymId);
  }
}

export default new TrainerService();
