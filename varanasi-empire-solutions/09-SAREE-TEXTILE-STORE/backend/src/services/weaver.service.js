import weaverRepository from '../repositories/weaver.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Weaver Service
 * Business logic for weaver management
 */
class WeaverService {
  /**
   * Create a new weaver
   * @param {Object} weaverData - Weaver information
   * @returns {Promise<Object>} Created weaver
   */
  async createWeaver(weaverData) {
    // Validate required fields
    if (!weaverData.weaver_name) {
      throw new BadRequestError('Weaver name is required');
    }

    if (!weaverData.phone) {
      throw new BadRequestError('Phone number is required');
    }

    // Validate phone format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(weaverData.phone.replace(/[^0-9]/g, ''))) {
      throw new BadRequestError('Invalid phone number format');
    }

    // Validate email if provided
    if (weaverData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(weaverData.email)) {
        throw new BadRequestError('Invalid email format');
      }
    }

    // Validate quality rating if provided
    if (weaverData.quality_rating !== undefined) {
      const rating = parseFloat(weaverData.quality_rating);
      if (rating < 0 || rating > 10) {
        throw new BadRequestError('Quality rating must be between 0 and 10');
      }
    }

    return await weaverRepository.create(weaverData);
  }

  /**
   * Get weaver by ID
   * @param {number} id - Weaver ID
   * @returns {Promise<Object>} Weaver details
   */
  async getWeaverById(id) {
    const weaver = await weaverRepository.findById(id);
    if (!weaver) {
      throw new NotFoundError('Weaver not found');
    }
    return weaver;
  }

  /**
   * Get all weavers with filters and pagination
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Weavers list with metadata
   */
  async getAllWeavers(filters = {}) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const offset = (page - 1) * limit;

    const queryFilters = {
      ...filters,
      limit,
      offset
    };

    const [weavers, total] = await Promise.all([
      weaverRepository.findAll(queryFilters),
      weaverRepository.count(filters)
    ]);

    return {
      data: weavers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update weaver
   * @param {number} id - Weaver ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated weaver
   */
  async updateWeaver(id, updates) {
    const weaver = await weaverRepository.findById(id);
    if (!weaver) {
      throw new NotFoundError('Weaver not found');
    }

    // Validate phone if updating
    if (updates.phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(updates.phone.replace(/[^0-9]/g, ''))) {
        throw new BadRequestError('Invalid phone number format');
      }
    }

    // Validate email if updating
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        throw new BadRequestError('Invalid email format');
      }
    }

    // Validate quality rating if updating
    if (updates.quality_rating !== undefined) {
      const rating = parseFloat(updates.quality_rating);
      if (rating < 0 || rating > 10) {
        throw new BadRequestError('Quality rating must be between 0 and 10');
      }
    }

    return await weaverRepository.update(id, updates);
  }

  /**
   * Update weaver quality rating
   * @param {number} id - Weaver ID
   * @param {number} rating - New quality rating
   * @returns {Promise<Object>} Updated weaver
   */
  async updateQualityRating(id, rating) {
    const weaver = await weaverRepository.findById(id);
    if (!weaver) {
      throw new NotFoundError('Weaver not found');
    }

    const numRating = parseFloat(rating);
    if (numRating < 0 || numRating > 10) {
      throw new BadRequestError('Quality rating must be between 0 and 10');
    }

    return await weaverRepository.updateQualityRating(id, numRating);
  }

  /**
   * Delete weaver (soft delete)
   * @param {number} id - Weaver ID
   * @returns {Promise<Object>} Success message
   */
  async deleteWeaver(id) {
    const weaver = await weaverRepository.findById(id);
    if (!weaver) {
      throw new NotFoundError('Weaver not found');
    }

    await weaverRepository.delete(id);

    return { message: 'Weaver deleted successfully' };
  }

  /**
   * Search weavers
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching weavers
   */
  async searchWeavers(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestError('Search term must be at least 2 characters');
    }

    return await weaverRepository.search(searchTerm);
  }

  /**
   * Get weaver order history
   * @param {number} id - Weaver ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Order history with pagination
   */
  async getWeaverOrderHistory(id, options = {}) {
    const weaver = await weaverRepository.findById(id);
    if (!weaver) {
      throw new NotFoundError('Weaver not found');
    }

    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 50;
    const offset = (page - 1) * limit;

    const orders = await weaverRepository.getOrderHistory(id, { limit, offset });

    return {
      weaver_id: id,
      weaver_name: weaver.weaver_name,
      data: orders,
      pagination: {
        page,
        limit
      }
    };
  }

  /**
   * Get weaver performance statistics
   * @param {number} id - Weaver ID
   * @returns {Promise<Object>} Performance statistics
   */
  async getWeaverPerformance(id) {
    const weaver = await weaverRepository.findById(id);
    if (!weaver) {
      throw new NotFoundError('Weaver not found');
    }

    const stats = await weaverRepository.getPerformanceStats(id);

    return {
      weaver_id: id,
      weaver_name: weaver.weaver_name,
      quality_rating: weaver.quality_rating,
      specialization: weaver.specialization,
      performance: {
        ...stats,
        total_business: parseFloat(stats.total_business || 0),
        avg_delivery_days: parseFloat(stats.avg_delivery_days || 0)
      }
    };
  }

  /**
   * Get top rated weavers
   * @param {number} limit - Number of weavers to return
   * @returns {Promise<Array>} Top rated weavers
   */
  async getTopRatedWeavers(limit = 10) {
    if (limit < 1 || limit > 100) {
      throw new BadRequestError('Limit must be between 1 and 100');
    }

    return await weaverRepository.getTopRated(limit);
  }
}

export default new WeaverService();
