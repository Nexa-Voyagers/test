import analyticsRepository from '../repositories/analytics.repository.js';

/**
 * Analytics Service
 * Business logic for analytics and reporting operations
 */
class AnalyticsService {
  /**
   * Get dashboard statistics
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(firmId = null) {
    const stats = await analyticsRepository.getDashboardStats(firmId);

    // Calculate additional metrics
    const totalCases = parseInt(stats.total_cases);
    const decidedCases = parseInt(stats.won_cases) + parseInt(stats.lost_cases);

    const winRate = decidedCases > 0
      ? ((parseInt(stats.won_cases) / decidedCases) * 100).toFixed(2)
      : 0;

    const collectionRate = parseFloat(stats.total_revenue) > 0
      ? ((parseFloat(stats.collected_revenue) / parseFloat(stats.total_revenue)) * 100).toFixed(2)
      : 0;

    return {
      ...stats,
      win_rate: parseFloat(winRate),
      collection_rate: parseFloat(collectionRate),
    };
  }

  /**
   * Get case statistics by status
   * @param {string} firmId - Firm ID (optional)
   * @param {Date} startDate - Start date (optional)
   * @param {Date} endDate - End date (optional)
   * @returns {Promise<Array>} Case statistics by status
   */
  async getCaseStatsByStatus(firmId = null, startDate = null, endDate = null) {
    return await analyticsRepository.getCaseStatsByStatus(firmId, startDate, endDate);
  }

  /**
   * Get case statistics by type
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} Case statistics by type
   */
  async getCaseStatsByType(firmId = null) {
    return await analyticsRepository.getCaseStatsByType(firmId);
  }

  /**
   * Get professional performance rankings
   * @param {string} firmId - Firm ID (optional)
   * @param {number} limit - Number of professionals to return
   * @returns {Promise<Array>} Professional performance rankings
   */
  async getProfessionalPerformance(firmId = null, limit = 10) {
    return await analyticsRepository.getProfessionalPerformance(firmId, limit);
  }

  /**
   * Get revenue trends by month
   * @param {string} firmId - Firm ID (optional)
   * @param {number} months - Number of months to look back
   * @returns {Promise<Array>} Monthly revenue trends
   */
  async getRevenueTrends(firmId = null, months = 12) {
    const trends = await analyticsRepository.getRevenueTrends(firmId, months);

    // Calculate collection rate for each month
    return trends.map(trend => {
      const collectionRate = parseFloat(trend.total_billed) > 0
        ? ((parseFloat(trend.total_collected) / parseFloat(trend.total_billed)) * 100).toFixed(2)
        : 0;

      return {
        ...trend,
        collection_rate: parseFloat(collectionRate),
      };
    });
  }

  /**
   * Get client statistics
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Object>} Client statistics
   */
  async getClientStatistics(firmId = null) {
    return await analyticsRepository.getClientStatistics(firmId);
  }

  /**
   * Get top clients by revenue
   * @param {string} firmId - Firm ID (optional)
   * @param {number} limit - Number of clients to return
   * @returns {Promise<Array>} Top clients by revenue
   */
  async getTopClientsByRevenue(firmId = null, limit = 10) {
    const clients = await analyticsRepository.getTopClientsByRevenue(firmId, limit);

    // Add payment rate to each client
    return clients.map(client => {
      const paymentRate = parseFloat(client.total_revenue) > 0
        ? ((parseFloat(client.paid_amount) / parseFloat(client.total_revenue)) * 100).toFixed(2)
        : 0;

      return {
        ...client,
        payment_rate: parseFloat(paymentRate),
      };
    });
  }

  /**
   * Get hearing trends
   * @param {string} firmId - Firm ID (optional)
   * @param {number} months - Number of months to look back
   * @returns {Promise<Array>} Hearing trends by month
   */
  async getHearingTrends(firmId = null, months = 12) {
    return await analyticsRepository.getHearingTrends(firmId, months);
  }

  /**
   * Get case aging report
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Object>} Case aging statistics
   */
  async getCaseAgingReport(firmId = null) {
    const report = await analyticsRepository.getCaseAgingReport(firmId);

    // Calculate total active cases
    const totalActiveCases =
      parseInt(report.cases_0_30_days) +
      parseInt(report.cases_31_60_days) +
      parseInt(report.cases_61_90_days) +
      parseInt(report.cases_91_180_days) +
      parseInt(report.cases_over_180_days);

    // Calculate percentages
    const percentages = {
      cases_0_30_days_pct: totalActiveCases > 0
        ? ((parseInt(report.cases_0_30_days) / totalActiveCases) * 100).toFixed(2)
        : 0,
      cases_31_60_days_pct: totalActiveCases > 0
        ? ((parseInt(report.cases_31_60_days) / totalActiveCases) * 100).toFixed(2)
        : 0,
      cases_61_90_days_pct: totalActiveCases > 0
        ? ((parseInt(report.cases_61_90_days) / totalActiveCases) * 100).toFixed(2)
        : 0,
      cases_91_180_days_pct: totalActiveCases > 0
        ? ((parseInt(report.cases_91_180_days) / totalActiveCases) * 100).toFixed(2)
        : 0,
      cases_over_180_days_pct: totalActiveCases > 0
        ? ((parseInt(report.cases_over_180_days) / totalActiveCases) * 100).toFixed(2)
        : 0,
    };

    return {
      ...report,
      total_active_cases: totalActiveCases,
      ...percentages,
    };
  }

  /**
   * Get payment collection report
   * @param {string} firmId - Firm ID (optional)
   * @param {Date} startDate - Start date (optional)
   * @param {Date} endDate - End date (optional)
   * @returns {Promise<Object>} Payment collection statistics
   */
  async getPaymentCollectionReport(firmId = null, startDate = null, endDate = null) {
    return await analyticsRepository.getPaymentCollectionReport(firmId, startDate, endDate);
  }

  /**
   * Get comprehensive analytics report
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Object>} Comprehensive analytics report
   */
  async getComprehensiveReport(firmId = null) {
    // Fetch all analytics in parallel
    const [
      dashboardStats,
      caseStatsByStatus,
      caseStatsByType,
      revenueTrends,
      caseAgingReport,
      paymentCollectionReport,
    ] = await Promise.all([
      this.getDashboardStats(firmId),
      this.getCaseStatsByStatus(firmId),
      this.getCaseStatsByType(firmId),
      this.getRevenueTrends(firmId, 6), // Last 6 months
      this.getCaseAgingReport(firmId),
      this.getPaymentCollectionReport(firmId),
    ]);

    return {
      dashboard: dashboardStats,
      case_statistics: {
        by_status: caseStatsByStatus,
        by_type: caseStatsByType,
        aging_report: caseAgingReport,
      },
      revenue: {
        trends: revenueTrends,
        collection: paymentCollectionReport,
      },
      generated_at: new Date().toISOString(),
    };
  }
}

export default new AnalyticsService();
