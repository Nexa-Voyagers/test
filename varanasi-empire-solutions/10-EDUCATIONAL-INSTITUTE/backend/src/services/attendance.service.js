import attendanceRepository from '../repositories/attendance.repository.js';
import enrollmentRepository from '../repositories/enrollment.repository.js';
import batchRepository from '../repositories/batch.repository.js';
import { NotFoundError, ValidationError } from '../errors.js';

/**
 * Attendance Service
 * Contains business logic for attendance management
 */
class AttendanceService {
  /**
   * Mark attendance for a student
   * @param {Object} attendanceData - Attendance details
   * @returns {Promise<Object>} Created attendance record
   */
  async markAttendance(attendanceData) {
    const { enrollment_id, attendance_date, status } = attendanceData;

    // Verify enrollment exists
    const enrollment = await enrollmentRepository.findById(enrollment_id);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.enrollment_status !== 'ACTIVE') {
      throw new ValidationError('Cannot mark attendance for inactive enrollment');
    }

    // Check if attendance already marked for this date
    const existing = await attendanceRepository.findByEnrollmentAndDate(
      enrollment_id,
      attendance_date
    );
    if (existing) {
      throw new ValidationError('Attendance already marked for this date');
    }

    // Validate status
    const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    return await attendanceRepository.create(attendanceData);
  }

  /**
   * Mark bulk attendance for a batch
   * @param {number} batchId - Batch ID
   * @param {string} date - Attendance date
   * @param {Array} attendanceRecords - Array of {enrollment_id, status}
   * @param {string} markedBy - User marking attendance
   * @returns {Promise<Array>} Created attendance records
   */
  async markBulkAttendance(batchId, date, attendanceRecords, markedBy) {
    // Verify batch exists
    const batch = await batchRepository.findById(batchId);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    // Validate all enrollments belong to this batch
    const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE'];
    const records = [];

    for (const record of attendanceRecords) {
      const enrollment = await enrollmentRepository.findById(record.enrollment_id);
      if (!enrollment) {
        throw new NotFoundError(`Enrollment ${record.enrollment_id} not found`);
      }

      if (enrollment.batch_id !== batchId) {
        throw new ValidationError(`Enrollment ${record.enrollment_id} does not belong to this batch`);
      }

      if (enrollment.enrollment_status !== 'ACTIVE') {
        throw new ValidationError(`Enrollment ${record.enrollment_id} is not active`);
      }

      if (!validStatuses.includes(record.status)) {
        throw new ValidationError(`Invalid status for enrollment ${record.enrollment_id}`);
      }

      // Check if already marked
      const existing = await attendanceRepository.findByEnrollmentAndDate(
        record.enrollment_id,
        date
      );
      if (existing) {
        throw new ValidationError(`Attendance already marked for enrollment ${record.enrollment_id} on this date`);
      }

      records.push({
        enrollment_id: record.enrollment_id,
        attendance_date: date,
        status: record.status,
        marked_by: markedBy,
        remarks: record.remarks || null
      });
    }

    return await attendanceRepository.createBulk(records);
  }

  /**
   * Get attendance by ID
   * @param {number} id - Attendance ID
   * @returns {Promise<Object>} Attendance details
   */
  async getAttendanceById(id) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) {
      throw new NotFoundError('Attendance not found');
    }
    return attendance;
  }

  /**
   * Get all attendance records
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of attendance records
   */
  async getAllAttendance(filters = {}) {
    return await attendanceRepository.findAll(filters);
  }

  /**
   * Update attendance
   * @param {number} id - Attendance ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated attendance
   */
  async updateAttendance(id, updateData) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) {
      throw new NotFoundError('Attendance not found');
    }

    // Validate status if being updated
    if (updateData.status) {
      const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE'];
      if (!validStatuses.includes(updateData.status)) {
        throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
    }

    const updated = await attendanceRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update attendance');
    }

    return await attendanceRepository.findById(id);
  }

  /**
   * Delete attendance
   * @param {number} id - Attendance ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteAttendance(id) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) {
      throw new NotFoundError('Attendance not found');
    }

    return await attendanceRepository.delete(id);
  }

  /**
   * Get attendance percentage for an enrollment
   * @param {number} enrollmentId - Enrollment ID
   * @returns {Promise<Object>} Attendance percentage
   */
  async getAttendancePercentage(enrollmentId) {
    const enrollment = await enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    return await attendanceRepository.getAttendancePercentage(enrollmentId);
  }

  /**
   * Get batch attendance report for a specific date
   * @param {number} batchId - Batch ID
   * @param {string} date - Date
   * @returns {Promise<Object>} Attendance report
   */
  async getBatchAttendanceReport(batchId, date) {
    const batch = await batchRepository.findById(batchId);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    const report = await attendanceRepository.getBatchAttendanceReport(batchId, date);

    // Calculate summary
    const summary = {
      batch_id: batchId,
      batch_name: batch.name,
      date: date,
      total_students: report.length,
      present: report.filter(r => r.status === 'PRESENT').length,
      absent: report.filter(r => r.status === 'ABSENT').length,
      late: report.filter(r => r.status === 'LATE').length,
      on_leave: report.filter(r => r.status === 'ON_LEAVE').length,
      not_marked: report.filter(r => r.status === 'NOT_MARKED').length
    };

    return {
      summary,
      students: report
    };
  }

  /**
   * Get student attendance summary
   * @param {number} studentId - Student ID
   * @param {number} batchId - Batch ID (optional)
   * @returns {Promise<Array>} Attendance summary
   */
  async getStudentAttendanceSummary(studentId, batchId = null) {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    return await attendanceRepository.getStudentAttendanceSummary(studentId, batchId);
  }

  /**
   * Get low attendance students
   * @param {number} batchId - Batch ID
   * @param {number} threshold - Attendance percentage threshold (default: 75)
   * @returns {Promise<Array>} List of students with low attendance
   */
  async getLowAttendanceStudents(batchId, threshold = 75) {
    const batch = await batchRepository.findById(batchId);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    if (threshold < 0 || threshold > 100) {
      throw new ValidationError('Threshold must be between 0 and 100');
    }

    return await attendanceRepository.getLowAttendanceStudents(batchId, threshold);
  }
}

// Import studentRepository (forgot to import earlier)
import studentRepository from '../repositories/student.repository.js';

export default new AttendanceService();
