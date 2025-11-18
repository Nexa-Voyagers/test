import companyRepository from '../repositories/company.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Service for event company business logic
 */
class CompanyService {
  /**
   * Create a new company
   * @param {Object} companyData - Company data
   * @returns {Promise<Object>} Created company
   */
  async createCompany(companyData) {
    // Validate required fields
    if (!companyData.company_name) {
      throw new ValidationError([{ field: 'company_name', message: 'Company name is required' }]);
    }

    // Validate specialization array
    if (companyData.specialization && !Array.isArray(companyData.specialization)) {
      throw new ValidationError([{ field: 'specialization', message: 'Specialization must be an array' }]);
    }

    return await companyRepository.create(companyData);
  }

  /**
   * Get all companies with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of companies
   */
  async getCompanies(filters = {}) {
    return await companyRepository.findAll(filters);
  }

  /**
   * Get company by ID
   * @param {string} id - Company ID
   * @returns {Promise<Object>} Company data
   */
  async getCompanyById(id) {
    return await companyRepository.findById(id);
  }

  /**
   * Get company with statistics
   * @param {string} id - Company ID
   * @returns {Promise<Object>} Company with statistics
   */
  async getCompanyWithStats(id) {
    const company = await companyRepository.findById(id);
    const statistics = await companyRepository.getStatistics(id);

    return {
      ...company,
      statistics,
    };
  }

  /**
   * Update company
   * @param {string} id - Company ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated company
   */
  async updateCompany(id, updateData) {
    // Validate specialization array if provided
    if (updateData.specialization && !Array.isArray(updateData.specialization)) {
      throw new ValidationError([{ field: 'specialization', message: 'Specialization must be an array' }]);
    }

    return await companyRepository.update(id, updateData);
  }

  /**
   * Delete company (soft delete)
   * @param {string} id - Company ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCompany(id) {
    return await companyRepository.delete(id);
  }

  /**
   * Get company statistics
   * @param {string} id - Company ID
   * @returns {Promise<Object>} Statistics
   */
  async getCompanyStatistics(id) {
    return await companyRepository.getStatistics(id);
  }

  /**
   * Validate company data
   * @param {Object} companyData - Company data
   * @returns {Array} Validation errors
   */
  validateCompanyData(companyData) {
    const errors = [];

    if (!companyData.company_name || companyData.company_name.trim() === '') {
      errors.push({ field: 'company_name', message: 'Company name is required' });
    }

    if (companyData.email && !this.isValidEmail(companyData.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (companyData.gstin && companyData.gstin.length !== 15) {
      errors.push({ field: 'gstin', message: 'GSTIN must be 15 characters' });
    }

    if (companyData.phone && !this.isValidPhone(companyData.phone)) {
      errors.push({ field: 'phone', message: 'Invalid phone number format' });
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

export default new CompanyService();
