import Joi from 'joi';
import analyticsService from '../services/analytics.service.js';
import { asyncHandler } from '../asyncHandler.js';
import { ValidationError } from '../errors.js';

/**
 * Analytics Controller
 * Handles HTTP requests for analytics and reporting
 */

/**
 * @route   GET /api/v1/analytics/dashboard/:instituteId
 * @desc    Get dashboard statistics
 * @access  Private
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { instituteId } = req.params;
  const stats = await analyticsService.getDashboardStats(parseInt(instituteId));

  res.status(200).json({
    success: true,
    data: stats
  });
});

/**
 * @route   GET /api/v1/analytics/batch-performance/:batchId
 * @desc    Get batch performance report
 * @access  Private
 */
export const getBatchPerformance = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const performance = await analyticsService.getBatchPerformance(parseInt(batchId));

  res.status(200).json({
    success: true,
    data: performance
  });
});

/**
 * @route   GET /api/v1/analytics/revenue/:instituteId
 * @desc    Get revenue report
 * @access  Private
 */
export const getRevenueReport = asyncHandler(async (req, res) => {
  const { instituteId } = req.params;
  const { date_from, date_to } = req.query;

  const filters = {};
  if (date_from) filters.date_from = date_from;
  if (date_to) filters.date_to = date_to;

  const report = await analyticsService.getRevenueReport(parseInt(instituteId), filters);

  res.status(200).json({
    success: true,
    data: report
  });
});

/**
 * @route   GET /api/v1/analytics/revenue-trend/:instituteId
 * @desc    Get monthly revenue trend
 * @access  Private
 */
export const getMonthlyRevenueTrend = asyncHandler(async (req, res) => {
  const { instituteId } = req.params;
  const { months } = req.query;

  const trend = await analyticsService.getMonthlyRevenueTrend(
    parseInt(instituteId),
    months ? parseInt(months) : 6
  );

  res.status(200).json({
    success: true,
    count: trend.length,
    data: trend
  });
});

/**
 * @route   GET /api/v1/analytics/course-enrollments/:instituteId
 * @desc    Get course-wise enrollment statistics
 * @access  Private
 */
export const getCourseWiseEnrollments = asyncHandler(async (req, res) => {
  const { instituteId } = req.params;
  const stats = await analyticsService.getCourseWiseEnrollments(parseInt(instituteId));

  res.status(200).json({
    success: true,
    count: stats.length,
    data: stats
  });
});

/**
 * @route   GET /api/v1/analytics/faculty-performance/:instituteId
 * @desc    Get faculty performance
 * @access  Private
 */
export const getFacultyPerformance = asyncHandler(async (req, res) => {
  const { instituteId } = req.params;
  const performance = await analyticsService.getFacultyPerformance(parseInt(instituteId));

  res.status(200).json({
    success: true,
    count: performance.length,
    data: performance
  });
});

/**
 * @route   GET /api/v1/analytics/attendance-trends/:batchId
 * @desc    Get attendance trends
 * @access  Private
 */
export const getAttendanceTrends = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const { days } = req.query;

  const trends = await analyticsService.getAttendanceTrends(
    parseInt(batchId),
    days ? parseInt(days) : 30
  );

  res.status(200).json({
    success: true,
    count: trends.length,
    data: trends
  });
});

/**
 * @route   GET /api/v1/analytics/test-performance/:batchId
 * @desc    Get test performance trends
 * @access  Private
 */
export const getTestPerformanceTrends = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const trends = await analyticsService.getTestPerformanceTrends(parseInt(batchId));

  res.status(200).json({
    success: true,
    count: trends.length,
    data: trends
  });
});

/**
 * @route   GET /api/v1/analytics/top-performers/:instituteId
 * @desc    Get top performing students
 * @access  Private
 */
export const getTopPerformingStudents = asyncHandler(async (req, res) => {
  const { instituteId } = req.params;
  const { limit } = req.query;

  const students = await analyticsService.getTopPerformingStudents(
    parseInt(instituteId),
    limit ? parseInt(limit) : 10
  );

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

/**
 * @route   GET /api/v1/analytics/institute-report/:instituteId
 * @desc    Generate comprehensive institute report
 * @access  Private
 */
export const generateInstituteReport = asyncHandler(async (req, res) => {
  const { instituteId } = req.params;
  const report = await analyticsService.generateInstituteReport(parseInt(instituteId));

  res.status(200).json({
    success: true,
    data: report
  });
});
