import { pool } from '../database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Workout Plan Repository
 * Handles database operations for workout plans with JSONB workout schedules
 */
class WorkoutRepository {
  /**
   * Create a new workout plan
   * @param {Object} workoutData - Workout plan data
   * @returns {Promise<Object>} Created workout plan
   */
  async create(workoutData) {
    const {
      member_id, trainer_id, plan_name, description, start_date, end_date,
      difficulty_level, workout_schedule, notes
    } = workoutData;

    const query = `
      INSERT INTO workout_plans (
        member_id, trainer_id, plan_name, description, start_date, end_date,
        difficulty_level, workout_schedule, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      member_id, trainer_id, plan_name, description, start_date, end_date,
      difficulty_level, JSON.stringify(workout_schedule), notes
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all workout plans with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of workout plans
   */
  async findAll(filters = {}) {
    const { member_id, trainer_id, difficulty_level, is_active, limit = 50, offset = 0 } = filters;

    let query = `
      SELECT
        wp.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name
      FROM workout_plans wp
      INNER JOIN members m ON m.member_id = wp.member_id
      LEFT JOIN trainers t ON t.trainer_id = wp.trainer_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (member_id) {
      query += ` AND wp.member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (trainer_id) {
      query += ` AND wp.trainer_id = $${paramCount}`;
      values.push(trainer_id);
      paramCount++;
    }

    if (difficulty_level) {
      query += ` AND wp.difficulty_level = $${paramCount}`;
      values.push(difficulty_level);
      paramCount++;
    }

    if (is_active !== undefined) {
      query += ` AND wp.is_active = $${paramCount}`;
      values.push(is_active);
      paramCount++;
    }

    query += ` ORDER BY wp.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find workout plan by ID
   * @param {number} id - Workout plan ID
   * @returns {Promise<Object>} Workout plan data
   */
  async findById(id) {
    const query = `
      SELECT
        wp.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        m.email as member_email,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name,
        t.email as trainer_email
      FROM workout_plans wp
      INNER JOIN members m ON m.member_id = wp.member_id
      LEFT JOIN trainers t ON t.trainer_id = wp.trainer_id
      WHERE wp.workout_plan_id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Workout Plan');
    }

    return result.rows[0];
  }

  /**
   * Find active workout plan for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Active workout plan or null
   */
  async findActiveByMember(memberId) {
    const query = `
      SELECT
        wp.*,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name
      FROM workout_plans wp
      LEFT JOIN trainers t ON t.trainer_id = wp.trainer_id
      WHERE wp.member_id = $1
        AND wp.is_active = true
        AND (wp.end_date IS NULL OR wp.end_date >= CURRENT_DATE)
      ORDER BY wp.start_date DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [memberId]);
    return result.rows[0] || null;
  }

  /**
   * Find workout plans by member
   * @param {number} memberId - Member ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Member's workout plans
   */
  async findByMember(memberId, limit = 20) {
    const query = `
      SELECT
        wp.*,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name
      FROM workout_plans wp
      LEFT JOIN trainers t ON t.trainer_id = wp.trainer_id
      WHERE wp.member_id = $1
      ORDER BY wp.start_date DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [memberId, limit]);
    return result.rows;
  }

  /**
   * Find workout plans by trainer
   * @param {number} trainerId - Trainer ID
   * @param {boolean} activeOnly - Filter active plans only
   * @returns {Promise<Array>} Trainer's workout plans
   */
  async findByTrainer(trainerId, activeOnly = false) {
    let query = `
      SELECT
        wp.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        m.phone as member_phone
      FROM workout_plans wp
      INNER JOIN members m ON m.member_id = wp.member_id
      WHERE wp.trainer_id = $1
    `;

    if (activeOnly) {
      query += ' AND wp.is_active = true';
    }

    query += ' ORDER BY wp.start_date DESC';

    const result = await pool.query(query, [trainerId]);
    return result.rows;
  }

  /**
   * Update workout plan
   * @param {number} id - Workout plan ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated workout plan
   */
  async update(id, updateData) {
    await this.findById(id); // Check if exists

    const allowedFields = [
      'trainer_id', 'plan_name', 'description', 'start_date', 'end_date',
      'difficulty_level', 'workout_schedule', 'notes', 'is_active'
    ];
    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        if (key === 'workout_schedule') {
          updates.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(updateData[key]));
        } else {
          updates.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
        }
        paramCount++;
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE workout_plans
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE workout_plan_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Deactivate workout plan
   * @param {number} id - Workout plan ID
   * @returns {Promise<Object>} Deactivated workout plan
   */
  async deactivate(id) {
    const query = `
      UPDATE workout_plans
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE workout_plan_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Workout Plan');
    }

    return result.rows[0];
  }

  /**
   * Delete workout plan
   * @param {number} id - Workout plan ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    await this.findById(id); // Check if exists

    const query = 'DELETE FROM workout_plans WHERE workout_plan_id = $1';
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Get workout schedule for specific day
   * @param {number} id - Workout plan ID
   * @param {string} day - Day of week (monday, tuesday, etc.)
   * @returns {Promise<Array>} Workouts for the day
   */
  async getWorkoutScheduleByDay(id, day) {
    const workoutPlan = await this.findById(id);

    if (!workoutPlan.workout_schedule || !workoutPlan.workout_schedule[day.toLowerCase()]) {
      return [];
    }

    return workoutPlan.workout_schedule[day.toLowerCase()];
  }

  /**
   * Get workout plans by difficulty level
   * @param {string} difficultyLevel - Difficulty level
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Array>} Workout plans
   */
  async findByDifficulty(difficultyLevel, gymId = null) {
    let query = `
      SELECT
        wp.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name
      FROM workout_plans wp
      INNER JOIN members m ON m.member_id = wp.member_id
      WHERE wp.difficulty_level = $1 AND wp.is_active = true
    `;

    const values = [difficultyLevel];

    if (gymId) {
      query += ' AND m.gym_id = $2';
      values.push(gymId);
    }

    query += ' ORDER BY wp.start_date DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Validate workout schedule structure
   * @param {Object} workoutSchedule - Workout schedule JSONB object
   * @returns {Object} Validation result
   */
  validateWorkoutSchedule(workoutSchedule) {
    const errors = [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    if (!workoutSchedule || typeof workoutSchedule !== 'object') {
      return { valid: false, errors: ['Workout schedule must be an object'] };
    }

    days.forEach(day => {
      if (workoutSchedule[day]) {
        if (!Array.isArray(workoutSchedule[day])) {
          errors.push(`${day} must be an array`);
        } else {
          workoutSchedule[day].forEach((exercise, index) => {
            if (!exercise.exercise) errors.push(`${day}[${index}]: exercise name is required`);
            if (typeof exercise.sets !== 'number') errors.push(`${day}[${index}]: sets must be a number`);
            if (typeof exercise.reps !== 'number' && !exercise.reps) {
              errors.push(`${day}[${index}]: reps is required`);
            }
            if (!exercise.rest) errors.push(`${day}[${index}]: rest period is required`);
          });
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate total exercises in workout schedule
   * @param {Object} workoutSchedule - Workout schedule JSONB object
   * @returns {Object} Exercise count per day
   */
  calculateExerciseCount(workoutSchedule) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const counts = {};
    let totalExercises = 0;

    days.forEach(day => {
      if (workoutSchedule[day] && Array.isArray(workoutSchedule[day])) {
        counts[day] = workoutSchedule[day].length;
        totalExercises += workoutSchedule[day].length;
      } else {
        counts[day] = 0;
      }
    });

    counts.total = totalExercises;
    return counts;
  }

  /**
   * Get workout plan statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics(filters = {}) {
    const { trainer_id, gym_id } = filters;

    let query = `
      SELECT
        COUNT(*) as total_plans,
        COUNT(CASE WHEN wp.is_active = true THEN 1 END) as active_plans,
        COUNT(DISTINCT wp.member_id) as unique_members,
        COUNT(CASE WHEN wp.difficulty_level = 'BEGINNER' THEN 1 END) as beginner_plans,
        COUNT(CASE WHEN wp.difficulty_level = 'INTERMEDIATE' THEN 1 END) as intermediate_plans,
        COUNT(CASE WHEN wp.difficulty_level = 'ADVANCED' THEN 1 END) as advanced_plans
      FROM workout_plans wp
      INNER JOIN members m ON m.member_id = wp.member_id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (trainer_id) {
      query += ` AND wp.trainer_id = $${paramCount}`;
      values.push(trainer_id);
      paramCount++;
    }

    if (gym_id) {
      query += ` AND m.gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Count workout plans
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    const { member_id, trainer_id, difficulty_level, is_active } = filters;

    let query = 'SELECT COUNT(*) FROM workout_plans WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (member_id) {
      query += ` AND member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (trainer_id) {
      query += ` AND trainer_id = $${paramCount}`;
      values.push(trainer_id);
      paramCount++;
    }

    if (difficulty_level) {
      query += ` AND difficulty_level = $${paramCount}`;
      values.push(difficulty_level);
      paramCount++;
    }

    if (is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      values.push(is_active);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }
}

export default new WorkoutRepository();
