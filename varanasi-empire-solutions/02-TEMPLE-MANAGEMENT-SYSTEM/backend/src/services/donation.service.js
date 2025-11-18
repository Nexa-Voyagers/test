import { donationRepository } from '../repositories/donation.repository.js';
import { devoteeRepository } from '../repositories/devotee.repository.js';
import { NotFoundError } from '../utils/errors.js';

const generateReceiptNumber = () => `DN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const createDonation = async (donationData) => {
  if (donationData.devotee_id) {
    const devotee = await devoteeRepository.findById(donationData.devotee_id);
    if (!devotee) {
      throw new NotFoundError('Devotee');
    }
  }

  const donation = await donationRepository.createDonation({
    ...donationData,
    receipt_number: generateReceiptNumber(),
  });

  return donation;
};

const getDonation = async (id) => {
  const donation = await donationRepository.findById(id);
  if (!donation) {
    throw new NotFoundError('Donation');
  }
  return donation;
};

const getDonationByReceipt = async (receiptNumber) => {
  const donation = await donationRepository.findByReceiptNumber(receiptNumber);
  if (!donation) {
    throw new NotFoundError('Donation');
  }
  return donation;
};

const getDonationReport = async (templeId, startDate, endDate) => {
  const report = await donationRepository.getDonationsByDateRange(templeId, startDate, endDate);
  return report;
};

const getTopDonors = async (templeId, limit = 10) => {
  const donors = await donationRepository.getTopDonors(templeId, limit);
  return donors;
};

const generate80GCertificate = async (donationId) => {
  const donation = await donationRepository.findById(donationId);
  if (!donation) {
    throw new NotFoundError('Donation');
  }

  if (!donation.is_80g_eligible) {
    throw new Error('Donation is not eligible for 80G certificate');
  }

  const updated = await donationRepository.generate80GCertificate(donationId);
  return {
    message: '80G Certificate generated successfully',
    donation: updated,
  };
};

export const donationService = {
  createDonation,
  getDonation,
  getDonationByReceipt,
  getDonationReport,
  getTopDonors,
  generate80GCertificate,
};

export default donationService;
