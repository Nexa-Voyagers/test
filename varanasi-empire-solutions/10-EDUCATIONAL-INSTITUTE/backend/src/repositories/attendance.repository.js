import { pool } from '../config/database.js';

/**
 * Attendance Repository
 * Handles all database operations for attendance
 */
class AttendanceRepository {
  /**
   * Mark attendance for a student
   * @param {Object} attendanceData - Attendance details
   * @returns {Promise<Object>} Created attendance record
   */
  async create(attendanceData) {
    const {
      enrollment_id,
      attendance_date,
      status,
      marked_by,
      remarks
    } = attendanceData;

    const query = `
      INSERT INTO attendance (
        enrollment_id, attendance_date, status, marked_by, remarks
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [enrollment_id, attendance_date, status, marked_by, remarks];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Mark bulk attendance for a batch
   * @param {Array} attendanceRecords - Array of attendance records
   * @returns {Promise<Array>} Created attendance records
   */
  async createBulk(attendanceRecords) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const createdRecords = [];
      for (const record of attendanceRecords) {
        const query = `
          INSERT INTO attendance (
            enrollment_id, attendance_date, status, marked_by, remarks
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        const values = [
          record.enrollment_id,
          record.attendance_date,
          record.status,
          record.marked_by,
          record.remarks
        ];
        const result = await client.query(query, values);
        createdRecords.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return createdRecords;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Find attendance by ID
   * @param {number} id - Attendance ID
   * @returns {Promise<Object|null>} Attendance or null
   */
  async findById(id) {
    const query = `
      SELECT
        a.*,
        e.student_id,
        s.name as student_name,
        s.enrollment_number,
        b.name as batch_name,
        c.name as course_name
      FROM attendance a
      LEFT JOIN enrollments e ON a.enrollment_id = e.id
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      WHERE a.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find attendance by enrollment and date
   * @param {number} enrollmentId - Enrollment ID
   * @param {string} date - Attendance date
   * @returns {Promise<Object|null>} Attendance or null
   */
  async findByEnrollmentAndDate(enrollmentId, date) {
    const query = 'SELECT * FROM attendance WHERE enrollment_id = $1 AND attendance_date = $2';
    const result = await pool.query(query, [enrollmentId, date]);
    return result.rows[0] || null;
  }

  /**
   * Get all attendance records with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of attendance records
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        a.*,
        e.student_id,
        e.batch_id,
        s.name as student_name,
        s.enrollment_number,
        b.name as batch_name,
        c.name as course_name
      FROM attendance a
      LEFT JOIN enrollments e ON a.enrollment_id = e.id
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.enrollment_id) {
      query += ` AND a.enrollment_id = $${paramCount}`;
      values.push(filters.enrollment_id);
      paramCount++;
    }

    if (filters.batch_id) {
      query += ` AND e.batch_id = $${paramCount}`;
      values.push(filters.batch_id);
      paramCount++;
    }

    if (filters.student_id) {
      query += ` AND e.student_id = $${paramCount}`;
      values.push(filters.student_id);
      paramCount++;
    }

    if (filters.attendance_date) {
      query += ` AND a.attendance_date = $${paramCount}`;
      values.push(filters.attendance_date);
      paramCount++;
    }

    if (filters.date_from) {
      query += ` AND a.attendance_date >= $${paramCount}`;
      values.push(filters.date_from);
      paramCount++;
    }

    if (filters.date_to) {
      query += ` AND a.attendance_date <= $${paramCount}`;
      values.push(filters.date_to);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND a.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    query += ' ORDER BY a.attendance_date DESC, s.name ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update attendance
   * @param {number} id - Attendance ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated attendance or null
   */
  async update(id, updateData) {
    const allowedFields = ['status', 'remarks'];

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
      UPDATE attendance
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete attendance
   * @param {number} id - Attendance ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM attendance WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get attendance percentage for an enrollment
   * @param {number} enrollmentId - Enrollment ID
   * @returns {Promise<Object>} Attendance percentage
   */
  async getAttendancePercentage(enrollmentId) {
    const query = `
      SELECT
        COUNT(*) as total_days,
        COUNT(*) FILTER (WHERE status = 'PRESENT') as present_days,
        COUNT(*) FILTER (WHERE status = 'ABSENT') as absent_days,
        COUNT(*) FILTER (WHERE status = 'LATE') as late_days,
        COUNT(*) FILTER (WHERE status = 'ON_LEAVE') as leave_days,
        CASE
          WHEN COUNT(*) > 0
          THEN ROUND((COUNT(*) FILTER (WHERE status = 'PRESENT')::NUMERIC / COUNT(*) * 100), 2)
          ELSE 0
        END as attendance_percentage
      FROM attendance
      WHERE enrollment_id = $1
    `;
    const result = await pool.query(query, [enrollmentId]);
    return result.rows[0];
  }

  /**
   * Get batch attendance report for a specific date
   * @param {number} batchId - Batch ID
   * @param {string} date - Date
   * @returns {Promise<Array>} Attendance report
   */
  async getBatchAttendanceReport(batchId, date) {
    const query = `
      SELECT
        s.id as student_id,
        s.name as student_name,
        s.enrollment_number,
        e.id as enrollment_id,
        COALESCE(a.status, 'NOT_MARKED') as status,
        a.remarks
      FROM enrollments e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN attendance a ON e.id = a.enrollment_id AND a.attendance_date = $2
      WHERE e.batch_id = $1 AND e.enrollment_status = 'ACTIVE'
      ORDER BY s.name ASC
    `;
    const result = await pool.query(query, [batchId, date]);
    return result.rows;
  }

  /**
   * Get student attendance summary
   * @param {number} studentId - Student ID
   * @param {number} batchId - Batch ID (optional)
   * @returns {Promise<Array>} Attendance summary
   */
  async getStudentAttendanceSummary(studentId, batchId = null) {
    let query = `
      SELECT
        e.id as enrollment_id,
        b.name as batch_name,
        c.name as course_name,
        COUNT(a.id) as total_days,
        COUNT(a.id) FILTER (WHERE a.status = 'PRESENT') as present_days,
        COUNT(a.id) FILTER (WHERE a.status = 'ABSENT') as absent_days,
        CASE
          WHEN COUNT(a.id) > 0
          THEN ROUND((COUNT(a.id) FILTER (WHERE a.status = 'PRESENT')::NUMERIC / COUNT(a.id) * 100), 2)
          ELSE 0
        END as attendance_percentage
      FROM enrollments e
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      LEFT JOIN attendance a ON e.id = a.enrollment_id
      WHERE e.student_id = $1
    `;
    const values = [studentId];

    if (batchId) {
      query += ` AND e.batch_id = $2`;
      values.push(batchId);
    }

    query += ' GROUP BY e.id, b.name, c.name ORDER BY b.name ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get low attendance students
   * @param {number} batchId - Batch ID
   * @param {number} threshold - Attendance percentage threshold
   * @returns {Promise<Array>} List of students with low attendance
   */
  async getLowAttendanceStudents(batchId, threshold = 75) {
    const query = `
      SELECT
        s.id as student_id,
        s.name as student_name,
        s.enrollment_number,
        s.phone as student_phone,
        e.id as enrollment_id,
        COUNT(a.id) as total_days,
        COUNT(a.id) FILTER (WHERE a.status = 'PRESENT') as present_days,
        ROUND((COUNT(a.id) FILTER (WHERE a.status = 'PRESENT')::NUMERIC / NULLIF(COUNT(a.id), 0) * 100), 2) as attendance_percentage
      FROM enrollments e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN attendance a ON e.id = a.enrollment_id
      WHERE e.batch_id = $1 AND e.enrollment_status = 'ACTIVE'
      GROUP BY s.id, s.name, s.enrollment_number, s.phone, e.id
      HAVING ROUND((COUNT(a.id) FILTER (WHERE a.status = 'PRESENT')::NUMERIC / NULLIF(COUNT(a.id), 0) * 100), 2) < $2
      ORDER BY attendance_percentage ASC
    `;
    const result = await pool.query(query, [batchId, threshold]);
    return result.rows;
  }
}

export default new AttendanceRepository();
