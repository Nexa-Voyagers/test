import hearingRepository from '../repositories/hearing.repository.js';
import caseRepository from '../repositories/case.repository.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Case Hearing Service
 * Business logic for case hearing operations
 */
class HearingService {
  /**
   * Create a new hearing
   * @param {Object} hearingData - Hearing data
   * @returns {Promise<Object>} Created hearing
   */
  async createHearing(hearingData) {
    // Verify case exists
    const caseExists = await caseRepository.findById(hearingData.case_id);
    if (!caseExists) {
      throw new NotFoundError('Case');
    }

    // Create hearing
    const hearing = await hearingRepository.create(hearingData);

    // Auto-update case's next_hearing_date if provided
    if (hearingData.next_hearing_date) {
      await caseRepository.updateNextHearingDate(
        hearingData.case_id,
        hearingData.next_hearing_date
      );
    }

    return hearing;
  }

  /**
   * Get hearing by ID
   * @param {string} id - Hearing ID
   * @returns {Promise<Object>} Hearing object
   */
  async getHearingById(id) {
    const hearing = await hearingRepository.findById(id);

    if (!hearing) {
      throw new NotFoundError('Hearing');
    }

    return hearing;
  }

  /**
   * Get all hearings with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Hearings and pagination info
   */
  async getAllHearings(options) {
    return await hearingRepository.findAll(options);
  }

  /**
   * Get hearings by case ID
   * @param {string} caseId - Case ID
   * @returns {Promise<Array>} List of hearings
   */
  async getHearingsByCaseId(caseId) {
    // Verify case exists
    const caseExists = await caseRepository.findById(caseId);
    if (!caseExists) {
      throw new NotFoundError('Case');
    }

    return await hearingRepository.findByCaseId(caseId);
  }

  /**
   * Update hearing
   * @param {string} id - Hearing ID
   * @param {Object} hearingData - Updated hearing data
   * @returns {Promise<Object>} Updated hearing
   */
  async updateHearing(id, hearingData) {
    // Get current hearing
    const currentHearing = await hearingRepository.findById(id);
    if (!currentHearing) {
      throw new NotFoundError('Hearing');
    }

    // Update hearing
    const updatedHearing = await hearingRepository.update(id, hearingData);

    // If next_hearing_date is updated, update the case as well
    if (hearingData.next_hearing_date !== undefined) {
      await caseRepository.updateNextHearingDate(
        currentHearing.case_id,
        hearingData.next_hearing_date
      );
    }

    return updatedHearing;
  }

  /**
   * Delete hearing
   * @param {string} id - Hearing ID
   * @returns {Promise<Object>} Deleted hearing
   */
  async deleteHearing(id) {
    // Get hearing before deletion
    const hearing = await hearingRepository.findById(id);
    if (!hearing) {
      throw new NotFoundError('Hearing');
    }

    // Delete hearing
    const deletedHearing = await hearingRepository.delete(id);

    // Get latest hearing for the case to update case's next_hearing_date
    const latestHearing = await hearingRepository.getLatestHearing(hearing.case_id);

    if (latestHearing && latestHearing.next_hearing_date) {
      await caseRepository.updateNextHearingDate(
        hearing.case_id,
        latestHearing.next_hearing_date
      );
    } else {
      // No more hearings, set to null
      await caseRepository.updateNextHearingDate(hearing.case_id, null);
    }

    return deletedHearing;
  }

  /**
   * Get upcoming hearings
   * @param {number} days - Number of days to look ahead
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} List of upcoming hearings
   */
  async getUpcomingHearings(days = 7, firmId = null) {
    const hearings = await hearingRepository.getUpcomingHearings(days, firmId);

    return hearings.map(hearing => ({
      ...hearing,
      days_until_hearing: this.calculateDaysUntil(hearing.hearing_date),
      is_urgent: this.calculateDaysUntil(hearing.hearing_date) <= 2,
    }));
  }

  /**
   * Get hearings by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} List of hearings
   */
  async getHearingsByDateRange(startDate, endDate, firmId = null) {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('Start date must be before end date');
    }

    return await hearingRepository.getHearingsByDateRange(startDate, endDate, firmId);
  }

  /**
   * Get hearing statistics
   * @param {string} firmId - Firm ID (optional)
   * @param {Date} startDate - Start date (optional)
   * @param {Date} endDate - End date (optional)
   * @returns {Promise<Object>} Hearing statistics
   */
  async getHearingStatistics(firmId = null, startDate = null, endDate = null) {
    const stats = await hearingRepository.getHearingStatistics(firmId, startDate, endDate);

    // Calculate completion rate
    const totalHearings = parseInt(stats.total_hearings);
    const completionRate = totalHearings > 0
      ? ((parseInt(stats.hearings_with_outcome) / totalHearings) * 100).toFixed(2)
      : 0;

    return {
      ...stats,
      completion_rate: parseFloat(completionRate),
    };
  }

  /**
   * Record hearing outcome
   * @param {string} id - Hearing ID
   * @param {string} outcome - Hearing outcome
   * @param {Date} nextHearingDate - Next hearing date (optional)
   * @returns {Promise<Object>} Updated hearing
   */
  async recordHearingOutcome(id, outcome, nextHearingDate = null) {
    const hearing = await hearingRepository.findById(id);
    if (!hearing) {
      throw new NotFoundError('Hearing');
    }

    const updateData = { outcome };
    if (nextHearingDate) {
      updateData.next_hearing_date = nextHearingDate;
    }

    // Update hearing
    const updatedHearing = await hearingRepository.update(id, updateData);

    // Update case's next_hearing_date
    if (nextHearingDate) {
      await caseRepository.updateNextHearingDate(hearing.case_id, nextHearingDate);
    }

    return updatedHearing;
  }

  /**
   * Calculate days until a future date
   * @param {Date} futureDate - Future date
   * @returns {number} Days until date
   */
  calculateDaysUntil(futureDate) {
    if (!futureDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const future = new Date(futureDate);
    future.setHours(0, 0, 0, 0);

    const diffTime = future - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }
}

export default new HearingService();
