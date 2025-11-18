import analyticsService from '../services/analytics.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for analytics and reporting endpoints
 */
class AnalyticsController {
  /**
   * @route   GET /api/analytics/dashboard
   * @desc    Get comprehensive dashboard overview
   * @access  Private
   */
  getDashboardOverview = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const dashboard = await analyticsService.getDashboardOverview(company_id);

    res.json({
      success: true,
      data: dashboard,
    });
  });

  /**
   * @route   GET /api/analytics/revenue
   * @desc    Get revenue statistics
   * @access  Private
   */
  getRevenueStatistics = asyncHandler(async (req, res) => {
    const { company_id, start_date, end_date } = req.query;
    const revenue = await analyticsService.getRevenueStatistics(
      company_id,
      start_date,
      end_date
    );

    res.json({
      success: true,
      data: revenue,
    });
  });

  /**
   * @route   GET /api/analytics/events/by-type
   * @desc    Get event statistics by type
   * @access  Private
   */
  getEventTypeStatistics = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const statistics = await analyticsService.getEventTypeStatistics(company_id);

    res.json({
      success: true,
      data: statistics,
    });
  });

  /**
   * @route   GET /api/analytics/events/by-city
   * @desc    Get event statistics by city
   * @access  Private
   */
  getEventCityStatistics = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const statistics = await analyticsService.getEventCityStatistics(company_id);

    res.json({
      success: true,
      data: statistics,
    });
  });

  /**
   * @route   GET /api/analytics/vendors/performance
   * @desc    Get vendor performance report
   * @access  Private
   */
  getVendorPerformanceReport = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const report = await analyticsService.getVendorPerformanceReport(limit);

    res.json({
      success: true,
      data: report,
    });
  });

  /**
   * @route   GET /api/analytics/vendors/by-category
   * @desc    Get vendor statistics by category
   * @access  Private
   */
  getVendorCategoryStatistics = asyncHandler(async (req, res) => {
    const statistics = await analyticsService.getVendorCategoryStatistics();

    res.json({
      success: true,
      data: statistics,
    });
  });

  /**
   * @route   GET /api/analytics/trends/monthly
   * @desc    Get monthly trends
   * @access  Private
   */
  getMonthlyTrends = asyncHandler(async (req, res) => {
    const months = req.query.months ? parseInt(req.query.months) : 12;
    const { company_id } = req.query;

    const trends = await analyticsService.getMonthlyTrends(months, company_id);

    res.json({
      success: true,
      data: trends,
    });
  });

  /**
   * @route   GET /api/analytics/events/completion
   * @desc    Get event completion metrics
   * @access  Private
   */
  getEventCompletionMetrics = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const metrics = await analyticsService.getEventCompletionMetrics(company_id);

    res.json({
      success: true,
      data: metrics,
    });
  });

  /**
   * @route   GET /api/analytics/payments/collection
   * @desc    Get payment collection report
   * @access  Private
   */
  getPaymentCollectionReport = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const report = await analyticsService.getPaymentCollectionReport(company_id);

    res.json({
      success: true,
      data: report,
    });
  });

  /**
   * @route   GET /api/analytics/clients/top
   * @desc    Get top clients report
   * @access  Private
   */
  getTopClientsReport = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const { company_id } = req.query;

    const clients = await analyticsService.getTopClientsReport(limit, company_id);

    res.json({
      success: true,
      data: clients,
    });
  });

  /**
   * @route   GET /api/analytics/budget/analysis
   * @desc    Get budget analysis report
   * @access  Private
   */
  getBudgetAnalysisReport = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const analysis = await analyticsService.getBudgetAnalysisReport(company_id);

    res.json({
      success: true,
      data: analysis,
    });
  });

  /**
   * @route   GET /api/analytics/tasks/completion
   * @desc    Get task completion report
   * @access  Private
   */
  getTaskCompletionReport = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const report = await analyticsService.getTaskCompletionReport(company_id);

    res.json({
      success: true,
      data: report,
    });
  });

  /**
   * @route   GET /api/analytics/guests/rsvp
   * @desc    Get guest RSVP report
   * @access  Private
   */
  getGuestRSVPReport = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const report = await analyticsService.getGuestRSVPReport(company_id);

    res.json({
      success: true,
      data: report,
    });
  });

  /**
   * @route   GET /api/analytics/events/upcoming
   * @desc    Get upcoming events detailed report
   * @access  Private
   */
  getUpcomingEventsReport = asyncHandler(async (req, res) => {
    const days = req.query.days ? parseInt(req.query.days) : 30;
    const { company_id } = req.query;

    const events = await analyticsService.getUpcomingEventsReport(days, company_id);

    res.json({
      success: true,
      data: events,
    });
  });

  /**
   * @route   GET /api/analytics/comprehensive
   * @desc    Get comprehensive business report
   * @access  Private
   */
  getComprehensiveReport = asyncHandler(async (req, res) => {
    const { company_id, start_date, end_date } = req.query;

    const report = await analyticsService.getComprehensiveReport(
      company_id,
      start_date,
      end_date
    );

    res.json({
      success: true,
      data: report,
    });
  });

  /**
   * @route   GET /api/analytics/performance
   * @desc    Get performance metrics for a specific period
   * @access  Private
   */
  getPerformanceMetrics = asyncHandler(async (req, res) => {
    const period = req.query.period || 'month';
    const { company_id } = req.query;

    const metrics = await analyticsService.getPerformanceMetrics(period, company_id);

    res.json({
      success: true,
      data: metrics,
    });
  });

  /**
   * @route   GET /api/analytics/executive-summary
   * @desc    Get executive summary
   * @access  Private
   */
  getExecutiveSummary = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const summary = await analyticsService.getExecutiveSummary(company_id);

    res.json({
      success: true,
      data: summary,
    });
  });
}

export default new AnalyticsController();
