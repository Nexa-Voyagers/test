import { reportService } from '../services/report.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get occupancy report
 * GET /api/v1/reports/occupancy
 */
const getOccupancyReport = asyncHandler(async (req, res) => {
  const { propertyId, startDate, endDate } = req.query;

  const report = await reportService.getOccupancyReport(propertyId, startDate, endDate);

  res.json({
    success: true,
    data: report,
  });
});

/**
 * Get revenue report
 * GET /api/v1/reports/revenue
 */
const getRevenueReport = asyncHandler(async (req, res) => {
  const { propertyId, startDate, endDate } = req.query;

  const report = await reportService.getRevenueReport(propertyId, startDate, endDate);

  res.json({
    success: true,
    data: report,
  });
});

/**
 * Get RevPAR (Revenue Per Available Room)
 * GET /api/v1/reports/revpar
 */
const getRevPAR = asyncHandler(async (req, res) => {
  const { propertyId, startDate, endDate } = req.query;

  const revPAR = await reportService.getRevPAR(propertyId, startDate, endDate);

  res.json({
    success: true,
    data: { revPAR },
  });
});

/**
 * Get ADR (Average Daily Rate)
 * GET /api/v1/reports/adr
 */
const getADR = asyncHandler(async (req, res) => {
  const { propertyId, startDate, endDate } = req.query;

  const adr = await reportService.getADR(propertyId, startDate, endDate);

  res.json({
    success: true,
    data: { adr },
  });
});

/**
 * Get guest statistics
 * GET /api/v1/reports/guests
 */
const getGuestStats = asyncHandler(async (req, res) => {
  const { propertyId } = req.query;

  const stats = await reportService.getGuestStats(propertyId);

  res.json({
    success: true,
    data: stats,
  });
});

/**
 * Get performance summary
 * GET /api/v1/reports/performance
 */
const getPerformanceSummary = asyncHandler(async (req, res) => {
  const { propertyId } = req.query;

  const summary = await reportService.getPerformanceSummary(propertyId);

  res.json({
    success: true,
    data: summary,
  });
});

/**
 * Get booking channel analysis
 * GET /api/v1/reports/channel-analysis
 */
const getChannelAnalysis = asyncHandler(async (req, res) => {
  const { propertyId, startDate, endDate } = req.query;

  const analysis = await reportService.getChannelAnalysis(propertyId, startDate, endDate);

  res.json({
    success: true,
    data: analysis,
  });
});

/**
 * Get forecasting data
 * GET /api/v1/reports/forecast
 */
const getForecastingData = asyncHandler(async (req, res) => {
  const { propertyId, daysAhead = 30 } = req.query;

  const forecast = await reportService.getForecastingData(propertyId, parseInt(daysAhead));

  res.json({
    success: true,
    data: forecast,
  });
});

export const reportController = {
  getOccupancyReport,
  getRevenueReport,
  getRevPAR,
  getADR,
  getGuestStats,
  getPerformanceSummary,
  getChannelAnalysis,
  getForecastingData,
};
