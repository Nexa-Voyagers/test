import { qualityService } from '../services/quality.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createQualityCheck = asyncHandler(async (req, res) => {
  const check = await qualityService.createQualityCheck(req.body);
  res.status(201).json({ success: true, message: 'Quality check created', data: check });
});

export const getAllQualityChecks = asyncHandler(async (req, res) => {
  const filters = {
    batch_id: req.query.batch_id,
    check_type: req.query.check_type,
    pass_fail_status: req.query.pass_fail_status,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    limit: parseInt(req.query.limit) || 50,
    offset: parseInt(req.query.offset) || 0,
  };
  const checks = await qualityService.getAllQualityChecks(filters);
  res.json({ success: true, count: checks.length, data: checks });
});

export const getQualityCheck = asyncHandler(async (req, res) => {
  const check = await qualityService.getQualityCheck(req.params.id);
  res.json({ success: true, data: check });
});

export const getChecksByBatch = asyncHandler(async (req, res) => {
  const checks = await qualityService.getChecksByBatch(req.params.batchId);
  res.json({ success: true, count: checks.length, data: checks });
});

export const updateQualityCheck = asyncHandler(async (req, res) => {
  const check = await qualityService.updateQualityCheck(req.params.id, req.body);
  res.json({ success: true, message: 'Quality check updated', data: check });
});

export const approveQualityCheck = asyncHandler(async (req, res) => {
  const check = await qualityService.approveQualityCheck(req.params.id, req.user.id);
  res.json({ success: true, message: 'Quality check approved', data: check });
});

export const getQualityStats = asyncHandler(async (req, res) => {
  const stats = await qualityService.getQualityStats(req.query);
  res.json({ success: true, data: stats });
});
