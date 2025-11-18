import analyticsService from '../services/analytics.service.js';

/**
 * Analytics Controller
 * Handles HTTP requests for analytics and reporting
 */
class AnalyticsController {
  /**
   * Generate daily sales summary
   * @route POST /api/v1/analytics/daily-summary
   */
  async generateDailySummary(req, res) {
    const { store_id, date } = req.body;
    const summaryDate = date ? new Date(date) : new Date();
    const summary = await analyticsService.generateDailySummary(store_id, summaryDate);
    res.json({
      success: true,
      message: 'Daily summary generated successfully',
      data: summary
    });
  }

  /**
   * Get daily sales summaries
   * @route GET /api/v1/analytics/daily-summaries
   */
  async getDailySummaries(req, res) {
    const summaries = await analyticsService.getDailySummaries(req.query);
    res.json({
      success: true,
      data: summaries
    });
  }

  /**
   * Get dashboard statistics
   * @route GET /api/v1/analytics/dashboard
   */
  async getDashboardStats(req, res) {
    const stats = await analyticsService.getDashboardStats(req.query);
    res.json({
      success: true,
      data: stats
    });
  }

  /**
   * Get top selling products
   * @route GET /api/v1/analytics/top-products
   */
  async getTopSellingProducts(req, res) {
    const products = await analyticsService.getTopSellingProducts(req.query);
    res.json({
      success: true,
      data: products
    });
  }

  /**
   * Get inventory report
   * @route GET /api/v1/analytics/inventory-report
   */
  async getInventoryReport(req, res) {
    const { store_id } = req.query;
    const report = await analyticsService.getInventoryReport(store_id);
    res.json({
      success: true,
      data: report
    });
  }

  /**
   * Get customer analytics
   * @route GET /api/v1/analytics/customers
   */
  async getCustomerAnalytics(req, res) {
    const analytics = await analyticsService.getCustomerAnalytics(req.query);
    res.json({
      success: true,
      data: analytics
    });
  }

  /**
   * Get weaver performance analytics
   * @route GET /api/v1/analytics/weaver-performance
   */
  async getWeaverPerformance(req, res) {
    const performance = await analyticsService.getWeaverPerformance(req.query);
    res.json({
      success: true,
      data: performance
    });
  }

  /**
   * Get sales by payment method
   * @route GET /api/v1/analytics/sales-by-payment-method
   */
  async getSalesByPaymentMethod(req, res) {
    const data = await analyticsService.getSalesByPaymentMethod(req.query);
    res.json({
      success: true,
      data
    });
  }

  /**
   * Get sales trends
   * @route GET /api/v1/analytics/sales-trends
   */
  async getSalesTrends(req, res) {
    const trends = await analyticsService.getSalesTrends(req.query);
    res.json({
      success: true,
      data: trends
    });
  }

  /**
   * Get category performance
   * @route GET /api/v1/analytics/category-performance
   */
  async getCategoryPerformance(req, res) {
    const performance = await analyticsService.getCategoryPerformance(req.query);
    res.json({
      success: true,
      data: performance
    });
  }

  /**
   * Get custom order analytics
   * @route GET /api/v1/analytics/custom-orders
   */
  async getCustomOrderAnalytics(req, res) {
    const analytics = await analyticsService.getCustomOrderAnalytics(req.query);
    res.json({
      success: true,
      data: analytics
    });
  }

  /**
   * Get monthly report
   * @route GET /api/v1/analytics/monthly-report
   */
  async getMonthlyReport(req, res) {
    const { store_id, year, month } = req.query;
    const report = await analyticsService.getMonthlyReport(
      parseInt(store_id),
      parseInt(year),
      parseInt(month)
    );
    res.json({
      success: true,
      data: report
    });
  }

  /**
   * Get year-to-date summary
   * @route GET /api/v1/analytics/ytd-summary
   */
  async getYearToDateSummary(req, res) {
    const { store_id, year } = req.query;
    const summary = await analyticsService.getYearToDateSummary(
      parseInt(store_id),
      year ? parseInt(year) : undefined
    );
    res.json({
      success: true,
      data: summary
    });
  }
}

export default new AnalyticsController();
