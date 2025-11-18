import { pool } from '../config/database.js';

/**
 * Institute Repository
 * Handles all database operations for institutes
 */
class InstituteRepository {
  /**
   * Create a new institute
   * @param {Object} instituteData - Institute details
   * @returns {Promise<Object>} Created institute
   */
  async create(instituteData) {
    const {
      name,
      registration_number,
      contact_email,
      contact_phone,
      address,
      city,
      state,
      pincode,
      website,
      established_year,
      affiliation,
      director_name,
      director_phone,
      status = 'ACTIVE'
    } = instituteData;

    const query = `
      INSERT INTO institutes (
        name, registration_number, contact_email, contact_phone,
        address, city, state, pincode, website, established_year,
        affiliation, director_name, director_phone, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      name, registration_number, contact_email, contact_phone,
      address, city, state, pincode, website, established_year,
      affiliation, director_name, director_phone, status
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find institute by ID
   * @param {number} id - Institute ID
   * @returns {Promise<Object|null>} Institute or null
   */
  async findById(id) {
    const query = 'SELECT * FROM institutes WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find institute by registration number
   * @param {string} registrationNumber - Registration number
   * @returns {Promise<Object|null>} Institute or null
   */
  async findByRegistrationNumber(registrationNumber) {
    const query = 'SELECT * FROM institutes WHERE registration_number = $1';
    const result = await pool.query(query, [registrationNumber]);
    return result.rows[0] || null;
  }

  /**
   * Get all institutes with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of institutes
   */
  async findAll(filters = {}) {
    let query = 'SELECT * FROM institutes WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.city) {
      query += ` AND city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.state) {
      query += ` AND state ILIKE $${paramCount}`;
      values.push(`%${filters.state}%`);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (name ILIKE $${paramCount} OR registration_number ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update institute
   * @param {number} id - Institute ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated institute or null
   */
  async update(id, updateData) {
    const allowedFields = [
      'name', 'registration_number', 'contact_email', 'contact_phone',
      'address', 'city', 'state', 'pincode', 'website', 'established_year',
      'affiliation', 'director_name', 'director_phone', 'status'
    ];

    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      return null;
    }

    values.push(id);
    const query = `
      UPDATE institutes
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete institute
   * @param {number} id - Institute ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM institutes WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get institute statistics
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics(instituteId) {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM courses WHERE institute_id = $1) as total_courses,
        (SELECT COUNT(*) FROM batches WHERE institute_id = $1) as total_batches,
        (SELECT COUNT(*) FROM faculty WHERE institute_id = $1) as total_faculty,
        (SELECT COUNT(*) FROM students WHERE institute_id = $1) as total_students
    `;
    const result = await pool.query(query, [instituteId]);
    return result.rows[0];
  }
}

export default new InstituteRepository();
