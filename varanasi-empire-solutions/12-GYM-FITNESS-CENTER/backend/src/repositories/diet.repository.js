import { pool } from '../database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Diet Plan Repository
 * Handles database operations for diet plans with JSONB meal plans
 */
class DietRepository {
  /**
   * Create a new diet plan
   * @param {Object} dietData - Diet plan data
   * @returns {Promise<Object>} Created diet plan
   */
  async create(dietData) {
    const {
      member_id, trainer_id, plan_name, description, start_date, end_date,
      daily_calories, meal_plan, notes
    } = dietData;

    const query = `
      INSERT INTO diet_plans (
        member_id, trainer_id, plan_name, description, start_date, end_date,
        daily_calories, meal_plan, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      member_id, trainer_id, plan_name, description, start_date, end_date,
      daily_calories, JSON.stringify(meal_plan), notes
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all diet plans with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of diet plans
   */
  async findAll(filters = {}) {
    const { member_id, trainer_id, is_active, limit = 50, offset = 0 } = filters;

    let query = `
      SELECT
        dp.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name
      FROM diet_plans dp
      INNER JOIN members m ON m.member_id = dp.member_id
      LEFT JOIN trainers t ON t.trainer_id = dp.trainer_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (member_id) {
      query += ` AND dp.member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (trainer_id) {
      query += ` AND dp.trainer_id = $${paramCount}`;
      values.push(trainer_id);
      paramCount++;
    }

    if (is_active !== undefined) {
      query += ` AND dp.is_active = $${paramCount}`;
      values.push(is_active);
      paramCount++;
    }

    query += ` ORDER BY dp.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find diet plan by ID
   * @param {number} id - Diet plan ID
   * @returns {Promise<Object>} Diet plan data
   */
  async findById(id) {
    const query = `
      SELECT
        dp.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        m.email as member_email,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name,
        t.email as trainer_email
      FROM diet_plans dp
      INNER JOIN members m ON m.member_id = dp.member_id
      LEFT JOIN trainers t ON t.trainer_id = dp.trainer_id
      WHERE dp.diet_plan_id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Diet Plan');
    }

    return result.rows[0];
  }

  /**
   * Find active diet plan for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Active diet plan or null
   */
  async findActiveByMember(memberId) {
    const query = `
      SELECT
        dp.*,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name
      FROM diet_plans dp
      LEFT JOIN trainers t ON t.trainer_id = dp.trainer_id
      WHERE dp.member_id = $1
        AND dp.is_active = true
        AND (dp.end_date IS NULL OR dp.end_date >= CURRENT_DATE)
      ORDER BY dp.start_date DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [memberId]);
    return result.rows[0] || null;
  }

  /**
   * Find diet plans by member
   * @param {number} memberId - Member ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Member's diet plans
   */
  async findByMember(memberId, limit = 20) {
    const query = `
      SELECT
        dp.*,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name
      FROM diet_plans dp
      LEFT JOIN trainers t ON t.trainer_id = dp.trainer_id
      WHERE dp.member_id = $1
      ORDER BY dp.start_date DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [memberId, limit]);
    return result.rows;
  }

  /**
   * Find diet plans by trainer
   * @param {number} trainerId - Trainer ID
   * @param {boolean} activeOnly - Filter active plans only
   * @returns {Promise<Array>} Trainer's diet plans
   */
  async findByTrainer(trainerId, activeOnly = false) {
    let query = `
      SELECT
        dp.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        m.phone as member_phone
      FROM diet_plans dp
      INNER JOIN members m ON m.member_id = dp.member_id
      WHERE dp.trainer_id = $1
    `;

    if (activeOnly) {
      query += ' AND dp.is_active = true';
    }

    query += ' ORDER BY dp.start_date DESC';

    const result = await pool.query(query, [trainerId]);
    return result.rows;
  }

  /**
   * Update diet plan
   * @param {number} id - Diet plan ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated diet plan
   */
  async update(id, updateData) {
    await this.findById(id); // Check if exists

    const allowedFields = [
      'trainer_id', 'plan_name', 'description', 'start_date', 'end_date',
      'daily_calories', 'meal_plan', 'notes', 'is_active'
    ];
    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        if (key === 'meal_plan') {
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
      UPDATE diet_plans
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE diet_plan_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Deactivate diet plan
   * @param {number} id - Diet plan ID
   * @returns {Promise<Object>} Deactivated diet plan
   */
  async deactivate(id) {
    const query = `
      UPDATE diet_plans
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE diet_plan_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Diet Plan');
    }

    return result.rows[0];
  }

  /**
   * Delete diet plan
   * @param {number} id - Diet plan ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    await this.findById(id); // Check if exists

    const query = 'DELETE FROM diet_plans WHERE diet_plan_id = $1';
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Get meal plan for specific day
   * @param {number} id - Diet plan ID
   * @param {string} day - Day of week (monday, tuesday, etc.)
   * @returns {Promise<Array>} Meals for the day
   */
  async getMealPlanByDay(id, day) {
    const dietPlan = await this.findById(id);

    if (!dietPlan.meal_plan || !dietPlan.meal_plan[day.toLowerCase()]) {
      return [];
    }

    return dietPlan.meal_plan[day.toLowerCase()];
  }

  /**
   * Calculate total calories from meal plan
   * @param {Object} mealPlan - Meal plan JSONB object
   * @returns {number} Total weekly calories
   */
  calculateTotalCalories(mealPlan) {
    let total = 0;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(day => {
      if (mealPlan[day] && Array.isArray(mealPlan[day])) {
        mealPlan[day].forEach(meal => {
          if (meal.calories) {
            total += meal.calories;
          }
        });
      }
    });

    return total;
  }

  /**
   * Validate meal plan structure
   * @param {Object} mealPlan - Meal plan JSONB object
   * @returns {Object} Validation result
   */
  validateMealPlan(mealPlan) {
    const errors = [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    if (!mealPlan || typeof mealPlan !== 'object') {
      return { valid: false, errors: ['Meal plan must be an object'] };
    }

    days.forEach(day => {
      if (mealPlan[day]) {
        if (!Array.isArray(mealPlan[day])) {
          errors.push(`${day} must be an array`);
        } else {
          mealPlan[day].forEach((meal, index) => {
            if (!meal.meal) errors.push(`${day}[${index}]: meal name is required`);
            if (!meal.time) errors.push(`${day}[${index}]: time is required`);
            if (!meal.items || !Array.isArray(meal.items)) {
              errors.push(`${day}[${index}]: items must be an array`);
            }
            if (typeof meal.calories !== 'number') {
              errors.push(`${day}[${index}]: calories must be a number`);
            }
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
   * Get diet plan statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics(filters = {}) {
    const { trainer_id, gym_id } = filters;

    let query = `
      SELECT
        COUNT(*) as total_plans,
        COUNT(CASE WHEN dp.is_active = true THEN 1 END) as active_plans,
        COUNT(DISTINCT dp.member_id) as unique_members,
        ROUND(AVG(dp.daily_calories)::numeric, 0) as avg_daily_calories
      FROM diet_plans dp
      INNER JOIN members m ON m.member_id = dp.member_id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (trainer_id) {
      query += ` AND dp.trainer_id = $${paramCount}`;
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
   * Count diet plans
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    const { member_id, trainer_id, is_active } = filters;

    let query = 'SELECT COUNT(*) FROM diet_plans WHERE 1=1';
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

    if (is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      values.push(is_active);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }
}

export default new DietRepository();
