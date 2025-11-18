import { pool } from '../config/database.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Repository for vendors table
 * Handles all database operations for vendor management
 */
class VendorRepository {
  /**
   * Create a new vendor
   * @param {Object} vendorData - Vendor data
   * @returns {Promise<Object>} Created vendor
   */
  async create(vendorData) {
    const {
      vendor_code,
      vendor_name,
      category_id,
      contact_person,
      phone,
      email,
      address,
      city,
      services_offered,
      rating,
      base_price,
    } = vendorData;

    // Check if vendor_code already exists
    const existingVendor = await this.findByVendorCode(vendor_code);
    if (existingVendor) {
      throw new ConflictError('Vendor code already exists');
    }

    const query = `
      INSERT INTO vendors (
        vendor_code, vendor_name, category_id, contact_person,
        phone, email, address, city, services_offered, rating, base_price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      vendor_code,
      vendor_name,
      category_id,
      contact_person,
      phone,
      email,
      address,
      city,
      services_offered,
      rating,
      base_price,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all vendors with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of vendors
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        v.*,
        vc.category_name,
        COUNT(DISTINCT ev.id) as booking_count
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN event_vendors ev ON v.id = ev.vendor_id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.category_id) {
      query += ` AND v.category_id = $${paramCount}`;
      values.push(filters.category_id);
      paramCount++;
    }

    if (filters.city) {
      query += ` AND v.city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      query += ` AND v.is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    if (filters.min_rating) {
      query += ` AND v.rating >= $${paramCount}`;
      values.push(filters.min_rating);
      paramCount++;
    }

    if (filters.max_price) {
      query += ` AND v.base_price <= $${paramCount}`;
      values.push(filters.max_price);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (
        v.vendor_name ILIKE $${paramCount} OR
        v.vendor_code ILIKE $${paramCount} OR
        v.contact_person ILIKE $${paramCount}
      )`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' GROUP BY v.id, vc.category_name';

    // Sorting
    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'DESC';
    const validSortFields = ['vendor_name', 'rating', 'base_price', 'created_at', 'booking_count'];
    const validSortOrders = ['ASC', 'DESC'];

    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      if (sortBy === 'booking_count') {
        query += ` ORDER BY booking_count ${sortOrder}`;
      } else {
        query += ` ORDER BY v.${sortBy} ${sortOrder}`;
      }
    } else {
      query += ' ORDER BY v.created_at DESC';
    }

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
   * Find vendor by ID
   * @param {string} id - Vendor ID
   * @returns {Promise<Object>} Vendor data
   */
  async findById(id) {
    const query = `
      SELECT
        v.*,
        vc.category_name,
        COUNT(DISTINCT ev.id) as booking_count,
        COALESCE(AVG(CASE WHEN ev.booking_status = 'CONFIRMED' THEN 1 ELSE 0 END), 0) as completion_rate
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN event_vendors ev ON v.id = ev.vendor_id
      WHERE v.id = $1
      GROUP BY v.id, vc.category_name
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Vendor');
    }

    return result.rows[0];
  }

  /**
   * Find vendor by vendor code
   * @param {string} vendorCode - Vendor code
   * @returns {Promise<Object|null>} Vendor data or null
   */
  async findByVendorCode(vendorCode) {
    const query = 'SELECT * FROM vendors WHERE vendor_code = $1';
    const result = await pool.query(query, [vendorCode]);
    return result.rows[0] || null;
  }

  /**
   * Find vendors by category
   * @param {string} categoryId - Category ID
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} List of vendors
   */
  async findByCategory(categoryId, options = {}) {
    let query = `
      SELECT
        v.*,
        vc.category_name,
        COUNT(DISTINCT ev.id) as booking_count
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN event_vendors ev ON v.id = ev.vendor_id
      WHERE v.category_id = $1 AND v.is_active = true
      GROUP BY v.id, vc.category_name
    `;

    const values = [categoryId];
    let paramCount = 2;

    if (options.city) {
      query += ` AND v.city ILIKE $${paramCount}`;
      values.push(`%${options.city}%`);
      paramCount++;
    }

    query += ' ORDER BY v.rating DESC, booking_count DESC';

    if (options.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(options.limit);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Search vendors by city and rating
   * @param {string} city - City name
   * @param {number} minRating - Minimum rating
   * @returns {Promise<Array>} List of vendors
   */
  async searchByCityAndRating(city, minRating = 0) {
    const query = `
      SELECT
        v.*,
        vc.category_name,
        COUNT(DISTINCT ev.id) as booking_count
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN event_vendors ev ON v.id = ev.vendor_id
      WHERE v.city ILIKE $1
        AND v.rating >= $2
        AND v.is_active = true
      GROUP BY v.id, vc.category_name
      ORDER BY v.rating DESC, booking_count DESC
    `;

    const result = await pool.query(query, [`%${city}%`, minRating]);
    return result.rows;
  }

  /**
   * Get top rated vendors
   * @param {number} limit - Number of vendors to return
   * @param {string} categoryId - Optional category filter
   * @returns {Promise<Array>} Top rated vendors
   */
  async getTopRated(limit = 10, categoryId = null) {
    let query = `
      SELECT
        v.*,
        vc.category_name,
        COUNT(DISTINCT ev.id) as booking_count
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN event_vendors ev ON v.id = ev.vendor_id
      WHERE v.is_active = true AND v.rating IS NOT NULL
    `;

    const values = [];
    let paramCount = 1;

    if (categoryId) {
      query += ` AND v.category_id = $${paramCount}`;
      values.push(categoryId);
      paramCount++;
    }

    query += `
      GROUP BY v.id, vc.category_name
      ORDER BY v.rating DESC, booking_count DESC
      LIMIT $${paramCount}
    `;
    values.push(limit);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update vendor
   * @param {string} id - Vendor ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated vendor
   */
  async update(id, updateData) {
    const allowedFields = [
      'vendor_name',
      'category_id',
      'contact_person',
      'phone',
      'email',
      'address',
      'city',
      'services_offered',
      'rating',
      'base_price',
      'is_active',
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

    values.push(id);
    const query = `
      UPDATE vendors
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Vendor');
    }

    return result.rows[0];
  }

  /**
   * Delete vendor (soft delete)
   * @param {string} id - Vendor ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = `
      UPDATE vendors
      SET is_active = false
      WHERE id = $1
      RETURNING id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Vendor');
    }

    return true;
  }

  /**
   * Get vendor bookings history
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Array>} Booking history
   */
  async getBookingHistory(vendorId) {
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
   * Get vendor performance metrics
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} Performance metrics
   */
  async getPerformanceMetrics(vendorId) {
    const query = `
      SELECT
        COUNT(ev.id) as total_bookings,
        COUNT(CASE WHEN ev.booking_status = 'CONFIRMED' THEN 1 END) as confirmed_bookings,
        COUNT(CASE WHEN ev.payment_status = 'PAID' THEN 1 END) as paid_bookings,
        COALESCE(SUM(ev.final_price), 0) as total_revenue,
        COALESCE(SUM(ev.advance_paid), 0) as total_advance_received,
        COALESCE(SUM(ev.balance_amount), 0) as total_balance_pending,
        COALESCE(AVG(ev.final_price), 0) as average_booking_value
      FROM event_vendors ev
      WHERE ev.vendor_id = $1
    `;

    const result = await pool.query(query, [vendorId]);
    return result.rows[0] || {
      total_bookings: 0,
      confirmed_bookings: 0,
      paid_bookings: 0,
      total_revenue: 0,
      total_advance_received: 0,
      total_balance_pending: 0,
      average_booking_value: 0,
    };
  }

  /**
   * Generate unique vendor code
   * @param {string} prefix - Prefix for vendor code
   * @returns {Promise<string>} Generated vendor code
   */
  async generateVendorCode(prefix = 'VEN') {
    const query = `
      SELECT vendor_code
      FROM vendors
      WHERE vendor_code LIKE $1
      ORDER BY vendor_code DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [`${prefix}%`]);

    if (result.rows.length === 0) {
      return `${prefix}0001`;
    }

    const lastCode = result.rows[0].vendor_code;
    const lastNumber = parseInt(lastCode.replace(prefix, ''));
    const newNumber = (lastNumber + 1).toString().padStart(4, '0');

    return `${prefix}${newNumber}`;
  }

  /**
   * Check if vendor exists
   * @param {string} id - Vendor ID
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id) {
    const query = 'SELECT 1 FROM vendors WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Get available vendors for a date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {string} categoryId - Optional category filter
   * @returns {Promise<Array>} Available vendors
   */
  async getAvailableVendors(startDate, endDate, categoryId = null) {
    let query = `
      SELECT
        v.*,
        vc.category_name,
        COUNT(DISTINCT ev.id) as booking_count
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN event_vendors ev ON v.id = ev.vendor_id
      WHERE v.is_active = true
        AND v.id NOT IN (
          SELECT DISTINCT vendor_id
          FROM event_vendors
          JOIN events ON event_vendors.event_id = events.id
          WHERE events.event_date BETWEEN $1 AND $2
            AND event_vendors.booking_status = 'CONFIRMED'
        )
    `;

    const values = [startDate, endDate];
    let paramCount = 3;

    if (categoryId) {
      query += ` AND v.category_id = $${paramCount}`;
      values.push(categoryId);
    }

    query += `
      GROUP BY v.id, vc.category_name
      ORDER BY v.rating DESC, booking_count DESC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default new VendorRepository();
