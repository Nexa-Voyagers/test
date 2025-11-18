import { pool } from '../config/database.js';

/**
 * Analytics Repository
 * Handles all analytics and reporting queries
 */
class AnalyticsRepository {
  /**
   * Get dashboard statistics
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(instituteId) {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM courses WHERE institute_id = $1) as total_courses,
        (SELECT COUNT(*) FROM batches WHERE institute_id = $1) as total_batches,
        (SELECT COUNT(*) FROM batches WHERE institute_id = $1 AND status = 'ONGOING') as active_batches,
        (SELECT COUNT(*) FROM faculty WHERE institute_id = $1 AND status = 'ACTIVE') as total_faculty,
        (SELECT COUNT(*) FROM students WHERE institute_id = $1) as total_students,
        (SELECT COUNT(*) FROM students WHERE institute_id = $1 AND status = 'ACTIVE') as active_students,
        (SELECT COUNT(*) FROM enrollments e LEFT JOIN batches b ON e.batch_id = b.id WHERE b.institute_id = $1) as total_enrollments,
        (SELECT COUNT(*) FROM enrollments e LEFT JOIN batches b ON e.batch_id = b.id WHERE b.institute_id = $1 AND e.enrollment_status = 'ACTIVE') as active_enrollments,
        (SELECT COALESCE(SUM(e.final_fee), 0) FROM enrollments e LEFT JOIN batches b ON e.batch_id = b.id WHERE b.institute_id = $1) as total_revenue,
        (SELECT COALESCE(SUM(e.fee_paid), 0) FROM enrollments e LEFT JOIN batches b ON e.batch_id = b.id WHERE b.institute_id = $1) as revenue_collected,
        (SELECT COALESCE(SUM(e.balance_fee), 0) FROM enrollments e LEFT JOIN batches b ON e.batch_id = b.id WHERE b.institute_id = $1) as revenue_pending,
        (SELECT COUNT(*) FROM enrollments e LEFT JOIN batches b ON e.batch_id = b.id WHERE b.institute_id = $1 AND e.balance_fee > 0) as fee_defaulters_count
    `;
    const result = await pool.query(query, [instituteId]);
    return result.rows[0];
  }

  /**
   * Get batch performance report
   * @param {number} batchId - Batch ID
   * @returns {Promise<Object>} Batch performance
   */
  async getBatchPerformance(batchId) {
    const query = `
      SELECT
        b.id,
        b.name as batch_name,
        b.batch_code,
        b.enrolled_students,
        b.max_students,
        c.name as course_name,
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT e.id) FILTER (WHERE e.enrollment_status = 'ACTIVE') as active_enrollments,
        COALESCE(SUM(e.final_fee), 0) as total_fee,
        COALESCE(SUM(e.fee_paid), 0) as fee_collected,
        COALESCE(SUM(e.balance_fee), 0) as fee_pending,
        COUNT(DISTINCT t.id) as total_tests,
        COALESCE(AVG(tr.percentage), 0) as avg_test_percentage,
        COALESCE(
          AVG(
            CASE
              WHEN a.attendance_count > 0
              THEN (a.present_count::FLOAT / a.attendance_count * 100)
              ELSE 0
            END
          ), 0
        ) as avg_attendance_percentage
      FROM batches b
      LEFT JOIN courses c ON b.course_id = c.id
      LEFT JOIN enrollments e ON b.id = e.batch_id
      LEFT JOIN tests t ON b.id = t.batch_id
      LEFT JOIN test_results tr ON e.id = tr.enrollment_id
      LEFT JOIN (
        SELECT enrollment_id,
               COUNT(*) as attendance_count,
               COUNT(*) FILTER (WHERE status = 'PRESENT') as present_count
        FROM attendance
        GROUP BY enrollment_id
      ) a ON e.id = a.enrollment_id
      WHERE b.id = $1
      GROUP BY b.id, b.name, b.batch_code, b.enrolled_students, b.max_students, c.name
    `;
    const result = await pool.query(query, [batchId]);
    return result.rows[0];
  }

  /**
   * Get revenue report
   * @param {number} instituteId - Institute ID
   * @param {Object} filters - Filter criteria (date_from, date_to)
   * @returns {Promise<Object>} Revenue report
   */
  async getRevenueReport(instituteId, filters = {}) {
    let query = `
      SELECT
        COUNT(DISTINCT e.id) as total_enrollments,
        COALESCE(SUM(e.final_fee), 0) as total_expected_revenue,
        COALESCE(SUM(e.fee_paid), 0) as total_collected,
        COALESCE(SUM(e.balance_fee), 0) as total_pending,
        COUNT(DISTINCT fp.id) as total_payments,
        COALESCE(AVG(e.final_fee), 0) as avg_enrollment_fee,
        COUNT(DISTINCT e.id) FILTER (WHERE e.payment_status = 'PAID') as fully_paid_count,
        COUNT(DISTINCT e.id) FILTER (WHERE e.payment_status = 'PARTIAL') as partially_paid_count,
        COUNT(DISTINCT e.id) FILTER (WHERE e.payment_status = 'PENDING') as unpaid_count
      FROM enrollments e
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN fee_payments fp ON e.id = fp.enrollment_id
      WHERE b.institute_id = $1
    `;
    const values = [instituteId];
    let paramCount = 2;

    if (filters.date_from) {
      query += ` AND e.enrollment_date >= $${paramCount}`;
      values.push(filters.date_from);
      paramCount++;
    }

    if (filters.date_to) {
      query += ` AND e.enrollment_date <= $${paramCount}`;
      values.push(filters.date_to);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get monthly revenue trend
   * @param {number} instituteId - Institute ID
   * @param {number} months - Number of months
   * @returns {Promise<Array>} Monthly revenue trend
   */
  async getMonthlyRevenueTrend(instituteId, months = 6) {
    const query = `
      SELECT
        TO_CHAR(fp.payment_date, 'YYYY-MM') as month,
        COUNT(*) as payment_count,
        COALESCE(SUM(fp.amount), 0) as total_collected,
        COUNT(DISTINCT fp.enrollment_id) as unique_students
      FROM fee_payments fp
      LEFT JOIN enrollments e ON fp.enrollment_id = e.id
      LEFT JOIN batches b ON e.batch_id = b.id
      WHERE b.institute_id = $1
        AND fp.payment_date >= CURRENT_DATE - INTERVAL '${months} months'
      GROUP BY TO_CHAR(fp.payment_date, 'YYYY-MM')
      ORDER BY month DESC
    `;
    const result = await pool.query(query, [instituteId]);
    return result.rows;
  }

  /**
   * Get course-wise enrollment statistics
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Array>} Course-wise statistics
   */
  async getCourseWiseEnrollments(instituteId) {
    const query = `
      SELECT
        c.id as course_id,
        c.name as course_name,
        c.code as course_code,
        c.category,
        COUNT(DISTINCT b.id) as total_batches,
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT e.id) FILTER (WHERE e.enrollment_status = 'ACTIVE') as active_enrollments,
        COALESCE(SUM(e.final_fee), 0) as total_revenue,
        COALESCE(SUM(e.fee_paid), 0) as collected_revenue,
        COALESCE(AVG(tr.percentage), 0) as avg_performance
      FROM courses c
      LEFT JOIN batches b ON c.id = b.course_id
      LEFT JOIN enrollments e ON b.id = e.batch_id
      LEFT JOIN test_results tr ON e.id = tr.enrollment_id
      WHERE c.institute_id = $1
      GROUP BY c.id, c.name, c.code, c.category
      ORDER BY total_enrollments DESC
    `;
    const result = await pool.query(query, [instituteId]);
    return result.rows;
  }

  /**
   * Get faculty performance
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Array>} Faculty performance
   */
  async getFacultyPerformance(instituteId) {
    const query = `
      SELECT
        f.id as faculty_id,
        f.name as faculty_name,
        f.employee_code,
        f.specialization,
        COUNT(DISTINCT b.id) as total_batches,
        COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'ONGOING') as active_batches,
        COUNT(DISTINCT e.student_id) as total_students,
        COALESCE(AVG(tr.percentage), 0) as avg_student_performance,
        COALESCE(
          AVG(
            CASE
              WHEN a.attendance_count > 0
              THEN (a.present_count::FLOAT / a.attendance_count * 100)
              ELSE 0
            END
          ), 0
        ) as avg_attendance_percentage
      FROM faculty f
      LEFT JOIN batches b ON f.id = b.faculty_id
      LEFT JOIN enrollments e ON b.id = e.batch_id AND e.enrollment_status = 'ACTIVE'
      LEFT JOIN test_results tr ON e.id = tr.enrollment_id
      LEFT JOIN (
        SELECT enrollment_id,
               COUNT(*) as attendance_count,
               COUNT(*) FILTER (WHERE status = 'PRESENT') as present_count
        FROM attendance
        GROUP BY enrollment_id
      ) a ON e.id = a.enrollment_id
      WHERE f.institute_id = $1 AND f.status = 'ACTIVE'
      GROUP BY f.id, f.name, f.employee_code, f.specialization
      ORDER BY total_students DESC
    `;
    const result = await pool.query(query, [instituteId]);
    return result.rows;
  }

  /**
   * Get attendance trends
   * @param {number} batchId - Batch ID
   * @param {number} days - Number of days
   * @returns {Promise<Array>} Attendance trends
   */
  async getAttendanceTrends(batchId, days = 30) {
    const query = `
      SELECT
        attendance_date,
        COUNT(*) as total_students,
        COUNT(*) FILTER (WHERE status = 'PRESENT') as present_count,
        COUNT(*) FILTER (WHERE status = 'ABSENT') as absent_count,
        COUNT(*) FILTER (WHERE status = 'LATE') as late_count,
        ROUND((COUNT(*) FILTER (WHERE status = 'PRESENT')::NUMERIC / COUNT(*) * 100), 2) as attendance_percentage
      FROM attendance a
      LEFT JOIN enrollments e ON a.enrollment_id = e.id
      WHERE e.batch_id = $1
        AND a.attendance_date >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY attendance_date
      ORDER BY attendance_date DESC
    `;
    const result = await pool.query(query, [batchId]);
    return result.rows;
  }

  /**
   * Get test performance trends
   * @param {number} batchId - Batch ID
   * @returns {Promise<Array>} Test performance trends
   */
  async getTestPerformanceTrends(batchId) {
    const query = `
      SELECT
        t.id as test_id,
        t.test_name,
        t.test_type,
        t.test_date,
        t.total_marks,
        COUNT(tr.id) as students_appeared,
        COALESCE(AVG(tr.marks_obtained), 0) as avg_marks,
        COALESCE(AVG(tr.percentage), 0) as avg_percentage,
        COUNT(tr.id) FILTER (WHERE tr.marks_obtained >= t.passing_marks) as passed_count,
        MAX(tr.marks_obtained) as highest_marks,
        MIN(tr.marks_obtained) as lowest_marks
      FROM tests t
      LEFT JOIN test_results tr ON t.id = tr.test_id
      WHERE t.batch_id = $1
      GROUP BY t.id, t.test_name, t.test_type, t.test_date, t.total_marks
      ORDER BY t.test_date DESC
    `;
    const result = await pool.query(query, [batchId]);
    return result.rows;
  }

  /**
   * Get top performing students
   * @param {number} instituteId - Institute ID
   * @param {number} limit - Number of students
   * @returns {Promise<Array>} Top performing students
   */
  async getTopPerformingStudents(instituteId, limit = 10) {
    const query = `
      SELECT
        s.id as student_id,
        s.name as student_name,
        s.enrollment_number,
        COUNT(DISTINCT e.id) as total_enrollments,
        COALESCE(AVG(tr.percentage), 0) as avg_test_percentage,
        COALESCE(
          AVG(
            CASE
              WHEN a.attendance_count > 0
              THEN (a.present_count::FLOAT / a.attendance_count * 100)
              ELSE 0
            END
          ), 0
        ) as avg_attendance_percentage,
        COUNT(DISTINCT tr.id) FILTER (WHERE tr.rank = 1) as first_ranks
      FROM students s
      LEFT JOIN enrollments e ON s.id = e.student_id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN test_results tr ON e.id = tr.enrollment_id
      LEFT JOIN (
        SELECT enrollment_id,
               COUNT(*) as attendance_count,
               COUNT(*) FILTER (WHERE status = 'PRESENT') as present_count
        FROM attendance
        GROUP BY enrollment_id
      ) a ON e.id = a.enrollment_id
      WHERE s.institute_id = $1 AND s.status = 'ACTIVE'
      GROUP BY s.id, s.name, s.enrollment_number
      HAVING COUNT(DISTINCT tr.id) > 0
      ORDER BY avg_test_percentage DESC, avg_attendance_percentage DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [instituteId, limit]);
    return result.rows;
  }
}

export default new AnalyticsRepository();
