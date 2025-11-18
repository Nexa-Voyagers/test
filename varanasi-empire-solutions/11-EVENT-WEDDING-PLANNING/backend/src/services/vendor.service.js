import vendorRepository from '../repositories/vendor.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Service for vendor business logic
 */
class VendorService {
  /**
   * Create a new vendor
   * @param {Object} vendorData - Vendor data
   * @returns {Promise<Object>} Created vendor
   */
  async createVendor(vendorData) {
    // Validate required fields
    const errors = this.validateVendorData(vendorData);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    // Generate vendor code if not provided
    if (!vendorData.vendor_code) {
      vendorData.vendor_code = await vendorRepository.generateVendorCode();
    }

    return await vendorRepository.create(vendorData);
  }

  /**
   * Get all vendors with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of vendors
   */
  async getVendors(filters = {}) {
    return await vendorRepository.findAll(filters);
  }

  /**
   * Get vendor by ID
   * @param {string} id - Vendor ID
   * @returns {Promise<Object>} Vendor data
   */
  async getVendorById(id) {
    return await vendorRepository.findById(id);
  }

  /**
   * Search vendors by category, city, and rating
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Array>} Matching vendors
   */
  async searchVendors(searchParams) {
    const { category_id, city, min_rating, max_price } = searchParams;

    let filters = {};

    if (category_id) filters.category_id = category_id;
    if (city) filters.city = city;
    if (min_rating) filters.min_rating = min_rating;
    if (max_price) filters.max_price = max_price;

    return await vendorRepository.findAll(filters);
  }

  /**
   * Get vendors by category
   * @param {string} categoryId - Category ID
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Vendors in category
   */
  async getVendorsByCategory(categoryId, options = {}) {
    return await vendorRepository.findByCategory(categoryId, options);
  }

  /**
   * Get top rated vendors
   * @param {number} limit - Number of vendors
   * @param {string} categoryId - Optional category filter
   * @returns {Promise<Array>} Top rated vendors
   */
  async getTopRatedVendors(limit = 10, categoryId = null) {
    return await vendorRepository.getTopRated(limit, categoryId);
  }

  /**
   * Get available vendors for a date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {string} categoryId - Optional category filter
   * @returns {Promise<Array>} Available vendors
   */
  async getAvailableVendors(startDate, endDate, categoryId = null) {
    return await vendorRepository.getAvailableVendors(startDate, endDate, categoryId);
  }

  /**
   * Update vendor
   * @param {string} id - Vendor ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated vendor
   */
  async updateVendor(id, updateData) {
    // Validate rating if provided
    if (updateData.rating !== undefined) {
      const rating = parseFloat(updateData.rating);
      if (rating < 0 || rating > 5) {
        throw new ValidationError([{ field: 'rating', message: 'Rating must be between 0 and 5' }]);
      }
    }

    // Validate email if provided
    if (updateData.email && !this.isValidEmail(updateData.email)) {
      throw new ValidationError([{ field: 'email', message: 'Invalid email format' }]);
    }

    return await vendorRepository.update(id, updateData);
  }

  /**
   * Delete vendor (soft delete)
   * @param {string} id - Vendor ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteVendor(id) {
    return await vendorRepository.delete(id);
  }

  /**
   * Get vendor booking history
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Array>} Booking history
   */
  async getVendorBookingHistory(vendorId) {
    return await vendorRepository.getBookingHistory(vendorId);
  }

  /**
   * Get vendor performance metrics
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} Performance metrics
   */
  async getVendorPerformance(vendorId) {
    const vendor = await vendorRepository.findById(vendorId);
    const metrics = await vendorRepository.getPerformanceMetrics(vendorId);

    return {
      ...vendor,
      performance: metrics,
    };
  }

  /**
   * Validate vendor data
   * @param {Object} vendorData - Vendor data
   * @returns {Array} Validation errors
   */
  validateVendorData(vendorData) {
    const errors = [];

    if (!vendorData.vendor_name || vendorData.vendor_name.trim() === '') {
      errors.push({ field: 'vendor_name', message: 'Vendor name is required' });
    }

    if (!vendorData.category_id) {
      errors.push({ field: 'category_id', message: 'Category is required' });
    }

    if (!vendorData.phone || vendorData.phone.trim() === '') {
      errors.push({ field: 'phone', message: 'Phone number is required' });
    } else if (!this.isValidPhone(vendorData.phone)) {
      errors.push({ field: 'phone', message: 'Invalid phone number format' });
    }

    if (vendorData.email && !this.isValidEmail(vendorData.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (vendorData.rating !== undefined) {
      const rating = parseFloat(vendorData.rating);
      if (rating < 0 || rating > 5) {
        errors.push({ field: 'rating', message: 'Rating must be between 0 and 5' });
      }
    }

    if (vendorData.services_offered && !Array.isArray(vendorData.services_offered)) {
      errors.push({ field: 'services_offered', message: 'Services offered must be an array' });
    }

    return errors;
  }

  /**
   * Validate email format
   * @param {string} email - Email address
   * @returns {boolean} Valid status
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone number
   * @returns {boolean} Valid status
   */
  isValidPhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    return phoneRegex.test(phone);
  }
}

export default new VendorService();
