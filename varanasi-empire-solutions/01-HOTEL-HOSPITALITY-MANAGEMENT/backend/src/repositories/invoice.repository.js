import { query } from '../config/database.js';

/**
 * Create invoice/bill
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<Object>}
 */
const create = async (invoiceData) => {
  const sql = `
    INSERT INTO invoices (
      reservation_id, property_id, guest_id, invoice_number,
      room_charges, food_beverage, spa_charges, laundry_charges, other_charges,
      subtotal, cgst_amount, sgst_amount, service_charge, discount_amount,
      total_amount, paid_amount, balance_amount, payment_status, issued_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
    RETURNING *
  `;

  const gstRate = parseFloat(process.env.GST_RATE || 18) / 100;
  const subtotal = invoiceData.subtotal;
  const cgst = subtotal * gstRate / 2;
  const sgst = subtotal * gstRate / 2;

  const values = [
    invoiceData.reservation_id,
    invoiceData.property_id,
    invoiceData.guest_id,
    invoiceData.invoice_number,
    invoiceData.room_charges || 0,
    invoiceData.food_beverage || 0,
    invoiceData.spa_charges || 0,
    invoiceData.laundry_charges || 0,
    invoiceData.other_charges || 0,
    subtotal,
    cgst,
    sgst,
    invoiceData.service_charge || 0,
    invoiceData.discount_amount || 0,
    subtotal + cgst + sgst + (invoiceData.service_charge || 0) - (invoiceData.discount_amount || 0),
    invoiceData.paid_amount || 0,
    (subtotal + cgst + sgst + (invoiceData.service_charge || 0) - (invoiceData.discount_amount || 0)) - (invoiceData.paid_amount || 0),
    invoiceData.payment_status || 'PENDING',
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find invoice by ID
 * @param {string} id - Invoice ID
 * @returns {Promise<Object>}
 */
const findById = async (id) => {
  const sql = `
    SELECT i.*, r.booking_reference, g.first_name, g.last_name, g.email
    FROM invoices i
    LEFT JOIN reservations r ON i.reservation_id = r.id
    LEFT JOIN guests g ON i.guest_id = g.id
    WHERE i.id = $1
  `;

  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Find invoice by invoice number
 * @param {string} invoiceNumber - Invoice number
 * @returns {Promise<Object>}
 */
const findByInvoiceNumber = async (invoiceNumber) => {
  const sql = 'SELECT * FROM invoices WHERE invoice_number = $1';
  const result = await query(sql, [invoiceNumber]);
  return result.rows[0];
};

/**
 * Find invoices by reservation
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<Array>}
 */
const findByReservation = async (reservationId) => {
  const sql = 'SELECT * FROM invoices WHERE reservation_id = $1 ORDER BY issued_at DESC';
  const result = await query(sql, [reservationId]);
  return result.rows;
};

/**
 * Find invoices by property
 * @param {string} propertyId - Property ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const findByProperty = async (propertyId, { limit = 50, offset = 0, status = null } = {}) => {
  let sql = `
    SELECT i.*, g.first_name, g.last_name
    FROM invoices i
    LEFT JOIN guests g ON i.guest_id = g.id
    WHERE i.property_id = $1
  `;

  const values = [propertyId];
  let paramCount = 2;

  if (status) {
    sql += ` AND i.payment_status = $${paramCount}`;
    values.push(status);
    paramCount++;
  }

  sql += ` ORDER BY i.issued_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);

  let countSql = 'SELECT COUNT(*) FROM invoices WHERE property_id = $1';
  const countValues = [propertyId];

  if (status) {
    countSql += ` AND payment_status = $2`;
  }

  const countResult = await query(countSql, countValues);

  return {
    invoices: result.rows,
    totalCount: parseInt(countResult.rows[0].count),
  };
};

/**
 * Update invoice
 * @param {string} id - Invoice ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 */
const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updateData).forEach(key => {
    if (!['id', 'invoice_number', 'created_at'].includes(key)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return await findById(id);
  }

  fields.push(`updated_at = NOW()`);

  const sql = `
    UPDATE invoices
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  values.push(id);

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Update payment status
 * @param {string} id - Invoice ID
 * @param {string} paymentStatus - New payment status
 * @param {number} paidAmount - Amount paid
 * @returns {Promise<Object>}
 */
const updatePaymentStatus = async (id, paymentStatus, paidAmount = 0) => {
  const sql = `
    UPDATE invoices
    SET payment_status = $1, paid_amount = $2, balance_amount = total_amount - $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *
  `;

  const result = await query(sql, [paymentStatus, paidAmount, id]);
  return result.rows[0];
};

/**
 * Get revenue statistics
 * @param {string} propertyId - Property ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>}
 */
const getRevenueStats = async (propertyId, startDate, endDate) => {
  const sql = `
    SELECT
      COUNT(*) as total_invoices,
      SUM(total_amount) as total_revenue,
      SUM(paid_amount) as total_paid,
      SUM(balance_amount) as total_pending,
      AVG(total_amount) as average_invoice_value,
      SUM(cgst_amount + sgst_amount) as total_tax
    FROM invoices
    WHERE property_id = $1
    AND issued_at >= $2::date
    AND issued_at <= $3::date + INTERVAL '1 day'
  `;

  const result = await query(sql, [propertyId, startDate, endDate]);
  return result.rows[0];
};

/**
 * Get unpaid invoices
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array>}
 */
const getUnpaidInvoices = async (propertyId) => {
  const sql = `
    SELECT i.*, g.first_name, g.last_name, g.email
    FROM invoices i
    LEFT JOIN guests g ON i.guest_id = g.id
    WHERE i.property_id = $1
    AND i.payment_status IN ('PENDING', 'PARTIAL')
    ORDER BY i.issued_at DESC
  `;

  const result = await query(sql, [propertyId]);
  return result.rows;
};

export const invoiceRepository = {
  create,
  findById,
  findByInvoiceNumber,
  findByReservation,
  findByProperty,
  update,
  updatePaymentStatus,
  getRevenueStats,
  getUnpaidInvoices,
};
