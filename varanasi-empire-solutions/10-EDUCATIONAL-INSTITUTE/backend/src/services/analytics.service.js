import analyticsRepository from '../repositories/analytics.repository.js';
import instituteRepository from '../repositories/institute.repository.js';
import batchRepository from '../repositories/batch.repository.js';
import { NotFoundError, ValidationError } from '../errors.js';

/**
 * Analytics Service
 * Contains business logic for analytics and reporting
 */
class AnalyticsService {
  /**
   * Get dashboard statistics
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(instituteId) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    const stats = await analyticsRepository.getDashboardStats(instituteId);

    // Calculate additional metrics
    const collectionRate = stats.total_revenue > 0
      ? (parseFloat(stats.revenue_collected) / parseFloat(stats.total_revenue) * 100).toFixed(2)
      : 0;

    return {
      institute_id: instituteId,
      institute_name: institute.name,
      ...stats,
      collection_rate: parseFloat(collectionRate),
      generated_at: new Date().toISOString()
    };
  }

  /**
   * Get batch performance report
   * @param {number} batchId - Batch ID
   * @returns {Promise<Object>} Batch performance
   */
  async getBatchPerformance(batchId) {
    const batch = await batchRepository.findById(batchId);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    const performance = await analyticsRepository.getBatchPerformance(batchId);

    // Calculate additional metrics
    const feeCollectionRate = performance.total_fee > 0
      ? (parseFloat(performance.fee_collected) / parseFloat(performance.total_fee) * 100).toFixed(2)
      : 0;

    const occupancyRate = performance.max_students > 0
      ? (performance.enrolled_students / performance.max_students * 100).toFixed(2)
      : 0;

    return {
      ...performance,
      fee_collection_rate: parseFloat(feeCollectionRate),
      occupancy_rate: parseFloat(occupancyRate),
      generated_at: new Date().toISOString()
    };
  }

  /**
   * Get revenue report
   * @param {number} instituteId - Institute ID
   * @param {Object} filters - Filter criteria (date_from, date_to)
   * @returns {Promise<Object>} Revenue report
   */
  async getRevenueReport(instituteId, filters = {}) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    // Validate date filters
    if (filters.date_from && filters.date_to) {
      if (new Date(filters.date_from) > new Date(filters.date_to)) {
        throw new ValidationError('Start date must be before end date');
      }
    }

    const report = await analyticsRepository.getRevenueReport(instituteId, filters);

    // Calculate collection rate
    const collectionRate = parseFloat(report.total_expected_revenue) > 0
      ? (parseFloat(report.total_collected) / parseFloat(report.total_expected_revenue) * 100).toFixed(2)
      : 0;

    return {
      institute_id: instituteId,
      institute_name: institute.name,
      period: {
        from: filters.date_from || 'inception',
        to: filters.date_to || 'current'
      },
      ...report,
      collection_rate: parseFloat(collectionRate),
      generated_at: new Date().toISOString()
    };
  }

  /**
   * Get monthly revenue trend
   * @param {number} instituteId - Institute ID
   * @param {number} months - Number of months (default: 6)
   * @returns {Promise<Array>} Monthly revenue trend
   */
  async getMonthlyRevenueTrend(instituteId, months = 6) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    if (months <= 0 || months > 24) {
      throw new ValidationError('Months must be between 1 and 24');
    }

    return await analyticsRepository.getMonthlyRevenueTrend(instituteId, months);
  }

  /**
   * Get course-wise enrollment statistics
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Array>} Course-wise statistics
   */
  async getCourseWiseEnrollments(instituteId) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    const stats = await analyticsRepository.getCourseWiseEnrollments(instituteId);

    // Add collection rates
    return stats.map(course => ({
      ...course,
      collection_rate: parseFloat(course.total_revenue) > 0
        ? parseFloat((parseFloat(course.collected_revenue) / parseFloat(course.total_revenue) * 100).toFixed(2))
        : 0
    }));
  }

  /**
   * Get faculty performance
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Array>} Faculty performance
   */
  async getFacultyPerformance(instituteId) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    const performance = await analyticsRepository.getFacultyPerformance(instituteId);

    // Round percentages
    return performance.map(faculty => ({
      ...faculty,
      avg_student_performance: parseFloat(parseFloat(faculty.avg_student_performance).toFixed(2)),
      avg_attendance_percentage: parseFloat(parseFloat(faculty.avg_attendance_percentage).toFixed(2))
    }));
  }

  /**
   * Get attendance trends
   * @param {number} batchId - Batch ID
   * @param {number} days - Number of days (default: 30)
   * @returns {Promise<Array>} Attendance trends
   */
  async getAttendanceTrends(batchId, days = 30) {
    const batch = await batchRepository.findById(batchId);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    if (days <= 0 || days > 365) {
      throw new ValidationError('Days must be between 1 and 365');
    }

    return await analyticsRepository.getAttendanceTrends(batchId, days);
  }

  /**
   * Get test performance trends
   * @param {number} batchId - Batch ID
   * @returns {Promise<Array>} Test performance trends
   */
  async getTestPerformanceTrends(batchId) {
    const batch = await batchRepository.findById(batchId);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    const trends = await analyticsRepository.getTestPerformanceTrends(batchId);

    // Add pass percentage
    return trends.map(test => ({
      ...test,
      pass_percentage: test.students_appeared > 0
        ? parseFloat((test.passed_count / test.students_appeared * 100).toFixed(2))
        : 0
    }));
  }

  /**
   * Get top performing students
   * @param {number} instituteId - Institute ID
   * @param {number} limit - Number of students (default: 10)
   * @returns {Promise<Array>} Top performing students
   */
  async getTopPerformingStudents(instituteId, limit = 10) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    if (limit <= 0 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    const students = await analyticsRepository.getTopPerformingStudents(instituteId, limit);

    // Round percentages
    return students.map((student, index) => ({
      rank: index + 1,
      ...student,
      avg_test_percentage: parseFloat(parseFloat(student.avg_test_percentage).toFixed(2)),
      avg_attendance_percentage: parseFloat(parseFloat(student.avg_attendance_percentage).toFixed(2))
    }));
  }

  /**
   * Generate comprehensive institute report
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Object>} Comprehensive report
   */
  async generateInstituteReport(instituteId) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    const [
      dashboardStats,
      revenueReport,
      courseStats,
      facultyPerformance,
      topStudents
    ] = await Promise.all([
      this.getDashboardStats(instituteId),
      this.getRevenueReport(instituteId),
      this.getCourseWiseEnrollments(instituteId),
      this.getFacultyPerformance(instituteId),
      this.getTopPerformingStudents(instituteId, 5)
    ]);

    return {
      institute: {
        id: institute.id,
        name: institute.name,
        registration_number: institute.registration_number,
        city: institute.city,
        state: institute.state
      },
      summary: dashboardStats,
      revenue: revenueReport,
      courses: courseStats,
      faculty: facultyPerformance,
      top_performers: topStudents,
      generated_at: new Date().toISOString()
    };
  }
}

export default new AnalyticsService();
