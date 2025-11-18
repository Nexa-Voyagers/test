import attendanceRepository from '../repositories/attendance.repository.js';
import memberRepository from '../repositories/member.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Attendance Service
 * Business logic for attendance and check-in/check-out operations
 */
class AttendanceService {
  /**
   * Check-in member
   * @param {number} memberId - Member ID
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Attendance record
   */
  async checkIn(memberId, notes = null) {
    // Verify member exists and is active
    const member = await memberRepository.findById(memberId);

    if (!member.is_active) {
      throw new ValidationError(['Member is not active']);
    }

    return await attendanceRepository.checkIn(memberId, notes);
  }

  /**
   * Check-out member by attendance ID
   * @param {number} attendanceId - Attendance ID
   * @returns {Promise<Object>} Updated attendance record
   */
  async checkOut(attendanceId) {
    return await attendanceRepository.checkOut(attendanceId);
  }

  /**
   * Check-out member by member ID
   * @param {number} memberId - Member ID
   * @returns {Promise<Object>} Updated attendance record
   */
  async checkOutByMember(memberId) {
    return await attendanceRepository.checkOutByMember(memberId);
  }

  /**
   * Get open check-in for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Open check-in or null
   */
  async getOpenCheckIn(memberId) {
    return await attendanceRepository.findOpenCheckIn(memberId);
  }

  /**
   * Get all attendance records
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Attendance records and metadata
   */
  async getAllAttendance(filters = {}) {
    const attendance = await attendanceRepository.findAll(filters);
    const total = await attendanceRepository.count(filters);

    return {
      attendance,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 100)) + 1,
      limit: filters.limit || 100
    };
  }

  /**
   * Get attendance by ID
   * @param {number} id - Attendance ID
   * @returns {Promise<Object>} Attendance record
   */
  async getAttendanceById(id) {
    return await attendanceRepository.findById(id);
  }

  /**
   * Get attendance history for member
   * @param {number} memberId - Member ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Attendance history
   */
  async getMemberAttendanceHistory(memberId, limit = 50) {
    return await attendanceRepository.findByMember(memberId, limit);
  }

  /**
   * Get today's attendance for gym
   * @param {number} gymId - Gym ID
   * @returns {Promise<Array>} Today's attendance
   */
  async getTodayAttendance(gymId) {
    return await attendanceRepository.findTodayByGym(gymId);
  }

  /**
   * Get currently checked-in members for gym
   * @param {number} gymId - Gym ID
   * @returns {Promise<Array>} Currently checked-in members
   */
  async getCurrentlyCheckedIn(gymId) {
    return await attendanceRepository.findActiveByGym(gymId);
  }

  /**
   * Get attendance frequency for member
   * @param {number} memberId - Member ID
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Object>} Frequency statistics
   */
  async getAttendanceFrequency(memberId, days = 30) {
    return await attendanceRepository.getFrequency(memberId, days);
  }

  /**
   * Get attendance statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Attendance statistics
   */
  async getAttendanceStatistics(filters = {}) {
    return await attendanceRepository.getStatistics(filters);
  }

  /**
   * Get peak hours analysis
   * @param {number} gymId - Gym ID
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Array>} Peak hours data
   */
  async getPeakHours(gymId, days = 30) {
    return await attendanceRepository.getPeakHours(gymId, days);
  }

  /**
   * Get daily attendance trend
   * @param {number} gymId - Gym ID
   * @param {number} days - Number of days
   * @returns {Promise<Array>} Daily attendance data
   */
  async getDailyTrend(gymId, days = 30) {
    return await attendanceRepository.getDailyTrend(gymId, days);
  }

  /**
   * Update attendance notes
   * @param {number} id - Attendance ID
   * @param {string} notes - Notes
   * @returns {Promise<Object>} Updated attendance
   */
  async updateNotes(id, notes) {
    if (!notes) {
      throw new ValidationError(['Notes are required']);
    }

    return await attendanceRepository.updateNotes(id, notes);
  }
}

export default new AttendanceService();
