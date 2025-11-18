import categoryRepository from '../repositories/category.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Category Service
 * Business logic for product category management
 */
class CategoryService {
  /**
   * Create a new category
   * @param {Object} categoryData - Category information
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    // Validate required fields
    if (!categoryData.category_name) {
      throw new BadRequestError('Category name is required');
    }

    // If parent category is specified, verify it exists
    if (categoryData.parent_category_id) {
      const parentCategory = await categoryRepository.findById(categoryData.parent_category_id);
      if (!parentCategory) {
        throw new NotFoundError('Parent category not found');
      }
    }

    return await categoryRepository.create(categoryData);
  }

  /**
   * Get category by ID
   * @param {number} id - Category ID
   * @param {boolean} withProductCount - Include product count
   * @returns {Promise<Object>} Category details
   */
  async getCategoryById(id, withProductCount = false) {
    let category;

    if (withProductCount) {
      category = await categoryRepository.findByIdWithProductCount(id);
    } else {
      category = await categoryRepository.findById(id);
    }

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  /**
   * Get all categories with filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Categories list
   */
  async getAllCategories(filters = {}) {
    return await categoryRepository.findAll(filters);
  }

  /**
   * Get category hierarchy
   * @returns {Promise<Array>} Hierarchical category tree
   */
  async getCategoryHierarchy() {
    return await categoryRepository.getHierarchy();
  }

  /**
   * Get subcategories for a parent category
   * @param {number} parentId - Parent category ID
   * @returns {Promise<Array>} Subcategories
   */
  async getSubcategories(parentId) {
    const parentCategory = await categoryRepository.findById(parentId);
    if (!parentCategory) {
      throw new NotFoundError('Parent category not found');
    }

    return await categoryRepository.getSubcategories(parentId);
  }

  /**
   * Update category
   * @param {number} id - Category ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(id, updates) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // If updating parent category, verify it exists and prevent circular reference
    if (updates.parent_category_id !== undefined) {
      if (updates.parent_category_id === id) {
        throw new BadRequestError('Category cannot be its own parent');
      }

      if (updates.parent_category_id !== null) {
        const parentCategory = await categoryRepository.findById(updates.parent_category_id);
        if (!parentCategory) {
          throw new NotFoundError('Parent category not found');
        }

        // Check if the new parent is a descendant of this category
        // This would create a circular reference
        const isDescendant = await this.isDescendantOf(updates.parent_category_id, id);
        if (isDescendant) {
          throw new BadRequestError('Cannot set a descendant category as parent (circular reference)');
        }
      }
    }

    return await categoryRepository.update(id, updates);
  }

  /**
   * Delete category
   * @param {number} id - Category ID
   * @param {boolean} force - Force delete even with products/subcategories
   * @returns {Promise<Object>} Success message
   */
  async deleteCategory(id, force = false) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (!force) {
      // Check if category has products
      const hasProducts = await categoryRepository.hasProducts(id);
      if (hasProducts) {
        throw new BadRequestError('Cannot delete category with products. Move or delete products first.');
      }

      // Check if category has subcategories
      const hasSubcategories = await categoryRepository.hasSubcategories(id);
      if (hasSubcategories) {
        throw new BadRequestError('Cannot delete category with subcategories. Delete subcategories first.');
      }
    }

    await categoryRepository.delete(id);

    return { message: 'Category deleted successfully' };
  }

  /**
   * Search categories
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching categories
   */
  async searchCategories(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestError('Search term must be at least 2 characters');
    }

    return await categoryRepository.search(searchTerm);
  }

  /**
   * Check if a category is descendant of another
   * @param {number} categoryId - Category to check
   * @param {number} potentialAncestorId - Potential ancestor ID
   * @returns {Promise<boolean>} True if descendant
   */
  async isDescendantOf(categoryId, potentialAncestorId) {
    const category = await categoryRepository.findById(categoryId);
    if (!category || !category.parent_category_id) {
      return false;
    }

    if (category.parent_category_id === potentialAncestorId) {
      return true;
    }

    // Recursively check parent
    return await this.isDescendantOf(category.parent_category_id, potentialAncestorId);
  }

  /**
   * Get root categories (categories without parent)
   * @returns {Promise<Array>} Root categories
   */
  async getRootCategories() {
    return await categoryRepository.findAll({ parent_category_id: null });
  }
}

export default new CategoryService();
