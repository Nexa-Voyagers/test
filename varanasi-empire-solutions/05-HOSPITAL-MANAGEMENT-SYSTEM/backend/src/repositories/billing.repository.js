import { query } from '../config/database.js';

const create = async (billData) => {
  const result = await query(
    `INSERT INTO bills (
      bill_number, hospital_id, patient_id, bill_type, bill_date,
      subtotal, discount_amount, tax_amount, total_amount,
      payment_status, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      billData.bill_number,
      billData.hospital_id,
      billData.patient_id,
      billData.bill_type,
      billData.bill_date || new Date(),
      billData.subtotal,
      billData.discount_amount || 0,
      billData.tax_amount || 0,
      billData.total_amount,
      billData.payment_status || 'PENDING',
      billData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT b.*,
            p.patient_id, p.first_name as patient_first_name,
            p.last_name as patient_last_name, p.mobile as patient_mobile
     FROM bills b
     JOIN patients p ON b.patient_id = p.id
     WHERE b.id = $1`,
    [id]
  );
  return result.rows[0];
};

const findByBillNumber = async (billNumber) => {
  const result = await query(
    `SELECT b.*,
            p.patient_id, p.first_name as patient_first_name,
            p.last_name as patient_last_name
     FROM bills b
     JOIN patients p ON b.patient_id = p.id
     WHERE b.bill_number = $1`,
    [billNumber]
  );
  return result.rows[0];
};

const addBillItem = async (billItemData) => {
  const result = await query(
    `INSERT INTO bill_items (
      bill_id, item_type, item_id, item_name, quantity, unit_price, total_price
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      billItemData.bill_id,
      billItemData.item_type,
      billItemData.item_id,
      billItemData.item_name,
      billItemData.quantity,
      billItemData.unit_price,
      billItemData.total_price,
    ]
  );
  return result.rows[0];
};

const getBillItems = async (billId) => {
  const result = await query(
    `SELECT * FROM bill_items WHERE bill_id = $1 ORDER BY created_at`,
    [billId]
  );
  return result.rows;
};

const updatePaymentStatus = async (billId, status, paymentData = {}) => {
  const result = await query(
    `UPDATE bills
     SET payment_status = $1,
         payment_method = $2,
         payment_date = $3,
         payment_reference = $4,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *`,
    [
      status,
      paymentData.payment_method,
      paymentData.payment_date || new Date(),
      paymentData.payment_reference,
      billId,
    ]
  );
  return result.rows[0];
};

const getRevenue = async (hospitalId, startDate, endDate) => {
  const result = await query(
    `SELECT
       SUM(total_amount) as total_revenue,
       SUM(CASE WHEN payment_status = 'PAID' THEN total_amount ELSE 0 END) as paid_amount,
       SUM(CASE WHEN payment_status = 'PENDING' THEN total_amount ELSE 0 END) as pending_amount,
       COUNT(*) as total_bills,
       COUNT(*) FILTER (WHERE payment_status = 'PAID') as paid_bills
     FROM bills
     WHERE hospital_id = $1
     AND bill_date BETWEEN $2 AND $3`,
    [hospitalId, startDate, endDate]
  );
  return result.rows[0];
};

export const billingRepository = {
  create,
  findById,
  findByBillNumber,
  addBillItem,
  getBillItems,
  updatePaymentStatus,
  getRevenue,
};

export default billingRepository;
