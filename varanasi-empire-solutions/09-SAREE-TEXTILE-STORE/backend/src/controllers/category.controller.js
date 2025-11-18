import categoryService from '../services/category.service.js';

/**
 * Category Controller
 * Handles HTTP requests for product category management
 */
class CategoryController {
  /**
   * Create a new category
   * @route POST /api/v1/categories
   */
  async createCategory(req, res) {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  }

  /**
   * Get category by ID
   * @route GET /api/v1/categories/:id
   */
  async getCategoryById(req, res) {
    const { with_count } = req.query;
    const category = await categoryService.getCategoryById(
      req.params.id,
      with_count === 'true'
    );
    res.json({
      success: true,
      data: category
    });
  }

  /**
   * Get all categories
   * @route GET /api/v1/categories
   */
  async getAllCategories(req, res) {
    const categories = await categoryService.getAllCategories(req.query);
    res.json({
      success: true,
      data: categories
    });
  }

  /**
   * Get category hierarchy
   * @route GET /api/v1/categories/hierarchy
   */
  async getCategoryHierarchy(req, res) {
    const hierarchy = await categoryService.getCategoryHierarchy();
    res.json({
      success: true,
      data: hierarchy
    });
  }

  /**
   * Get root categories
   * @route GET /api/v1/categories/root
   */
  async getRootCategories(req, res) {
    const categories = await categoryService.getRootCategories();
    res.json({
      success: true,
      data: categories
    });
  }

  /**
   * Get subcategories
   * @route GET /api/v1/categories/:id/subcategories
   */
  async getSubcategories(req, res) {
    const subcategories = await categoryService.getSubcategories(req.params.id);
    res.json({
      success: true,
      data: subcategories
    });
  }

  /**
   * Update category
   * @route PUT /api/v1/categories/:id
   */
  async updateCategory(req, res) {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  }

  /**
   * Delete category
   * @route DELETE /api/v1/categories/:id
   */
  async deleteCategory(req, res) {
    const { force } = req.query;
    const result = await categoryService.deleteCategory(req.params.id, force === 'true');
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Search categories
   * @route GET /api/v1/categories/search
   */
  async searchCategories(req, res) {
    const { q } = req.query;
    const categories = await categoryService.searchCategories(q);
    res.json({
      success: true,
      data: categories
    });
  }
}

export default new CategoryController();
