import Joi from 'joi';
import analyticsService from '../services/analytics.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Analytics Controller
 * Handles HTTP requests for analytics and reporting operations
 */

/**
 * Get dashboard statistics
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const stats = await analyticsService.getDashboardStats(firmId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * Get case statistics by status
 */
export const getCaseStatsByStatus = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const startDate = req.query.start_date ? new Date(req.query.start_date) : null;
  const endDate = req.query.end_date ? new Date(req.query.end_date) : null;

  const stats = await analyticsService.getCaseStatsByStatus(firmId, startDate, endDate);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * Get case statistics by type
 */
export const getCaseStatsByType = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const stats = await analyticsService.getCaseStatsByType(firmId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * Get professional performance rankings
 */
export const getProfessionalPerformance = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const limit = parseInt(req.query.limit) || 10;

  const performance = await analyticsService.getProfessionalPerformance(firmId, limit);

  res.status(200).json({
    success: true,
    data: performance,
  });
});

/**
 * Get revenue trends by month
 */
export const getRevenueTrends = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const months = parseInt(req.query.months) || 12;

  const trends = await analyticsService.getRevenueTrends(firmId, months);

  res.status(200).json({
    success: true,
    data: trends,
  });
});

/**
 * Get client statistics
 */
export const getClientStatistics = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const stats = await analyticsService.getClientStatistics(firmId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * Get top clients by revenue
 */
export const getTopClientsByRevenue = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const limit = parseInt(req.query.limit) || 10;

  const clients = await analyticsService.getTopClientsByRevenue(firmId, limit);

  res.status(200).json({
    success: true,
    data: clients,
  });
});

/**
 * Get hearing trends
 */
export const getHearingTrends = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const months = parseInt(req.query.months) || 12;

  const trends = await analyticsService.getHearingTrends(firmId, months);

  res.status(200).json({
    success: true,
    data: trends,
  });
});

/**
 * Get case aging report
 */
export const getCaseAgingReport = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const report = await analyticsService.getCaseAgingReport(firmId);

  res.status(200).json({
    success: true,
    data: report,
  });
});

/**
 * Get payment collection report
 */
export const getPaymentCollectionReport = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const startDate = req.query.start_date ? new Date(req.query.start_date) : null;
  const endDate = req.query.end_date ? new Date(req.query.end_date) : null;

  const report = await analyticsService.getPaymentCollectionReport(firmId, startDate, endDate);

  res.status(200).json({
    success: true,
    data: report,
  });
});

/**
 * Get comprehensive analytics report
 */
export const getComprehensiveReport = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const report = await analyticsService.getComprehensiveReport(firmId);

  res.status(200).json({
    success: true,
    data: report,
  });
});
