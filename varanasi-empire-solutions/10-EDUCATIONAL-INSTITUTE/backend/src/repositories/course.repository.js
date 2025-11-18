import { pool } from '../config/database.js';

/**
 * Course Repository
 * Handles all database operations for courses
 */
class CourseRepository {
  /**
   * Create a new course
   * @param {Object} courseData - Course details
   * @returns {Promise<Object>} Created course
   */
  async create(courseData) {
    const {
      institute_id,
      name,
      code,
      description,
      category,
      duration_months,
      course_fee,
      registration_fee,
      study_material_fee,
      syllabus,
      prerequisites,
      status = 'ACTIVE'
    } = courseData;

    const query = `
      INSERT INTO courses (
        institute_id, name, code, description, category, duration_months,
        course_fee, registration_fee, study_material_fee, syllabus,
        prerequisites, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      institute_id, name, code, description, category, duration_months,
      course_fee, registration_fee, study_material_fee, syllabus,
      prerequisites, status
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find course by ID
   * @param {number} id - Course ID
   * @returns {Promise<Object|null>} Course or null
   */
  async findById(id) {
    const query = `
      SELECT c.*, i.name as institute_name
      FROM courses c
      LEFT JOIN institutes i ON c.institute_id = i.id
      WHERE c.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find course by code
   * @param {string} code - Course code
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Object|null>} Course or null
   */
  async findByCode(code, instituteId) {
    const query = 'SELECT * FROM courses WHERE code = $1 AND institute_id = $2';
    const result = await pool.query(query, [code, instituteId]);
    return result.rows[0] || null;
  }

  /**
   * Get all courses with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of courses
   */
  async findAll(filters = {}) {
    let query = `
      SELECT c.*, i.name as institute_name
      FROM courses c
      LEFT JOIN institutes i ON c.institute_id = i.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.institute_id) {
      query += ` AND c.institute_id = $${paramCount}`;
      values.push(filters.institute_id);
      paramCount++;
    }

    if (filters.category) {
      query += ` AND c.category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND c.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (c.name ILIKE $${paramCount} OR c.code ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY c.name ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update course
   * @param {number} id - Course ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated course or null
   */
  async update(id, updateData) {
    const allowedFields = [
      'name', 'code', 'description', 'category', 'duration_months',
      'course_fee', 'registration_fee', 'study_material_fee', 'syllabus',
      'prerequisites', 'status'
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
      UPDATE courses
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete course
   * @param {number} id - Course ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM courses WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get total fee for a course
   * @param {number} courseId - Course ID
   * @returns {Promise<number>} Total fee
   */
  async getTotalFee(courseId) {
    const query = `
      SELECT (course_fee + registration_fee + study_material_fee) as total_fee
      FROM courses
      WHERE id = $1
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows[0]?.total_fee || 0;
  }

  /**
   * Get course enrollment statistics
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} Statistics
   */
  async getEnrollmentStats(courseId) {
    const query = `
      SELECT
        COUNT(DISTINCT b.id) as total_batches,
        COUNT(DISTINCT e.id) as total_enrollments,
        COALESCE(SUM(e.final_fee), 0) as total_revenue,
        COALESCE(SUM(e.fee_paid), 0) as total_collected
      FROM courses c
      LEFT JOIN batches b ON c.id = b.course_id
      LEFT JOIN enrollments e ON b.id = e.batch_id
      WHERE c.id = $1
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows[0];
  }
}

export default new CourseRepository();
