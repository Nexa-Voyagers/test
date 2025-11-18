import gymRepository from '../repositories/gym.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Gym Service
 * Business logic for gym operations
 */
class GymService {
  /**
   * Create a new gym
   * @param {Object} gymData - Gym data
   * @returns {Promise<Object>} Created gym
   */
  async createGym(gymData) {
    // Validate required fields
    if (!gymData.name || !gymData.city || !gymData.capacity) {
      throw new ValidationError(['Name, city, and capacity are required']);
    }

    // Validate capacity
    if (gymData.capacity < 1) {
      throw new ValidationError(['Capacity must be at least 1']);
    }

    return await gymRepository.create(gymData);
  }

  /**
   * Get all gyms
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Gyms and metadata
   */
  async getAllGyms(filters = {}) {
    const gyms = await gymRepository.findAll(filters);
    const total = await gymRepository.count(filters);

    return {
      gyms,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50
    };
  }

  /**
   * Get gym by ID
   * @param {number} id - Gym ID
   * @returns {Promise<Object>} Gym data
   */
  async getGymById(id) {
    return await gymRepository.findById(id);
  }

  /**
   * Get gym with statistics
   * @param {number} id - Gym ID
   * @returns {Promise<Object>} Gym with statistics
   */
  async getGymWithStats(id) {
    const gym = await gymRepository.findById(id);
    const stats = await gymRepository.getStatistics(id);

    return {
      ...gym,
      statistics: stats
    };
  }

  /**
   * Update gym
   * @param {number} id - Gym ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated gym
   */
  async updateGym(id, updateData) {
    if (updateData.capacity && updateData.capacity < 1) {
      throw new ValidationError(['Capacity must be at least 1']);
    }

    return await gymRepository.update(id, updateData);
  }

  /**
   * Delete gym
   * @param {number} id - Gym ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteGym(id) {
    return await gymRepository.delete(id);
  }

  /**
   * Get active gyms
   * @returns {Promise<Array>} Active gyms
   */
  async getActiveGyms() {
    return await gymRepository.findActive();
  }

  /**
   * Search gyms
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching gyms
   */
  async searchGyms(searchTerm) {
    return await gymRepository.findAll({ search: searchTerm, limit: 20 });
  }
}

export default new GymService();
