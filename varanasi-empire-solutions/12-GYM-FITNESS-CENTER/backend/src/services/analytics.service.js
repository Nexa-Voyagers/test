import analyticsRepository from '../repositories/analytics.repository.js';

/**
 * Analytics Service
 * Business logic for analytics, reports, and dashboard statistics
 */
class AnalyticsService {
  /**
   * Get dashboard statistics
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(gymId = null) {
    return await analyticsRepository.getDashboardStats(gymId);
  }

  /**
   * Get revenue report
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Revenue report by month
   */
  async getRevenueReport(filters = {}) {
    return await analyticsRepository.getRevenueReport(filters);
  }

  /**
   * Get membership retention statistics
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Object>} Retention statistics
   */
  async getRetentionStats(gymId = null) {
    return await analyticsRepository.getRetentionStats(gymId);
  }

  /**
   * Get member growth trend
   * @param {number} gymId - Optional gym ID
   * @param {number} months - Number of months to analyze
   * @returns {Promise<Array>} Growth trend data
   */
  async getMemberGrowthTrend(gymId = null, months = 12) {
    if (months < 1 || months > 36) {
      months = 12; // Default to 12 months
    }

    return await analyticsRepository.getMemberGrowthTrend(gymId, months);
  }

  /**
   * Get attendance trends
   * @param {number} gymId - Optional gym ID
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Array>} Attendance trend data
   */
  async getAttendanceTrend(gymId = null, days = 30) {
    if (days < 1 || days > 365) {
      days = 30; // Default to 30 days
    }

    return await analyticsRepository.getAttendanceTrend(gymId, days);
  }

  /**
   * Get peak hours analysis
   * @param {number} gymId - Optional gym ID
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Array>} Peak hours data
   */
  async getPeakHours(gymId = null, days = 30) {
    if (days < 1 || days > 365) {
      days = 30; // Default to 30 days
    }

    return await analyticsRepository.getPeakHours(gymId, days);
  }

  /**
   * Get trainer performance statistics
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Array>} Trainer performance data
   */
  async getTrainerPerformance(gymId = null) {
    return await analyticsRepository.getTrainerPerformance(gymId);
  }

  /**
   * Get membership plan popularity
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Array>} Plan popularity data
   */
  async getPlanPopularity(gymId = null) {
    return await analyticsRepository.getPlanPopularity(gymId);
  }

  /**
   * Get expiring memberships alert
   * @param {number} gymId - Optional gym ID
   * @param {number} days - Days until expiry
   * @returns {Promise<Array>} Expiring memberships
   */
  async getExpiringMemberships(gymId = null, days = 7) {
    if (days < 1 || days > 90) {
      days = 7; // Default to 7 days
    }

    return await analyticsRepository.getExpiringMemberships(gymId, days);
  }

  /**
   * Get payment status summary
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Array>} Payment status summary
   */
  async getPaymentStatusSummary(gymId = null) {
    return await analyticsRepository.getPaymentStatusSummary(gymId);
  }

  /**
   * Get top members by attendance
   * @param {number} gymId - Optional gym ID
   * @param {number} days - Number of days to analyze
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Top members
   */
  async getTopMembersByAttendance(gymId = null, days = 30, limit = 10) {
    if (days < 1 || days > 365) {
      days = 30;
    }

    if (limit < 1 || limit > 100) {
      limit = 10;
    }

    return await analyticsRepository.getTopMembersByAttendance(gymId, days, limit);
  }

  /**
   * Get revenue comparison (current vs previous period)
   * @param {number} gymId - Optional gym ID
   * @param {number} days - Period length in days
   * @returns {Promise<Object>} Revenue comparison
   */
  async getRevenueComparison(gymId = null, days = 30) {
    if (days < 1 || days > 365) {
      days = 30;
    }

    return await analyticsRepository.getRevenueComparison(gymId, days);
  }

  /**
   * Get gym capacity utilization
   * @param {number} gymId - Gym ID
   * @returns {Promise<Object>} Capacity utilization
   */
  async getCapacityUtilization(gymId) {
    if (!gymId) {
      throw new Error('Gym ID is required for capacity utilization');
    }

    return await analyticsRepository.getCapacityUtilization(gymId);
  }

  /**
   * Get comprehensive gym report
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Object>} Comprehensive report
   */
  async getComprehensiveReport(gymId = null) {
    const [
      dashboard,
      retention,
      trainerPerformance,
      planPopularity,
      paymentSummary,
      expiringMemberships
    ] = await Promise.all([
      this.getDashboardStats(gymId),
      this.getRetentionStats(gymId),
      this.getTrainerPerformance(gymId),
      this.getPlanPopularity(gymId),
      this.getPaymentStatusSummary(gymId),
      this.getExpiringMemberships(gymId, 7)
    ]);

    return {
      dashboard,
      retention,
      trainer_performance: trainerPerformance,
      plan_popularity: planPopularity,
      payment_summary: paymentSummary,
      expiring_memberships: expiringMemberships,
      generated_at: new Date().toISOString()
    };
  }
}

export default new AnalyticsService();
