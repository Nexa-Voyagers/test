import vendorCategoryService from '../services/vendor-category.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for vendor category endpoints
 */
class VendorCategoryController {
  /**
   * @route   POST /api/vendor-categories
   * @desc    Create a new vendor category
   * @access  Private
   */
  createCategory = asyncHandler(async (req, res) => {
    const category = await vendorCategoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: 'Vendor category created successfully',
      data: category,
    });
  });

  /**
   * @route   GET /api/vendor-categories
   * @desc    Get all vendor categories
   * @access  Private
   */
  getCategories = asyncHandler(async (req, res) => {
    const filters = {
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    };

    const categories = await vendorCategoryService.getCategories(filters);

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  });

  /**
   * @route   GET /api/vendor-categories/popular
   * @desc    Get popular vendor categories
   * @access  Private
   */
  getPopularCategories = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const categories = await vendorCategoryService.getPopularCategories(limit);

    res.json({
      success: true,
      data: categories,
    });
  });

  /**
   * @route   GET /api/vendor-categories/:id
   * @desc    Get category by ID
   * @access  Private
   */
  getCategoryById = asyncHandler(async (req, res) => {
    const category = await vendorCategoryService.getCategoryById(req.params.id);

    res.json({
      success: true,
      data: category,
    });
  });

  /**
   * @route   GET /api/vendor-categories/:id/vendors
   * @desc    Get category with vendors
   * @access  Private
   */
  getCategoryWithVendors = asyncHandler(async (req, res) => {
    const categoryWithVendors = await vendorCategoryService.getCategoryWithVendors(req.params.id);

    res.json({
      success: true,
      data: categoryWithVendors,
    });
  });

  /**
   * @route   PUT /api/vendor-categories/:id
   * @desc    Update category
   * @access  Private
   */
  updateCategory = asyncHandler(async (req, res) => {
    const category = await vendorCategoryService.updateCategory(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  });

  /**
   * @route   DELETE /api/vendor-categories/:id
   * @desc    Delete category
   * @access  Private
   */
  deleteCategory = asyncHandler(async (req, res) => {
    await vendorCategoryService.deleteCategory(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  });

  /**
   * @route   GET /api/vendor-categories/:id/statistics
   * @desc    Get category statistics
   * @access  Private
   */
  getCategoryStatistics = asyncHandler(async (req, res) => {
    const statistics = await vendorCategoryService.getCategoryStatistics(req.params.id);

    res.json({
      success: true,
      data: statistics,
    });
  });
}

export default new VendorCategoryController();
