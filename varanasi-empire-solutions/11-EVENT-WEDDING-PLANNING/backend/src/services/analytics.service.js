import analyticsRepository from '../repositories/analytics.repository.js';

/**
 * Service for analytics and reporting business logic
 */
class AnalyticsService {
  /**
   * Get comprehensive dashboard statistics
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Complete dashboard data
   */
  async getDashboardOverview(companyId = null) {
    const stats = await analyticsRepository.getDashboardStats(companyId);
    const revenueStats = await analyticsRepository.getRevenueStats(companyId);
    const upcomingEvents = await analyticsRepository.getUpcomingEventsDetailed(30, companyId);

    return {
      summary: {
        ...stats.events,
        ...stats.clients,
        ...stats.vendors,
        upcoming_events: stats.upcoming_events,
      },
      revenue: revenueStats,
      upcoming_events: upcomingEvents.slice(0, 5), // Top 5 upcoming events
    };
  }

  /**
   * Get revenue statistics
   * @param {string} companyId - Company ID (optional)
   * @param {string} startDate - Start date (optional)
   * @param {string} endDate - End date (optional)
   * @returns {Promise<Object>} Revenue statistics
   */
  async getRevenueStatistics(companyId = null, startDate = null, endDate = null) {
    return await analyticsRepository.getRevenueStats(companyId, startDate, endDate);
  }

  /**
   * Get event statistics by type
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Event type statistics
   */
  async getEventTypeStatistics(companyId = null) {
    return await analyticsRepository.getEventStatsByType(companyId);
  }

  /**
   * Get event statistics by city
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} City-wise statistics
   */
  async getEventCityStatistics(companyId = null) {
    return await analyticsRepository.getEventStatsByCity(companyId);
  }

  /**
   * Get vendor performance report
   * @param {number} limit - Number of vendors
   * @returns {Promise<Object>} Vendor performance report
   */
  async getVendorPerformanceReport(limit = 10) {
    const topVendors = await analyticsRepository.getTopPerformingVendors(limit);
    const categoryStats = await analyticsRepository.getVendorStatsByCategory();

    return {
      top_vendors: topVendors,
      category_statistics: categoryStats,
    };
  }

  /**
   * Get vendor statistics by category
   * @returns {Promise<Array>} Category statistics
   */
  async getVendorCategoryStatistics() {
    return await analyticsRepository.getVendorStatsByCategory();
  }

  /**
   * Get monthly trends
   * @param {number} months - Number of months
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Monthly trends
   */
  async getMonthlyTrends(months = 12, companyId = null) {
    const eventTrends = await analyticsRepository.getMonthlyEventTrends(months, companyId);

    return {
      event_trends: eventTrends,
      summary: {
        total_months: months,
        average_events_per_month: this.calculateAverage(eventTrends, 'event_count'),
        average_revenue_per_month: this.calculateAverage(eventTrends, 'total_revenue'),
      },
    };
  }

  /**
   * Get event completion metrics
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Completion metrics
   */
  async getEventCompletionMetrics(companyId = null) {
    return await analyticsRepository.getEventCompletionRate(companyId);
  }

  /**
   * Get payment collection report
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Payment collection report
   */
  async getPaymentCollectionReport(companyId = null) {
    const collectionStats = await analyticsRepository.getPaymentCollectionStats(companyId);
    const vendorPaymentStats = await analyticsRepository.getVendorPaymentStats(companyId);

    return {
      client_payments: collectionStats,
      vendor_payments: vendorPaymentStats,
      net_cash_flow: parseFloat(collectionStats.total_collected || 0) -
                     parseFloat(vendorPaymentStats.total_paid_to_vendors || 0),
    };
  }

  /**
   * Get top clients report
   * @param {number} limit - Number of clients
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Top clients
   */
  async getTopClientsReport(limit = 10, companyId = null) {
    return await analyticsRepository.getTopClientsByRevenue(limit, companyId);
  }

  /**
   * Get budget analysis report
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Budget analysis
   */
  async getBudgetAnalysisReport(companyId = null) {
    return await analyticsRepository.getEventBudgetAnalysis(companyId);
  }

  /**
   * Get task completion report
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Task completion statistics
   */
  async getTaskCompletionReport(companyId = null) {
    return await analyticsRepository.getTaskCompletionStats(companyId);
  }

  /**
   * Get guest RSVP report
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} RSVP statistics
   */
  async getGuestRSVPReport(companyId = null) {
    return await analyticsRepository.getGuestRSVPStats(companyId);
  }

  /**
   * Get upcoming events detailed report
   * @param {number} days - Number of days to look ahead
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Upcoming events with details
   */
  async getUpcomingEventsReport(days = 30, companyId = null) {
    return await analyticsRepository.getUpcomingEventsDetailed(days, companyId);
  }

  /**
   * Get comprehensive business report
   * @param {string} companyId - Company ID (optional)
   * @param {string} startDate - Start date (optional)
   * @param {string} endDate - End date (optional)
   * @returns {Promise<Object>} Comprehensive business report
   */
  async getComprehensiveReport(companyId = null, startDate = null, endDate = null) {
    const [
      dashboard,
      revenue,
      eventTypes,
      vendorPerformance,
      paymentCollection,
      budgetAnalysis,
      taskCompletion,
      guestRSVP,
    ] = await Promise.all([
      this.getDashboardOverview(companyId),
      this.getRevenueStatistics(companyId, startDate, endDate),
      this.getEventTypeStatistics(companyId),
      this.getVendorPerformanceReport(5),
      this.getPaymentCollectionReport(companyId),
      this.getBudgetAnalysisReport(companyId),
      this.getTaskCompletionReport(companyId),
      this.getGuestRSVPReport(companyId),
    ]);

    return {
      dashboard_summary: dashboard.summary,
      revenue_analysis: revenue,
      event_type_breakdown: eventTypes,
      vendor_performance: vendorPerformance,
      payment_collection: paymentCollection,
      budget_analysis: budgetAnalysis,
      task_completion: taskCompletion,
      guest_rsvp: guestRSVP,
      generated_at: new Date().toISOString(),
    };
  }

  /**
   * Get performance metrics for a specific period
   * @param {string} period - Period type (week, month, quarter, year)
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Performance metrics
   */
  async getPerformanceMetrics(period = 'month', companyId = null) {
    const { startDate, endDate } = this.getPeriodDates(period);

    const revenue = await analyticsRepository.getRevenueStats(companyId, startDate, endDate);
    const eventCompletion = await analyticsRepository.getEventCompletionRate(companyId);

    return {
      period,
      start_date: startDate,
      end_date: endDate,
      revenue_metrics: revenue,
      completion_metrics: eventCompletion,
    };
  }

  /**
   * Calculate average from array of objects
   * @param {Array} data - Data array
   * @param {string} field - Field to average
   * @returns {number} Average value
   */
  calculateAverage(data, field) {
    if (!data || data.length === 0) return 0;

    const sum = data.reduce((acc, item) => {
      return acc + (parseFloat(item[field]) || 0);
    }, 0);

    return (sum / data.length).toFixed(2);
  }

  /**
   * Get period date range
   * @param {string} period - Period type
   * @returns {Object} Start and end dates
   */
  getPeriodDates(period) {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }

  /**
   * Generate executive summary
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Executive summary
   */
  async getExecutiveSummary(companyId = null) {
    const dashboard = await analyticsRepository.getDashboardStats(companyId);
    const revenue = await analyticsRepository.getRevenueStats(companyId);
    const topClients = await analyticsRepository.getTopClientsByRevenue(3, companyId);
    const upcomingEvents = await analyticsRepository.getUpcomingEventsDetailed(7, companyId);

    return {
      key_metrics: {
        total_events: dashboard.events.total_events,
        active_events: dashboard.events.in_progress_events,
        completed_events: dashboard.events.completed_events,
        total_revenue: revenue.total_revenue,
        total_profit: revenue.total_profit,
        upcoming_events_this_week: upcomingEvents.length,
      },
      top_clients: topClients,
      urgent_events: upcomingEvents.filter(e => e.days_until_event <= 7),
      generated_at: new Date().toISOString(),
    };
  }
}

export default new AnalyticsService();
