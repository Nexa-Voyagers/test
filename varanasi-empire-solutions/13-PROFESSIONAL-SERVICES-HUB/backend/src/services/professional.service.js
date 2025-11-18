import professionalRepository from '../repositories/professional.repository.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Professional Service
 * Business logic for professional operations
 */
class ProfessionalService {
  /**
   * Create a new professional
   * @param {Object} professionalData - Professional data
   * @returns {Promise<Object>} Created professional
   */
  async createProfessional(professionalData) {
    // Check if professional code already exists
    const existing = await professionalRepository.findByCode(professionalData.professional_code);
    if (existing) {
      throw new ConflictError('Professional code already exists');
    }

    return await professionalRepository.create(professionalData);
  }

  /**
   * Get professional by ID
   * @param {string} id - Professional ID
   * @returns {Promise<Object>} Professional object
   */
  async getProfessionalById(id) {
    const professional = await professionalRepository.findById(id);

    if (!professional) {
      throw new NotFoundError('Professional');
    }

    return professional;
  }

  /**
   * Get all professionals with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Professionals and pagination info
   */
  async getAllProfessionals(options) {
    return await professionalRepository.findAll(options);
  }

  /**
   * Update professional
   * @param {string} id - Professional ID
   * @param {Object} professionalData - Updated professional data
   * @returns {Promise<Object>} Updated professional
   */
  async updateProfessional(id, professionalData) {
    return await professionalRepository.update(id, professionalData);
  }

  /**
   * Delete professional (soft delete)
   * @param {string} id - Professional ID
   * @returns {Promise<Object>} Deleted professional
   */
  async deleteProfessional(id) {
    return await professionalRepository.delete(id);
  }

  /**
   * Get professional workload
   * @param {string} professionalId - Professional ID
   * @returns {Promise<Object>} Workload statistics
   */
  async getProfessionalWorkload(professionalId) {
    const workload = await professionalRepository.getWorkload(professionalId);

    if (!workload) {
      throw new NotFoundError('Professional');
    }

    // Calculate workload percentage (assuming 10 active cases is 100%)
    const maxActiveCases = 10;
    const activeCases = parseInt(workload.active_cases);
    const workloadPercentage = Math.min((activeCases / maxActiveCases) * 100, 100);

    return {
      ...workload,
      workload_percentage: parseFloat(workloadPercentage.toFixed(2)),
      is_overloaded: activeCases > maxActiveCases,
    };
  }

  /**
   * Get available professionals for case assignment
   * @param {string} firmId - Firm ID
   * @param {number} maxCases - Maximum active cases threshold
   * @returns {Promise<Array>} Available professionals
   */
  async getAvailableProfessionals(firmId, maxCases = 10) {
    return await professionalRepository.findAvailableProfessionals(firmId, maxCases);
  }

  /**
   * Get professional performance metrics
   * @param {string} professionalId - Professional ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} Performance metrics
   */
  async getProfessionalPerformance(professionalId, startDate, endDate) {
    const metrics = await professionalRepository.getPerformanceMetrics(
      professionalId,
      startDate,
      endDate
    );

    if (!metrics) {
      throw new NotFoundError('Professional');
    }

    // Calculate win rate
    const totalDecidedCases = parseInt(metrics.cases_won) + parseInt(metrics.cases_lost);
    const winRate = totalDecidedCases > 0
      ? ((parseInt(metrics.cases_won) / totalDecidedCases) * 100).toFixed(2)
      : 0;

    // Calculate average revenue per case
    const avgRevenuePerCase = parseInt(metrics.cases_handled) > 0
      ? (parseFloat(metrics.total_revenue) / parseInt(metrics.cases_handled)).toFixed(2)
      : 0;

    return {
      ...metrics,
      win_rate: parseFloat(winRate),
      avg_revenue_per_case: parseFloat(avgRevenuePerCase),
    };
  }

  /**
   * Assign professional to case
   * @param {string} professionalId - Professional ID
   * @param {string} caseId - Case ID
   * @returns {Promise<Object>} Assignment result
   */
  async assignProfessionalToCase(professionalId, caseId) {
    // Get current workload
    const workload = await professionalRepository.getWorkload(professionalId);

    if (!workload) {
      throw new NotFoundError('Professional');
    }

    // Check if professional is overloaded
    const maxActiveCases = 10;
    if (parseInt(workload.active_cases) >= maxActiveCases) {
      throw new Error(`Professional is overloaded with ${workload.active_cases} active cases`);
    }

    return {
      professional_id: professionalId,
      case_id: caseId,
      current_workload: workload.active_cases,
      status: 'assigned',
    };
  }
}

export default new ProfessionalService();
