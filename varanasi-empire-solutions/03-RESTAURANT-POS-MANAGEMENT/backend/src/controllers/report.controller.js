import { reportService } from '../services/report.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Get sales report
 * GET /api/reports/sales
 */
const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const report = await reportService.getSalesReport(req.user.restaurant_id, startDate, endDate);

  res.json({
    success: true,
    data: report,
  });
});

/**
 * Get daily sales report
 * GET /api/reports/daily-sales/:date
 */
const getDailySalesReport = asyncHandler(async (req, res) => {
  const { date } = req.params;

  const report = await reportService.getDailySalesReport(req.user.restaurant_id, date);

  res.json({
    success: true,
    data: report,
  });
});

/**
 * Get revenue by order type
 * GET /api/reports/revenue-by-type
 */
const getRevenueByOrderType = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const report = await reportService.getRevenueByOrderType(req.user.restaurant_id, startDate, endDate);

  res.json({
    success: true,
    data: report,
  });
});

/**
 * Get table occupancy report
 * GET /api/reports/table-occupancy
 */
const getTableOccupancyReport = asyncHandler(async (req, res) => {
  const report = await reportService.getTableOccupancyReport(req.user.restaurant_id);

  res.json({
    success: true,
    data: report,
  });
});

/**
 * Get inventory report
 * GET /api/reports/inventory
 */
const getInventoryReport = asyncHandler(async (req, res) => {
  const report = await reportService.getInventoryReport(req.user.restaurant_id);

  res.json({
    success: true,
    data: report,
  });
});

/**
 * Get performance metrics
 * GET /api/reports/performance
 */
const getPerformanceMetrics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const metrics = await reportService.getPerformanceMetrics(req.user.restaurant_id, startDate, endDate);

  res.json({
    success: true,
    data: metrics,
  });
});

/**
 * Get hourly sales distribution
 * GET /api/reports/hourly-sales/:date
 */
const getHourlySalesDistribution = asyncHandler(async (req, res) => {
  const { date } = req.params;

  const distribution = await reportService.getHourlySalesDistribution(req.user.restaurant_id, date);

  res.json({
    success: true,
    data: distribution,
  });
});

/**
 * Get payment method breakdown
 * GET /api/reports/payment-methods
 */
const getPaymentMethodBreakdown = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const breakdown = await reportService.getPaymentMethodBreakdown(req.user.restaurant_id, startDate, endDate);

  res.json({
    success: true,
    data: breakdown,
  });
});

/**
 * Get dashboard summary
 * GET /api/reports/dashboard
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  const { date = new Date().toISOString().split('T')[0] } = req.query;

  const dailySales = await reportService.getDailySalesReport(req.user.restaurant_id, date);
  const tableOccupancy = await reportService.getTableOccupancyReport(req.user.restaurant_id);
  const inventory = await reportService.getInventoryReport(req.user.restaurant_id);

  logger.info(`Dashboard summary retrieved for date: ${date}`);

  res.json({
    success: true,
    data: {
      date,
      sales: dailySales,
      tables: tableOccupancy,
      inventory: {
        totalValue: inventory.totalValue,
        lowStockCount: inventory.lowStockCount,
      },
    },
  });
});

export const reportController = {
  getSalesReport,
  getDailySalesReport,
  getRevenueByOrderType,
  getTableOccupancyReport,
  getInventoryReport,
  getPerformanceMetrics,
  getHourlySalesDistribution,
  getPaymentMethodBreakdown,
  getDashboardSummary,
};
