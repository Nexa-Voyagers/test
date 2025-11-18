import { reportService } from '../services/report.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProductionReport = asyncHandler(async (req, res) => {
  const report = await reportService.getProductionReport(req.query);
  res.json({ success: true, data: report });
});

export const getQualityReport = asyncHandler(async (req, res) => {
  const report = await reportService.getQualityReport(req.query);
  res.json({ success: true, data: report });
});

export const getSalesReport = asyncHandler(async (req, res) => {
  const report = await reportService.getSalesReport(req.query);
  res.json({ success: true, data: report });
});

export const getInventoryReport = asyncHandler(async (req, res) => {
  const report = await reportService.getInventoryReport(req.query);
  res.json({ success: true, data: report });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await reportService.getDashboardStats();
  res.json({ success: true, data: stats });
});

export const getDistributorPerformance = asyncHandler(async (req, res) => {
  const report = await reportService.getDistributorPerformance(req.query);
  res.json({ success: true, data: report });
});

export const getProductPerformance = asyncHandler(async (req, res) => {
  const report = await reportService.getProductPerformance(req.query);
  res.json({ success: true, data: report });
});

export const getExpiryReport = asyncHandler(async (req, res) => {
  const report = await reportService.getExpiryReport();
  res.json({ success: true, data: report });
});
