import firmRepository from '../repositories/firm.repository.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Service Firm Service
 * Business logic for service firm operations
 */
class FirmService {
  /**
   * Create a new service firm
   * @param {Object} firmData - Firm data
   * @returns {Promise<Object>} Created firm
   */
  async createFirm(firmData) {
    // Validate firm type
    const validFirmTypes = ['LEGAL', 'CONSULTING', 'ADVISORY', 'AUDIT'];
    if (firmData.firm_type && !validFirmTypes.includes(firmData.firm_type)) {
      throw new Error(`Invalid firm type. Must be one of: ${validFirmTypes.join(', ')}`);
    }

    return await firmRepository.create(firmData);
  }

  /**
   * Get firm by ID
   * @param {string} id - Firm ID
   * @returns {Promise<Object>} Firm object
   */
  async getFirmById(id) {
    const firm = await firmRepository.findById(id);

    if (!firm) {
      throw new NotFoundError('Service firm');
    }

    return firm;
  }

  /**
   * Get all firms with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Firms and pagination info
   */
  async getAllFirms(options) {
    return await firmRepository.findAll(options);
  }

  /**
   * Update firm
   * @param {string} id - Firm ID
   * @param {Object} firmData - Updated firm data
   * @returns {Promise<Object>} Updated firm
   */
  async updateFirm(id, firmData) {
    // Validate firm type if provided
    if (firmData.firm_type) {
      const validFirmTypes = ['LEGAL', 'CONSULTING', 'ADVISORY', 'AUDIT'];
      if (!validFirmTypes.includes(firmData.firm_type)) {
        throw new Error(`Invalid firm type. Must be one of: ${validFirmTypes.join(', ')}`);
      }
    }

    return await firmRepository.update(id, firmData);
  }

  /**
   * Delete firm (soft delete)
   * @param {string} id - Firm ID
   * @returns {Promise<Object>} Deleted firm
   */
  async deleteFirm(id) {
    return await firmRepository.delete(id);
  }

  /**
   * Get firms by type
   * @param {string} firmType - Firm type
   * @returns {Promise<Array>} List of firms
   */
  async getFirmsByType(firmType) {
    const validFirmTypes = ['LEGAL', 'CONSULTING', 'ADVISORY', 'AUDIT'];
    if (!validFirmTypes.includes(firmType)) {
      throw new Error(`Invalid firm type. Must be one of: ${validFirmTypes.join(', ')}`);
    }

    return await firmRepository.findByType(firmType);
  }

  /**
   * Get firm statistics
   * @param {string} firmId - Firm ID
   * @returns {Promise<Object>} Firm statistics
   */
  async getFirmStatistics(firmId) {
    const stats = await firmRepository.getStatistics(firmId);

    if (!stats) {
      throw new NotFoundError('Service firm');
    }

    // Calculate additional metrics
    const totalDecidedCases = parseInt(stats.won_cases) + parseInt(stats.lost_cases);
    const winRate = totalDecidedCases > 0
      ? ((parseInt(stats.won_cases) / totalDecidedCases) * 100).toFixed(2)
      : 0;

    const collectionRate = parseFloat(stats.total_revenue) > 0
      ? ((parseFloat(stats.total_revenue) - parseFloat(stats.pending_payments)) / parseFloat(stats.total_revenue) * 100).toFixed(2)
      : 0;

    return {
      ...stats,
      win_rate: parseFloat(winRate),
      collection_rate: parseFloat(collectionRate),
    };
  }
}

export default new FirmService();
