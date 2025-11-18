import caseRepository from '../repositories/case.repository.js';
import hearingRepository from '../repositories/hearing.repository.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Case Service
 * Business logic for case operations
 */
class CaseService {
  /**
   * Create a new case
   * @param {Object} caseData - Case data
   * @param {Object} initialHearing - Initial hearing data (optional)
   * @returns {Promise<Object>} Created case
   */
  async createCase(caseData, initialHearing = null) {
    // Check if case number already exists
    const existing = await caseRepository.findByCaseNumber(caseData.case_number);
    if (existing) {
      throw new ConflictError('Case number already exists');
    }

    // Validate case status
    const validStatuses = ['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'CLOSED', 'WON', 'LOST'];
    if (caseData.case_status && !validStatuses.includes(caseData.case_status)) {
      throw new Error(`Invalid case status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Create case with or without initial hearing
    if (initialHearing) {
      return await caseRepository.createWithHearing(caseData, initialHearing);
    } else {
      return await caseRepository.create(caseData);
    }
  }

  /**
   * Get case by ID
   * @param {string} id - Case ID
   * @returns {Promise<Object>} Case object with additional metadata
   */
  async getCaseById(id) {
    const caseData = await caseRepository.findById(id);

    if (!caseData) {
      throw new NotFoundError('Case');
    }

    // Calculate case age
    const caseAge = this.calculateCaseAge(caseData.filing_date);

    return {
      ...caseData,
      case_age_days: caseAge,
      is_old_case: caseAge > 90,
    };
  }

  /**
   * Get all cases with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Cases and pagination info
   */
  async getAllCases(options) {
    const result = await caseRepository.findAll(options);

    // Add case age to each case
    result.cases = result.cases.map(caseData => ({
      ...caseData,
      case_age_days: this.calculateCaseAge(caseData.filing_date),
      is_old_case: this.calculateCaseAge(caseData.filing_date) > 90,
    }));

    return result;
  }

  /**
   * Update case
   * @param {string} id - Case ID
   * @param {Object} caseData - Updated case data
   * @returns {Promise<Object>} Updated case
   */
  async updateCase(id, caseData) {
    // Validate case status if provided
    if (caseData.case_status) {
      const validStatuses = ['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'CLOSED', 'WON', 'LOST'];
      if (!validStatuses.includes(caseData.case_status)) {
        throw new Error(`Invalid case status. Must be one of: ${validStatuses.join(', ')}`);
      }

      // Validate status workflow
      const currentCase = await caseRepository.findById(id);
      if (!currentCase) {
        throw new NotFoundError('Case');
      }

      this.validateStatusTransition(currentCase.case_status, caseData.case_status);
    }

    return await caseRepository.update(id, caseData);
  }

  /**
   * Update case status
   * @param {string} id - Case ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated case
   */
  async updateCaseStatus(id, status) {
    const validStatuses = ['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'CLOSED', 'WON', 'LOST'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid case status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Get current case to validate transition
    const currentCase = await caseRepository.findById(id);
    if (!currentCase) {
      throw new NotFoundError('Case');
    }

    // Validate status workflow
    this.validateStatusTransition(currentCase.case_status, status);

    return await caseRepository.updateStatus(id, status);
  }

  /**
   * Delete case
   * @param {string} id - Case ID
   * @returns {Promise<Object>} Deleted case
   */
  async deleteCase(id) {
    return await caseRepository.delete(id);
  }

  /**
   * Get upcoming hearings
   * @param {string} firmId - Firm ID (optional)
   * @param {number} days - Number of days to look ahead
   * @returns {Promise<Array>} List of cases with upcoming hearings
   */
  async getUpcomingHearings(firmId = null, days = 7) {
    const cases = await caseRepository.getUpcomingHearings(firmId, days);

    return cases.map(caseData => ({
      ...caseData,
      days_until_hearing: this.calculateDaysUntil(caseData.next_hearing_date),
      is_urgent: this.calculateDaysUntil(caseData.next_hearing_date) <= 2,
    }));
  }

  /**
   * Get old cases (older than specified days)
   * @param {number} days - Age threshold in days
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} List of old cases
   */
  async getOldCases(days = 90, firmId = null) {
    return await caseRepository.getOldCases(days, firmId);
  }

  /**
   * Get case statistics
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Object>} Case statistics
   */
  async getCaseStatistics(firmId = null) {
    const stats = await caseRepository.getCaseStatistics(firmId);

    // Calculate additional metrics
    const totalCases = parseInt(stats.total_cases);
    const activeCases = parseInt(stats.open_cases) + parseInt(stats.in_progress_cases);
    const decidedCases = parseInt(stats.won_cases) + parseInt(stats.lost_cases);

    const winRate = decidedCases > 0
      ? ((parseInt(stats.won_cases) / decidedCases) * 100).toFixed(2)
      : 0;

    return {
      ...stats,
      active_cases: activeCases,
      win_rate: parseFloat(winRate),
    };
  }

  /**
   * Calculate case age in days
   * @param {Date} filingDate - Filing date
   * @returns {number} Age in days
   */
  calculateCaseAge(filingDate) {
    if (!filingDate) return 0;

    const today = new Date();
    const filing = new Date(filingDate);
    const diffTime = Math.abs(today - filing);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Calculate days until a future date
   * @param {Date} futureDate - Future date
   * @returns {number} Days until date
   */
  calculateDaysUntil(futureDate) {
    if (!futureDate) return null;

    const today = new Date();
    const future = new Date(futureDate);
    const diffTime = future - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Validate status transition according to workflow
   * @param {string} currentStatus - Current status
   * @param {string} newStatus - New status
   * @throws {Error} If transition is invalid
   */
  validateStatusTransition(currentStatus, newStatus) {
    // If status hasn't changed, it's valid
    if (currentStatus === newStatus) {
      return;
    }

    // Define valid transitions
    const validTransitions = {
      'OPEN': ['IN_PROGRESS', 'ON_HOLD', 'CLOSED'],
      'IN_PROGRESS': ['ON_HOLD', 'CLOSED', 'WON', 'LOST'],
      'ON_HOLD': ['IN_PROGRESS', 'CLOSED'],
      'CLOSED': ['WON', 'LOST'], // Allow reopening
      'WON': ['IN_PROGRESS'], // Allow reopening
      'LOST': ['IN_PROGRESS'], // Allow reopening
    };

    const allowedTransitions = validTransitions[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}. ` +
        `Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`
      );
    }
  }
}

export default new CaseService();
