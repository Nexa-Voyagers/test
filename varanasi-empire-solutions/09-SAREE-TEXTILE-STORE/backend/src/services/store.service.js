import storeRepository from '../repositories/store.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Store Service
 * Business logic for textile store management
 */
class StoreService {
  /**
   * Create a new textile store
   * @param {Object} storeData - Store information
   * @returns {Promise<Object>} Created store
   */
  async createStore(storeData) {
    // Validate required fields
    if (!storeData.store_name) {
      throw new BadRequestError('Store name is required');
    }

    if (!storeData.owner_name) {
      throw new BadRequestError('Owner name is required');
    }

    if (!storeData.phone) {
      throw new BadRequestError('Phone number is required');
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(storeData.phone.replace(/[^0-9]/g, ''))) {
      throw new BadRequestError('Invalid phone number format');
    }

    // Validate email if provided
    if (storeData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(storeData.email)) {
        throw new BadRequestError('Invalid email format');
      }
    }

    // Validate GST number if provided
    if (storeData.gst_number) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(storeData.gst_number)) {
        throw new BadRequestError('Invalid GST number format');
      }
    }

    return await storeRepository.create(storeData);
  }

  /**
   * Get store by ID
   * @param {number} id - Store ID
   * @returns {Promise<Object>} Store details
   */
  async getStoreById(id) {
    const store = await storeRepository.findById(id);
    if (!store) {
      throw new NotFoundError('Store not found');
    }
    return store;
  }

  /**
   * Get all stores with filters and pagination
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Stores list with metadata
   */
  async getAllStores(filters = {}) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const offset = (page - 1) * limit;

    const queryFilters = {
      ...filters,
      limit,
      offset
    };

    const [stores, total] = await Promise.all([
      storeRepository.findAll(queryFilters),
      storeRepository.count(filters)
    ]);

    return {
      data: stores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update store
   * @param {number} id - Store ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated store
   */
  async updateStore(id, updates) {
    // Check if store exists
    const store = await storeRepository.findById(id);
    if (!store) {
      throw new NotFoundError('Store not found');
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

    // Validate GST if updating
    if (updates.gst_number) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(updates.gst_number)) {
        throw new BadRequestError('Invalid GST number format');
      }
    }

    return await storeRepository.update(id, updates);
  }

  /**
   * Delete store (soft delete)
   * @param {number} id - Store ID
   * @returns {Promise<Object>} Success message
   */
  async deleteStore(id) {
    const store = await storeRepository.findById(id);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    await storeRepository.delete(id);

    return { message: 'Store deleted successfully' };
  }

  /**
   * Search stores
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching stores
   */
  async searchStores(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestError('Search term must be at least 2 characters');
    }

    return await storeRepository.search(searchTerm);
  }

  /**
   * Get store statistics
   * @param {number} id - Store ID
   * @returns {Promise<Object>} Store statistics
   */
  async getStoreStatistics(id) {
    const store = await this.getStoreById(id);

    // This would typically aggregate data from other tables
    // For now, returning basic info
    return {
      store_id: store.store_id,
      store_name: store.store_name,
      is_active: store.is_active,
      created_at: store.created_at
      // TODO: Add product count, sales stats, etc.
    };
  }
}

export default new StoreService();
