import workoutRepository from '../repositories/workout.repository.js';
import memberRepository from '../repositories/member.repository.js';
import trainerRepository from '../repositories/trainer.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Workout Plan Service
 * Business logic for workout plan operations with JSONB workout schedule validation
 */
class WorkoutService {
  /**
   * Create a new workout plan
   * @param {Object} workoutData - Workout plan data
   * @returns {Promise<Object>} Created workout plan
   */
  async createWorkoutPlan(workoutData) {
    const { member_id, plan_name, workout_schedule, difficulty_level } = workoutData;

    // Validate required fields
    if (!member_id || !plan_name || !workout_schedule) {
      throw new ValidationError(['member_id, plan_name, and workout_schedule are required']);
    }

    // Verify member exists
    await memberRepository.findById(member_id);

    // Verify trainer if provided
    if (workoutData.trainer_id) {
      await trainerRepository.findById(workoutData.trainer_id);
    }

    // Validate workout schedule structure
    const validation = workoutRepository.validateWorkoutSchedule(workout_schedule);
    if (!validation.valid) {
      throw new ValidationError(validation.errors);
    }

    // Validate difficulty level
    const validLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    if (difficulty_level && !validLevels.includes(difficulty_level)) {
      throw new ValidationError([`Difficulty level must be one of: ${validLevels.join(', ')}`]);
    }

    return await workoutRepository.create(workoutData);
  }

  /**
   * Get all workout plans
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Workout plans and metadata
   */
  async getAllWorkoutPlans(filters = {}) {
    const plans = await workoutRepository.findAll(filters);
    const total = await workoutRepository.count(filters);

    return {
      plans,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50
    };
  }

  /**
   * Get workout plan by ID
   * @param {number} id - Workout plan ID
   * @returns {Promise<Object>} Workout plan data
   */
  async getWorkoutPlanById(id) {
    return await workoutRepository.findById(id);
  }

  /**
   * Get active workout plan for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Active workout plan
   */
  async getActiveWorkoutPlan(memberId) {
    return await workoutRepository.findActiveByMember(memberId);
  }

  /**
   * Get workout plans by member
   * @param {number} memberId - Member ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Member's workout plans
   */
  async getWorkoutPlansByMember(memberId, limit = 20) {
    return await workoutRepository.findByMember(memberId, limit);
  }

  /**
   * Get workout plans by trainer
   * @param {number} trainerId - Trainer ID
   * @param {boolean} activeOnly - Filter active plans only
   * @returns {Promise<Array>} Trainer's workout plans
   */
  async getWorkoutPlansByTrainer(trainerId, activeOnly = false) {
    return await workoutRepository.findByTrainer(trainerId, activeOnly);
  }

  /**
   * Update workout plan
   * @param {number} id - Workout plan ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated workout plan
   */
  async updateWorkoutPlan(id, updateData) {
    // Validate workout schedule if provided
    if (updateData.workout_schedule) {
      const validation = workoutRepository.validateWorkoutSchedule(updateData.workout_schedule);
      if (!validation.valid) {
        throw new ValidationError(validation.errors);
      }
    }

    // Validate difficulty level if provided
    if (updateData.difficulty_level) {
      const validLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
      if (!validLevels.includes(updateData.difficulty_level)) {
        throw new ValidationError([`Difficulty level must be one of: ${validLevels.join(', ')}`]);
      }
    }

    // Verify trainer if provided
    if (updateData.trainer_id) {
      await trainerRepository.findById(updateData.trainer_id);
    }

    return await workoutRepository.update(id, updateData);
  }

  /**
   * Deactivate workout plan
   * @param {number} id - Workout plan ID
   * @returns {Promise<Object>} Deactivated workout plan
   */
  async deactivateWorkoutPlan(id) {
    return await workoutRepository.deactivate(id);
  }

  /**
   * Delete workout plan
   * @param {number} id - Workout plan ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteWorkoutPlan(id) {
    return await workoutRepository.delete(id);
  }

  /**
   * Get workout schedule for specific day
   * @param {number} id - Workout plan ID
   * @param {string} day - Day of week
   * @returns {Promise<Array>} Workouts for the day
   */
  async getWorkoutScheduleByDay(id, day) {
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDays.includes(day.toLowerCase())) {
      throw new ValidationError(['Invalid day. Must be one of: ' + validDays.join(', ')]);
    }

    return await workoutRepository.getWorkoutScheduleByDay(id, day);
  }

  /**
   * Get workout plans by difficulty level
   * @param {string} difficultyLevel - Difficulty level
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Array>} Workout plans
   */
  async getWorkoutPlansByDifficulty(difficultyLevel, gymId = null) {
    const validLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    if (!validLevels.includes(difficultyLevel)) {
      throw new ValidationError([`Difficulty level must be one of: ${validLevels.join(', ')}`]);
    }

    return await workoutRepository.findByDifficulty(difficultyLevel, gymId);
  }

  /**
   * Validate workout schedule structure
   * @param {Object} workoutSchedule - Workout schedule JSONB object
   * @returns {Object} Validation result
   */
  validateWorkoutSchedule(workoutSchedule) {
    return workoutRepository.validateWorkoutSchedule(workoutSchedule);
  }

  /**
   * Calculate exercise count in workout schedule
   * @param {Object} workoutSchedule - Workout schedule JSONB object
   * @returns {Object} Exercise count per day
   */
  calculateExerciseCount(workoutSchedule) {
    return workoutRepository.calculateExerciseCount(workoutSchedule);
  }

  /**
   * Get workout plan statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Statistics
   */
  async getWorkoutPlanStatistics(filters = {}) {
    return await workoutRepository.getStatistics(filters);
  }
}

export default new WorkoutService();
