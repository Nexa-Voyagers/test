import vendorCategoryRepository from '../repositories/vendor-category.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Service for vendor category business logic
 */
class VendorCategoryService {
  /**
   * Create a new vendor category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    if (!categoryData.category_name || categoryData.category_name.trim() === '') {
      throw new ValidationError([{ field: 'category_name', message: 'Category name is required' }]);
    }

    return await vendorCategoryRepository.create(categoryData);
  }

  /**
   * Get all vendor categories
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of categories
   */
  async getCategories(filters = {}) {
    return await vendorCategoryRepository.findAll(filters);
  }

  /**
   * Get category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Category data
   */
  async getCategoryById(id) {
    return await vendorCategoryRepository.findById(id);
  }

  /**
   * Get category with vendors
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Category with vendors
   */
  async getCategoryWithVendors(id) {
    return await vendorCategoryRepository.findByIdWithVendors(id);
  }

  /**
   * Get popular categories
   * @param {number} limit - Number of categories
   * @returns {Promise<Array>} Popular categories
   */
  async getPopularCategories(limit = 10) {
    return await vendorCategoryRepository.getPopularCategories(limit);
  }

  /**
   * Update category
   * @param {string} id - Category ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(id, updateData) {
    if (!updateData.category_name || updateData.category_name.trim() === '') {
      throw new ValidationError([{ field: 'category_name', message: 'Category name is required' }]);
    }

    return await vendorCategoryRepository.update(id, updateData);
  }

  /**
   * Delete category
   * @param {string} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCategory(id) {
    return await vendorCategoryRepository.delete(id);
  }

  /**
   * Get category statistics
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Category statistics
   */
  async getCategoryStatistics(id) {
    return await vendorCategoryRepository.getStatistics(id);
  }
}

export default new VendorCategoryService();
