import { asyncHandler } from '../utils/asyncHandler.js';
import analyticsService from '../services/analytics.service.js';

/**
 * Analytics Controller - Dashboard stats, reports, and insights
 */

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { gym_id } = req.query;
  const stats = await analyticsService.getDashboardStats(gym_id ? parseInt(gym_id) : null);

  res.json({
    success: true,
    data: stats
  });
});

/**
 * @route   GET /api/v1/analytics/revenue
 * @desc    Get revenue report
 * @access  Private
 */
export const getRevenueReport = asyncHandler(async (req, res) => {
  const { gym_id, start_date, end_date } = req.query;
  const filters = {
    gym_id: gym_id ? parseInt(gym_id) : undefined,
    start_date,
    end_date
  };

  const report = await analyticsService.getRevenueReport(filters);

  res.json({
    success: true,
    data: report
  });
});

/**
 * @route   GET /api/v1/analytics/retention
 * @desc    Get membership retention statistics
 * @access  Private
 */
export const getRetentionStats = asyncHandler(async (req, res) => {
  const { gym_id } = req.query;
  const stats = await analyticsService.getRetentionStats(gym_id ? parseInt(gym_id) : null);

  res.json({
    success: true,
    data: stats
  });
});

/**
 * @route   GET /api/v1/analytics/member-growth
 * @desc    Get member growth trend
 * @access  Private
 */
export const getMemberGrowthTrend = asyncHandler(async (req, res) => {
  const { gym_id, months = 12 } = req.query;
  const trend = await analyticsService.getMemberGrowthTrend(
    gym_id ? parseInt(gym_id) : null,
    parseInt(months)
  );

  res.json({
    success: true,
    data: trend
  });
});

/**
 * @route   GET /api/v1/analytics/attendance-trend
 * @desc    Get attendance trends
 * @access  Private
 */
export const getAttendanceTrend = asyncHandler(async (req, res) => {
  const { gym_id, days = 30 } = req.query;
  const trend = await analyticsService.getAttendanceTrend(
    gym_id ? parseInt(gym_id) : null,
    parseInt(days)
  );

  res.json({
    success: true,
    data: trend
  });
});

/**
 * @route   GET /api/v1/analytics/peak-hours
 * @desc    Get peak hours analysis
 * @access  Private
 */
export const getPeakHours = asyncHandler(async (req, res) => {
  const { gym_id, days = 30 } = req.query;
  const peakHours = await analyticsService.getPeakHours(
    gym_id ? parseInt(gym_id) : null,
    parseInt(days)
  );

  res.json({
    success: true,
    data: peakHours
  });
});

/**
 * @route   GET /api/v1/analytics/trainer-performance
 * @desc    Get trainer performance statistics
 * @access  Private
 */
export const getTrainerPerformance = asyncHandler(async (req, res) => {
  const { gym_id } = req.query;
  const performance = await analyticsService.getTrainerPerformance(gym_id ? parseInt(gym_id) : null);

  res.json({
    success: true,
    data: performance
  });
});

/**
 * @route   GET /api/v1/analytics/plan-popularity
 * @desc    Get membership plan popularity
 * @access  Private
 */
export const getPlanPopularity = asyncHandler(async (req, res) => {
  const { gym_id } = req.query;
  const popularity = await analyticsService.getPlanPopularity(gym_id ? parseInt(gym_id) : null);

  res.json({
    success: true,
    data: popularity
  });
});

/**
 * @route   GET /api/v1/analytics/expiring-memberships
 * @desc    Get expiring memberships alert
 * @access  Private
 */
export const getExpiringMemberships = asyncHandler(async (req, res) => {
  const { gym_id, days = 7 } = req.query;
  const memberships = await analyticsService.getExpiringMemberships(
    gym_id ? parseInt(gym_id) : null,
    parseInt(days)
  );

  res.json({
    success: true,
    data: memberships
  });
});

/**
 * @route   GET /api/v1/analytics/payment-status
 * @desc    Get payment status summary
 * @access  Private
 */
export const getPaymentStatusSummary = asyncHandler(async (req, res) => {
  const { gym_id } = req.query;
  const summary = await analyticsService.getPaymentStatusSummary(gym_id ? parseInt(gym_id) : null);

  res.json({
    success: true,
    data: summary
  });
});

/**
 * @route   GET /api/v1/analytics/top-members
 * @desc    Get top members by attendance
 * @access  Private
 */
export const getTopMembersByAttendance = asyncHandler(async (req, res) => {
  const { gym_id, days = 30, limit = 10 } = req.query;
  const topMembers = await analyticsService.getTopMembersByAttendance(
    gym_id ? parseInt(gym_id) : null,
    parseInt(days),
    parseInt(limit)
  );

  res.json({
    success: true,
    data: topMembers
  });
});

/**
 * @route   GET /api/v1/analytics/revenue-comparison
 * @desc    Get revenue comparison (current vs previous period)
 * @access  Private
 */
export const getRevenueComparison = asyncHandler(async (req, res) => {
  const { gym_id, days = 30 } = req.query;
  const comparison = await analyticsService.getRevenueComparison(
    gym_id ? parseInt(gym_id) : null,
    parseInt(days)
  );

  res.json({
    success: true,
    data: comparison
  });
});

/**
 * @route   GET /api/v1/analytics/capacity-utilization
 * @desc    Get gym capacity utilization
 * @access  Private
 */
export const getCapacityUtilization = asyncHandler(async (req, res) => {
  const { gym_id } = req.query;
  if (!gym_id) {
    return res.status(400).json({
      success: false,
      message: 'gym_id is required for capacity utilization'
    });
  }

  const utilization = await analyticsService.getCapacityUtilization(parseInt(gym_id));

  res.json({
    success: true,
    data: utilization
  });
});

/**
 * @route   GET /api/v1/analytics/comprehensive-report
 * @desc    Get comprehensive gym report
 * @access  Private
 */
export const getComprehensiveReport = asyncHandler(async (req, res) => {
  const { gym_id } = req.query;
  const report = await analyticsService.getComprehensiveReport(gym_id ? parseInt(gym_id) : null);

  res.json({
    success: true,
    data: report
  });
});

export default {
  getDashboardStats,
  getRevenueReport,
  getRetentionStats,
  getMemberGrowthTrend,
  getAttendanceTrend,
  getPeakHours,
  getTrainerPerformance,
  getPlanPopularity,
  getExpiringMemberships,
  getPaymentStatusSummary,
  getTopMembersByAttendance,
  getRevenueComparison,
  getCapacityUtilization,
  getComprehensiveReport
};
