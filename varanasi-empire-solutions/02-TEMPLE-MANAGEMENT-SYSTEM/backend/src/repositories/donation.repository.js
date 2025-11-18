import { query } from '../config/database.js';

const createDonation = async (donationData) => {
  const result = await query(
    `INSERT INTO donations (
      receipt_number, temple_id, devotee_id, donation_type, amount,
      payment_method, payment_date, purpose, is_80g_eligible, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      donationData.receipt_number,
      donationData.temple_id,
      donationData.devotee_id,
      donationData.donation_type,
      donationData.amount,
      donationData.payment_method,
      donationData.payment_date || new Date(),
      donationData.purpose,
      donationData.is_80g_eligible || true,
      donationData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT dn.*, d.first_name, d.last_name, d.phone, d.email, d.address
     FROM donations dn
     LEFT JOIN devotees d ON dn.devotee_id = d.id
     WHERE dn.id = $1`,
    [id]
  );
  return result.rows[0];
};

const findByReceiptNumber = async (receiptNumber) => {
  const result = await query(
    `SELECT dn.*, d.first_name, d.last_name, d.phone, d.email
     FROM donations dn
     LEFT JOIN devotees d ON dn.devotee_id = d.id
     WHERE dn.receipt_number = $1`,
    [receiptNumber]
  );
  return result.rows[0];
};

const getDonationsByDateRange = async (templeId, startDate, endDate) => {
  const result = await query(
    `SELECT
       COUNT(*) as total_donations,
       SUM(amount) as total_amount,
       SUM(CASE WHEN is_80g_eligible = true THEN amount ELSE 0 END) as tax_eligible_amount,
       donation_type,
       payment_method
     FROM donations
     WHERE temple_id = $1
     AND payment_date BETWEEN $2 AND $3
     GROUP BY donation_type, payment_method`,
    [templeId, startDate, endDate]
  );
  return result.rows;
};

const getTopDonors = async (templeId, limit = 10) => {
  const result = await query(
    `SELECT
       d.id, d.first_name, d.last_name, d.phone,
       COUNT(dn.id) as total_donations,
       SUM(dn.amount) as total_donated
     FROM devotees d
     JOIN donations dn ON d.id = dn.devotee_id
     WHERE dn.temple_id = $1
     GROUP BY d.id
     ORDER BY total_donated DESC
     LIMIT $2`,
    [templeId, limit]
  );
  return result.rows;
};

const generate80GCertificate = async (donationId) => {
  const result = await query(
    `UPDATE donations
     SET certificate_80g_generated = true,
         certificate_80g_date = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [donationId]
  );
  return result.rows[0];
};

export const donationRepository = {
  createDonation,
  findById,
  findByReceiptNumber,
  getDonationsByDateRange,
  getTopDonors,
  generate80GCertificate,
};

export default donationRepository;
