import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Repository for event_vendors table
 * Handles all database operations for event vendor bookings
 */
class EventVendorRepository {
  /**
   * Create a new event vendor booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  async create(bookingData) {
    const {
      event_id,
      vendor_id,
      service_description,
      quoted_price,
      final_price,
      advance_paid,
      booking_status,
    } = bookingData;

    const balance_amount = (final_price || 0) - (advance_paid || 0);
    const payment_status = this.calculatePaymentStatus(final_price, advance_paid);

    const query = `
      INSERT INTO event_vendors (
        event_id, vendor_id, service_description, quoted_price,
        final_price, advance_paid, balance_amount, payment_status, booking_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      event_id,
      vendor_id,
      service_description,
      quoted_price,
      final_price,
      advance_paid || 0,
      balance_amount,
      payment_status,
      booking_status || 'CONFIRMED',
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Calculate payment status based on amounts
   * @param {number} finalPrice - Final price
   * @param {number} advancePaid - Advance paid
   * @returns {string} Payment status
   */
  calculatePaymentStatus(finalPrice, advancePaid) {
    const paid = advancePaid || 0;
    const total = finalPrice || 0;

    if (paid === 0) return 'PENDING';
    if (paid >= total) return 'PAID';
    return 'PARTIAL';
  }

  /**
   * Find all event vendor bookings with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of bookings
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        ev.*,
        v.vendor_name,
        v.vendor_code,
        v.phone as vendor_phone,
        vc.category_name,
        e.event_number,
        e.event_name,
        e.event_date
      FROM event_vendors ev
      JOIN vendors v ON ev.vendor_id = v.id
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      JOIN events e ON ev.event_id = e.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.event_id) {
      query += ` AND ev.event_id = $${paramCount}`;
      values.push(filters.event_id);
      paramCount++;
    }

    if (filters.vendor_id) {
      query += ` AND ev.vendor_id = $${paramCount}`;
      values.push(filters.vendor_id);
      paramCount++;
    }

    if (filters.payment_status) {
      query += ` AND ev.payment_status = $${paramCount}`;
      values.push(filters.payment_status);
      paramCount++;
    }

    if (filters.booking_status) {
      query += ` AND ev.booking_status = $${paramCount}`;
      values.push(filters.booking_status);
      paramCount++;
    }

    query += ' ORDER BY ev.created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find booking by ID
   * @param {string} id - Booking ID
   * @returns {Promise<Object>} Booking data
   */
  async findById(id) {
    const query = `
      SELECT
        ev.*,
        v.vendor_name,
        v.vendor_code,
        v.contact_person,
        v.phone as vendor_phone,
        v.email as vendor_email,
        vc.category_name,
        e.event_number,
        e.event_name,
        e.event_date,
        e.event_status
      FROM event_vendors ev
      JOIN vendors v ON ev.vendor_id = v.id
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      JOIN events e ON ev.event_id = e.id
      WHERE ev.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Event Vendor Booking');
    }

    return result.rows[0];
  }

  /**
   * Find bookings by event ID
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} List of bookings
   */
  async findByEventId(eventId) {
    const query = `
      SELECT
        ev.*,
        v.vendor_name,
        v.vendor_code,
        v.contact_person,
        v.phone as vendor_phone,
        vc.category_name
      FROM event_vendors ev
      JOIN vendors v ON ev.vendor_id = v.id
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      WHERE ev.event_id = $1
      ORDER BY vc.category_name, v.vendor_name
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Find bookings by vendor ID
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Array>} List of bookings
   */
  async findByVendorId(vendorId) {
    const query = `
      SELECT
        ev.*,
        e.event_number,
        e.event_name,
        e.event_date,
        e.event_status,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name
      FROM event_vendors ev
      JOIN events e ON ev.event_id = e.id
      LEFT JOIN clients c ON e.client_id = c.id
      WHERE ev.vendor_id = $1
      ORDER BY e.event_date DESC
    `;

    const result = await pool.query(query, [vendorId]);
    return result.rows;
  }

  /**
   * Update event vendor booking
   * @param {string} id - Booking ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated booking
   */
  async update(id, updateData) {
    const allowedFields = [
      'service_description',
      'quoted_price',
      'final_price',
      'advance_paid',
      'booking_status',
    ];

    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Always recalculate balance and payment status
    const currentBooking = await this.findById(id);
    const finalPrice = updateData.final_price !== undefined ? updateData.final_price : currentBooking.final_price;
    const advancePaid = updateData.advance_paid !== undefined ? updateData.advance_paid : currentBooking.advance_paid;

    const balance_amount = finalPrice - advancePaid;
    const payment_status = this.calculatePaymentStatus(finalPrice, advancePaid);

    fields.push(`balance_amount = $${paramCount}`);
    values.push(balance_amount);
    paramCount++;

    fields.push(`payment_status = $${paramCount}`);
    values.push(payment_status);
    paramCount++;

    values.push(id);
    const query = `
      UPDATE event_vendors
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Event Vendor Booking');
    }

    return result.rows[0];
  }

  /**
   * Update payment for booking
   * @param {string} id - Booking ID
   * @param {number} additionalPayment - Additional payment amount
   * @returns {Promise<Object>} Updated booking
   */
  async updatePayment(id, additionalPayment) {
    const booking = await this.findById(id);
    const newAdvancePaid = parseFloat(booking.advance_paid) + parseFloat(additionalPayment);

    return this.update(id, { advance_paid: newAdvancePaid });
  }

  /**
   * Update booking status
   * @param {string} id - Booking ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated booking
   */
  async updateStatus(id, status) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const query = `
      UPDATE event_vendors
      SET booking_status = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Event Vendor Booking');
    }

    return result.rows[0];
  }

  /**
   * Delete event vendor booking
   * @param {string} id - Booking ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM event_vendors WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Event Vendor Booking');
    }

    return true;
  }

  /**
   * Get bookings with pending payments
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Array>} Bookings with pending payments
   */
  async getPendingPayments(eventId = null) {
    let query = `
      SELECT
        ev.*,
        v.vendor_name,
        v.phone as vendor_phone,
        e.event_number,
        e.event_name,
        e.event_date
      FROM event_vendors ev
      JOIN vendors v ON ev.vendor_id = v.id
      JOIN events e ON ev.event_id = e.id
      WHERE ev.payment_status IN ('PENDING', 'PARTIAL')
    `;

    const values = [];
    if (eventId) {
      query += ' AND ev.event_id = $1';
      values.push(eventId);
    }

    query += ' ORDER BY e.event_date ASC, ev.balance_amount DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get event vendor summary
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Vendor summary for event
   */
  async getEventVendorSummary(eventId) {
    const query = `
      SELECT
        COUNT(*) as total_vendors,
        COUNT(CASE WHEN payment_status = 'PAID' THEN 1 END) as paid_vendors,
        COUNT(CASE WHEN payment_status = 'PARTIAL' THEN 1 END) as partial_paid_vendors,
        COUNT(CASE WHEN payment_status = 'PENDING' THEN 1 END) as pending_vendors,
        COALESCE(SUM(final_price), 0) as total_cost,
        COALESCE(SUM(advance_paid), 0) as total_paid,
        COALESCE(SUM(balance_amount), 0) as total_balance
      FROM event_vendors
      WHERE event_id = $1
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows[0] || {
      total_vendors: 0,
      paid_vendors: 0,
      partial_paid_vendors: 0,
      pending_vendors: 0,
      total_cost: 0,
      total_paid: 0,
      total_balance: 0,
    };
  }

  /**
   * Get vendor payment summary
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} Payment summary for vendor
   */
  async getVendorPaymentSummary(vendorId) {
    const query = `
      SELECT
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN payment_status = 'PAID' THEN 1 END) as paid_bookings,
        COALESCE(SUM(final_price), 0) as total_revenue,
        COALESCE(SUM(advance_paid), 0) as total_received,
        COALESCE(SUM(balance_amount), 0) as total_pending
      FROM event_vendors
      WHERE vendor_id = $1
    `;

    const result = await pool.query(query, [vendorId]);
    return result.rows[0] || {
      total_bookings: 0,
      paid_bookings: 0,
      total_revenue: 0,
      total_received: 0,
      total_pending: 0,
    };
  }

  /**
   * Check if vendor is booked for an event
   * @param {string} eventId - Event ID
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<boolean>} Booking status
   */
  async isVendorBooked(eventId, vendorId) {
    const query = `
      SELECT 1 FROM event_vendors
      WHERE event_id = $1 AND vendor_id = $2
    `;

    const result = await pool.query(query, [eventId, vendorId]);
    return result.rows.length > 0;
  }

  /**
   * Check if booking exists
   * @param {string} id - Booking ID
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id) {
    const query = 'SELECT 1 FROM event_vendors WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }
}

export default new EventVendorRepository();
