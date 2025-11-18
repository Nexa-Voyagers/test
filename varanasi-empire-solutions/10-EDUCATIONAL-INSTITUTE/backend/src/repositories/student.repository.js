import { pool } from '../config/database.js';

/**
 * Student Repository
 * Handles all database operations for students
 */
class StudentRepository {
  /**
   * Create a new student
   * @param {Object} studentData - Student details
   * @returns {Promise<Object>} Created student
   */
  async create(studentData) {
    const {
      institute_id,
      name,
      enrollment_number,
      email,
      phone,
      date_of_birth,
      gender,
      father_name,
      mother_name,
      parent_phone,
      address,
      city,
      state,
      pincode,
      qualification,
      target_exam,
      previous_percentage,
      category,
      status = 'ACTIVE'
    } = studentData;

    const query = `
      INSERT INTO students (
        institute_id, name, enrollment_number, email, phone, date_of_birth,
        gender, father_name, mother_name, parent_phone, address, city, state,
        pincode, qualification, target_exam, previous_percentage, category, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;

    const values = [
      institute_id, name, enrollment_number, email, phone, date_of_birth,
      gender, father_name, mother_name, parent_phone, address, city, state,
      pincode, qualification, target_exam, previous_percentage, category, status
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find student by ID
   * @param {number} id - Student ID
   * @returns {Promise<Object|null>} Student or null
   */
  async findById(id) {
    const query = `
      SELECT s.*, i.name as institute_name
      FROM students s
      LEFT JOIN institutes i ON s.institute_id = i.id
      WHERE s.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find student by enrollment number
   * @param {string} enrollmentNumber - Enrollment number
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Object|null>} Student or null
   */
  async findByEnrollmentNumber(enrollmentNumber, instituteId) {
    const query = 'SELECT * FROM students WHERE enrollment_number = $1 AND institute_id = $2';
    const result = await pool.query(query, [enrollmentNumber, instituteId]);
    return result.rows[0] || null;
  }

  /**
   * Find student by email
   * @param {string} email - Email
   * @returns {Promise<Object|null>} Student or null
   */
  async findByEmail(email) {
    const query = 'SELECT * FROM students WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Get all students with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of students
   */
  async findAll(filters = {}) {
    let query = `
      SELECT s.*, i.name as institute_name
      FROM students s
      LEFT JOIN institutes i ON s.institute_id = i.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.institute_id) {
      query += ` AND s.institute_id = $${paramCount}`;
      values.push(filters.institute_id);
      paramCount++;
    }

    if (filters.target_exam) {
      query += ` AND s.target_exam ILIKE $${paramCount}`;
      values.push(`%${filters.target_exam}%`);
      paramCount++;
    }

    if (filters.category) {
      query += ` AND s.category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND s.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (s.name ILIKE $${paramCount} OR s.enrollment_number ILIKE $${paramCount} OR s.phone ILIKE $${paramCount} OR s.email ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY s.name ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update student
   * @param {number} id - Student ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated student or null
   */
  async update(id, updateData) {
    const allowedFields = [
      'name', 'enrollment_number', 'email', 'phone', 'date_of_birth',
      'gender', 'father_name', 'mother_name', 'parent_phone', 'address',
      'city', 'state', 'pincode', 'qualification', 'target_exam',
      'previous_percentage', 'category', 'status'
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
      UPDATE students
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete student
   * @param {number} id - Student ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM students WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get student enrollments
   * @param {number} studentId - Student ID
   * @returns {Promise<Array>} List of enrollments
   */
  async getEnrollments(studentId) {
    const query = `
      SELECT
        e.*,
        b.name as batch_name,
        b.batch_code,
        c.name as course_name,
        c.code as course_code
      FROM enrollments e
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      WHERE e.student_id = $1
      ORDER BY e.enrollment_date DESC
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  /**
   * Get student performance summary
   * @param {number} studentId - Student ID
   * @returns {Promise<Object>} Performance summary
   */
  async getPerformanceSummary(studentId) {
    const query = `
      SELECT
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT e.id) FILTER (WHERE e.enrollment_status = 'ACTIVE') as active_enrollments,
        COALESCE(AVG(
          CASE
            WHEN a.attendance_count > 0
            THEN (a.present_count::FLOAT / a.attendance_count * 100)
            ELSE 0
          END
        ), 0) as avg_attendance_percentage,
        COALESCE(AVG(tr.percentage), 0) as avg_test_percentage
      FROM students s
      LEFT JOIN enrollments e ON s.id = e.student_id
      LEFT JOIN (
        SELECT enrollment_id,
               COUNT(*) as attendance_count,
               COUNT(*) FILTER (WHERE status = 'PRESENT') as present_count
        FROM attendance
        GROUP BY enrollment_id
      ) a ON e.id = a.enrollment_id
      LEFT JOIN test_results tr ON e.id = tr.enrollment_id
      WHERE s.id = $1
      GROUP BY s.id
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows[0] || {
      total_enrollments: 0,
      active_enrollments: 0,
      avg_attendance_percentage: 0,
      avg_test_percentage: 0
    };
  }
}

export default new StudentRepository();
