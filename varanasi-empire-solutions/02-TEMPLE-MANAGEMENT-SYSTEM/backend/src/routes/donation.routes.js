import express from 'express';
import {
  createDonation,
  getDonation,
  getDonationByReceipt,
  getDonationReport,
  getTopDonors,
  generate80GCertificate,
} from '../controllers/donation.controller.js';

const router = express.Router();

router.post('/', createDonation);
router.get('/report', getDonationReport);
router.get('/top-donors', getTopDonors);
router.get('/receipt/:receiptNumber', getDonationByReceipt);
router.get('/:id', getDonation);
router.post('/:id/80g-certificate', generate80GCertificate);

export default router;
