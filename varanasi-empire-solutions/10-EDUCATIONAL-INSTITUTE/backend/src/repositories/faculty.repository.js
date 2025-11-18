import { pool } from '../config/database.js';

/**
 * Faculty Repository
 * Handles all database operations for faculty
 */
class FacultyRepository {
  /**
   * Create a new faculty member
   * @param {Object} facultyData - Faculty details
   * @returns {Promise<Object>} Created faculty
   */
  async create(facultyData) {
    const {
      institute_id,
      name,
      employee_code,
      email,
      phone,
      date_of_birth,
      gender,
      qualification,
      specialization,
      experience_years,
      date_of_joining,
      hourly_rate,
      address,
      city,
      state,
      pincode,
      status = 'ACTIVE'
    } = facultyData;

    const query = `
      INSERT INTO faculty (
        institute_id, name, employee_code, email, phone, date_of_birth,
        gender, qualification, specialization, experience_years,
        date_of_joining, hourly_rate, address, city, state, pincode, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const values = [
      institute_id, name, employee_code, email, phone, date_of_birth,
      gender, qualification, specialization, experience_years,
      date_of_joining, hourly_rate, address, city, state, pincode, status
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find faculty by ID
   * @param {number} id - Faculty ID
   * @returns {Promise<Object|null>} Faculty or null
   */
  async findById(id) {
    const query = `
      SELECT f.*, i.name as institute_name
      FROM faculty f
      LEFT JOIN institutes i ON f.institute_id = i.id
      WHERE f.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find faculty by employee code
   * @param {string} employeeCode - Employee code
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Object|null>} Faculty or null
   */
  async findByEmployeeCode(employeeCode, instituteId) {
    const query = 'SELECT * FROM faculty WHERE employee_code = $1 AND institute_id = $2';
    const result = await pool.query(query, [employeeCode, instituteId]);
    return result.rows[0] || null;
  }

  /**
   * Find faculty by email
   * @param {string} email - Email
   * @returns {Promise<Object|null>} Faculty or null
   */
  async findByEmail(email) {
    const query = 'SELECT * FROM faculty WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Get all faculty with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of faculty
   */
  async findAll(filters = {}) {
    let query = `
      SELECT f.*, i.name as institute_name
      FROM faculty f
      LEFT JOIN institutes i ON f.institute_id = i.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.institute_id) {
      query += ` AND f.institute_id = $${paramCount}`;
      values.push(filters.institute_id);
      paramCount++;
    }

    if (filters.specialization) {
      query += ` AND f.specialization ILIKE $${paramCount}`;
      values.push(`%${filters.specialization}%`);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND f.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (f.name ILIKE $${paramCount} OR f.employee_code ILIKE $${paramCount} OR f.email ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY f.name ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update faculty
   * @param {number} id - Faculty ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated faculty or null
   */
  async update(id, updateData) {
    const allowedFields = [
      'name', 'employee_code', 'email', 'phone', 'date_of_birth',
      'gender', 'qualification', 'specialization', 'experience_years',
      'date_of_joining', 'hourly_rate', 'address', 'city', 'state',
      'pincode', 'status'
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
      UPDATE faculty
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete faculty
   * @param {number} id - Faculty ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM faculty WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get faculty batches
   * @param {number} facultyId - Faculty ID
   * @returns {Promise<Array>} List of batches
   */
  async getBatches(facultyId) {
    const query = `
      SELECT
        b.*,
        c.name as course_name,
        c.code as course_code,
        (b.max_students - b.enrolled_students) as available_seats
      FROM batches b
      LEFT JOIN courses c ON b.course_id = c.id
      WHERE b.faculty_id = $1
      ORDER BY b.start_date DESC
    `;
    const result = await pool.query(query, [facultyId]);
    return result.rows;
  }

  /**
   * Get faculty statistics
   * @param {number} facultyId - Faculty ID
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics(facultyId) {
    const query = `
      SELECT
        COUNT(DISTINCT b.id) as total_batches,
        COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'ONGOING') as active_batches,
        COUNT(DISTINCT e.student_id) as total_students
      FROM faculty f
      LEFT JOIN batches b ON f.id = b.faculty_id
      LEFT JOIN enrollments e ON b.id = e.batch_id AND e.enrollment_status = 'ACTIVE'
      WHERE f.id = $1
      GROUP BY f.id
    `;
    const result = await pool.query(query, [facultyId]);
    return result.rows[0] || { total_batches: 0, active_batches: 0, total_students: 0 };
  }
}

export default new FacultyRepository();
