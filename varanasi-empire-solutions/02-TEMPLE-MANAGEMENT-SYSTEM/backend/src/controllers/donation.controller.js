import { donationService } from '../services/donation.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

export const createDonation = asyncHandler(async (req, res) => {
  const donationData = {
    ...req.body,
    temple_id: req.user.temple_id,
    created_by: req.user.id,
  };

  const donation = await donationService.createDonation(donationData);

  logger.info(`Donation received: ${donation.receipt_number}`);

  res.status(201).json({
    success: true,
    message: 'Donation recorded successfully',
    data: donation,
  });
});

export const getDonation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const donation = await donationService.getDonation(id);

  res.json({
    success: true,
    data: donation,
  });
});

export const getDonationByReceipt = asyncHandler(async (req, res) => {
  const { receiptNumber } = req.params;
  const donation = await donationService.getDonationByReceipt(receiptNumber);

  res.json({
    success: true,
    data: donation,
  });
});

export const getDonationReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const templeId = req.user.temple_id;

  const report = await donationService.getDonationReport(templeId, startDate, endDate);

  res.json({
    success: true,
    data: report,
  });
});

export const getTopDonors = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const templeId = req.user.temple_id;

  const donors = await donationService.getTopDonors(templeId, limit);

  res.json({
    success: true,
    data: donors,
  });
});

export const generate80GCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await donationService.generate80GCertificate(id);

  res.json({
    success: true,
    ...result,
  });
});

export default {
  createDonation,
  getDonation,
  getDonationByReceipt,
  getDonationReport,
  getTopDonors,
  generate80GCertificate,
};
