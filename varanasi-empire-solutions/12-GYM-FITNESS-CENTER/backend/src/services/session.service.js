import sessionRepository from '../repositories/session.repository.js';
import trainerRepository from '../repositories/trainer.repository.js';
import memberRepository from '../repositories/member.repository.js';
import { ValidationError, ConflictError } from '../utils/errors.js';

/**
 * Personal Training Session Service
 * Business logic for session scheduling and management
 */
class SessionService {
  /**
   * Create a new training session
   * @param {Object} sessionData - Session data
   * @returns {Promise<Object>} Created session
   */
  async createSession(sessionData) {
    const { member_id, trainer_id, session_date, start_time, end_time, session_fee, session_type } = sessionData;

    // Validate required fields
    if (!member_id || !trainer_id || !session_date || !start_time || !end_time) {
      throw new ValidationError(['member_id, trainer_id, session_date, start_time, and end_time are required']);
    }

    // Verify member exists
    await memberRepository.findById(member_id);

    // Verify trainer exists
    const trainer = await trainerRepository.findById(trainer_id);

    // Check trainer availability (no conflicts)
    const isAvailable = await trainerRepository.checkAvailability(
      trainer_id,
      session_date,
      start_time,
      end_time
    );

    if (!isAvailable) {
      throw new ConflictError('Trainer is not available at this time. Please choose a different time slot.');
    }

    // Validate session fee
    const finalFee = session_fee || trainer.hourly_rate || 0;
    if (finalFee < 0) {
      throw new ValidationError(['Session fee cannot be negative']);
    }

    // Validate time logic
    if (start_time >= end_time) {
      throw new ValidationError(['End time must be after start time']);
    }

    return await sessionRepository.create({
      ...sessionData,
      session_fee: finalFee,
      status: 'SCHEDULED'
    });
  }

  /**
   * Get all sessions
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Sessions and metadata
   */
  async getAllSessions(filters = {}) {
    const sessions = await sessionRepository.findAll(filters);
    const total = await sessionRepository.count(filters);

    return {
      sessions,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50
    };
  }

  /**
   * Get session by ID
   * @param {number} id - Session ID
   * @returns {Promise<Object>} Session data
   */
  async getSessionById(id) {
    return await sessionRepository.findById(id);
  }

  /**
   * Update session
   * @param {number} id - Session ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated session
   */
  async updateSession(id, updateData) {
    const session = await sessionRepository.findById(id);

    // If updating trainer or time, check availability
    if (updateData.trainer_id || updateData.session_date || updateData.start_time || updateData.end_time) {
      const trainerId = updateData.trainer_id || session.trainer_id;
      const sessionDate = updateData.session_date || session.session_date;
      const startTime = updateData.start_time || session.start_time;
      const endTime = updateData.end_time || session.end_time;

      // Validate time logic
      if (startTime >= endTime) {
        throw new ValidationError(['End time must be after start time']);
      }

      const isAvailable = await trainerRepository.checkAvailability(
        trainerId,
        sessionDate,
        startTime,
        endTime,
        id // Exclude current session
      );

      if (!isAvailable) {
        throw new ConflictError('Trainer is not available at this time. Please choose a different time slot.');
      }
    }

    return await sessionRepository.update(id, updateData);
  }

  /**
   * Complete session
   * @param {number} id - Session ID
   * @param {string} feedback - Session feedback
   * @returns {Promise<Object>} Completed session
   */
  async completeSession(id, feedback) {
    const session = await sessionRepository.findById(id);

    if (session.status !== 'SCHEDULED') {
      throw new ValidationError([`Cannot complete session with status: ${session.status}`]);
    }

    return await sessionRepository.complete(id, feedback);
  }

  /**
   * Cancel session
   * @param {number} id - Session ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancelled session
   */
  async cancelSession(id, reason) {
    if (!reason) {
      throw new ValidationError(['Cancellation reason is required']);
    }

    const session = await sessionRepository.findById(id);

    if (session.status !== 'SCHEDULED') {
      throw new ValidationError([`Cannot cancel session with status: ${session.status}`]);
    }

    return await sessionRepository.cancel(id, reason);
  }

  /**
   * Mark session as no-show
   * @param {number} id - Session ID
   * @returns {Promise<Object>} Updated session
   */
  async markNoShow(id) {
    const session = await sessionRepository.findById(id);

    if (session.status !== 'SCHEDULED') {
      throw new ValidationError([`Cannot mark no-show for session with status: ${session.status}`]);
    }

    return await sessionRepository.updateStatus(id, 'NO_SHOW');
  }

  /**
   * Get upcoming sessions for member
   * @param {number} memberId - Member ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Upcoming sessions
   */
  async getUpcomingSessionsByMember(memberId, limit = 10) {
    return await sessionRepository.findUpcomingByMember(memberId, limit);
  }

  /**
   * Get upcoming sessions for trainer
   * @param {number} trainerId - Trainer ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Upcoming sessions
   */
  async getUpcomingSessionsByTrainer(trainerId, limit = 20) {
    return await sessionRepository.findUpcomingByTrainer(trainerId, limit);
  }

  /**
   * Get sessions by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>} Sessions
   */
  async getSessionsByDateRange(startDate, endDate, filters = {}) {
    return await sessionRepository.findByDateRange(startDate, endDate, filters);
  }

  /**
   * Get session statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Session statistics
   */
  async getSessionStatistics(filters = {}) {
    return await sessionRepository.getStatistics(filters);
  }

  /**
   * Check for scheduling conflicts
   * @param {number} trainerId - Trainer ID
   * @param {Date} sessionDate - Session date
   * @param {string} startTime - Start time
   * @param {string} endTime - End time
   * @param {number} excludeSessionId - Session ID to exclude
   * @returns {Promise<boolean>} Has conflicts
   */
  async checkConflict(trainerId, sessionDate, startTime, endTime, excludeSessionId = null) {
    return await sessionRepository.hasConflict(trainerId, sessionDate, startTime, endTime, excludeSessionId);
  }
}

export default new SessionService();
