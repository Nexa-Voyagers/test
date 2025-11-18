import vendorService from '../services/vendor.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for vendor endpoints
 */
class VendorController {
  /**
   * @route   POST /api/vendors
   * @desc    Create a new vendor
   * @access  Private
   */
  createVendor = asyncHandler(async (req, res) => {
    const vendor = await vendorService.createVendor(req.body);

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: vendor,
    });
  });

  /**
   * @route   GET /api/vendors
   * @desc    Get all vendors with filters
   * @access  Private
   */
  getVendors = asyncHandler(async (req, res) => {
    const filters = {
      category_id: req.query.category_id,
      city: req.query.city,
      is_active: req.query.is_active,
      min_rating: req.query.min_rating ? parseFloat(req.query.min_rating) : undefined,
      max_price: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
      search: req.query.search,
      sort_by: req.query.sort_by,
      sort_order: req.query.sort_order,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    };

    const vendors = await vendorService.getVendors(filters);

    res.json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  });

  /**
   * @route   GET /api/vendors/search
   * @desc    Search vendors
   * @access  Private
   */
  searchVendors = asyncHandler(async (req, res) => {
    const searchParams = {
      category_id: req.query.category_id,
      city: req.query.city,
      min_rating: req.query.min_rating ? parseFloat(req.query.min_rating) : undefined,
      max_price: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
    };

    const vendors = await vendorService.searchVendors(searchParams);

    res.json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  });

  /**
   * @route   GET /api/vendors/top-rated
   * @desc    Get top rated vendors
   * @access  Private
   */
  getTopRatedVendors = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const { category_id } = req.query;

    const vendors = await vendorService.getTopRatedVendors(limit, category_id);

    res.json({
      success: true,
      data: vendors,
    });
  });

  /**
   * @route   GET /api/vendors/available
   * @desc    Get available vendors for a date range
   * @access  Private
   */
  getAvailableVendors = asyncHandler(async (req, res) => {
    const { start_date, end_date, category_id } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
      });
    }

    const vendors = await vendorService.getAvailableVendors(start_date, end_date, category_id);

    res.json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  });

  /**
   * @route   GET /api/vendors/:id
   * @desc    Get vendor by ID
   * @access  Private
   */
  getVendorById = asyncHandler(async (req, res) => {
    const vendor = await vendorService.getVendorById(req.params.id);

    res.json({
      success: true,
      data: vendor,
    });
  });

  /**
   * @route   GET /api/vendors/:id/performance
   * @desc    Get vendor performance metrics
   * @access  Private
   */
  getVendorPerformance = asyncHandler(async (req, res) => {
    const performance = await vendorService.getVendorPerformance(req.params.id);

    res.json({
      success: true,
      data: performance,
    });
  });

  /**
   * @route   GET /api/vendors/:id/bookings
   * @desc    Get vendor booking history
   * @access  Private
   */
  getVendorBookings = asyncHandler(async (req, res) => {
    const bookings = await vendorService.getVendorBookingHistory(req.params.id);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  });

  /**
   * @route   PUT /api/vendors/:id
   * @desc    Update vendor
   * @access  Private
   */
  updateVendor = asyncHandler(async (req, res) => {
    const vendor = await vendorService.updateVendor(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Vendor updated successfully',
      data: vendor,
    });
  });

  /**
   * @route   DELETE /api/vendors/:id
   * @desc    Delete vendor (soft delete)
   * @access  Private
   */
  deleteVendor = asyncHandler(async (req, res) => {
    await vendorService.deleteVendor(req.params.id);

    res.json({
      success: true,
      message: 'Vendor deleted successfully',
    });
  });
}

export default new VendorController();
