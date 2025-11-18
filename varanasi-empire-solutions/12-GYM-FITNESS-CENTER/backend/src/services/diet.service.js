import dietRepository from '../repositories/diet.repository.js';
import memberRepository from '../repositories/member.repository.js';
import trainerRepository from '../repositories/trainer.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Diet Plan Service
 * Business logic for diet plan operations with JSONB meal plan validation
 */
class DietService {
  /**
   * Create a new diet plan
   * @param {Object} dietData - Diet plan data
   * @returns {Promise<Object>} Created diet plan
   */
  async createDietPlan(dietData) {
    const { member_id, plan_name, meal_plan, daily_calories } = dietData;

    // Validate required fields
    if (!member_id || !plan_name || !meal_plan) {
      throw new ValidationError(['member_id, plan_name, and meal_plan are required']);
    }

    // Verify member exists
    await memberRepository.findById(member_id);

    // Verify trainer if provided
    if (dietData.trainer_id) {
      await trainerRepository.findById(dietData.trainer_id);
    }

    // Validate meal plan structure
    const validation = dietRepository.validateMealPlan(meal_plan);
    if (!validation.valid) {
      throw new ValidationError(validation.errors);
    }

    // Validate daily calories
    if (daily_calories !== undefined && (daily_calories < 0 || daily_calories > 10000)) {
      throw new ValidationError(['Daily calories must be between 0 and 10000']);
    }

    return await dietRepository.create(dietData);
  }

  /**
   * Get all diet plans
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Diet plans and metadata
   */
  async getAllDietPlans(filters = {}) {
    const plans = await dietRepository.findAll(filters);
    const total = await dietRepository.count(filters);

    return {
      plans,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50
    };
  }

  /**
   * Get diet plan by ID
   * @param {number} id - Diet plan ID
   * @returns {Promise<Object>} Diet plan data
   */
  async getDietPlanById(id) {
    return await dietRepository.findById(id);
  }

  /**
   * Get active diet plan for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Active diet plan
   */
  async getActiveDietPlan(memberId) {
    return await dietRepository.findActiveByMember(memberId);
  }

  /**
   * Get diet plans by member
   * @param {number} memberId - Member ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Member's diet plans
   */
  async getDietPlansByMember(memberId, limit = 20) {
    return await dietRepository.findByMember(memberId, limit);
  }

  /**
   * Get diet plans by trainer
   * @param {number} trainerId - Trainer ID
   * @param {boolean} activeOnly - Filter active plans only
   * @returns {Promise<Array>} Trainer's diet plans
   */
  async getDietPlansByTrainer(trainerId, activeOnly = false) {
    return await dietRepository.findByTrainer(trainerId, activeOnly);
  }

  /**
   * Update diet plan
   * @param {number} id - Diet plan ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated diet plan
   */
  async updateDietPlan(id, updateData) {
    // Validate meal plan if provided
    if (updateData.meal_plan) {
      const validation = dietRepository.validateMealPlan(updateData.meal_plan);
      if (!validation.valid) {
        throw new ValidationError(validation.errors);
      }
    }

    // Validate daily calories if provided
    if (updateData.daily_calories !== undefined) {
      if (updateData.daily_calories < 0 || updateData.daily_calories > 10000) {
        throw new ValidationError(['Daily calories must be between 0 and 10000']);
      }
    }

    // Verify trainer if provided
    if (updateData.trainer_id) {
      await trainerRepository.findById(updateData.trainer_id);
    }

    return await dietRepository.update(id, updateData);
  }

  /**
   * Deactivate diet plan
   * @param {number} id - Diet plan ID
   * @returns {Promise<Object>} Deactivated diet plan
   */
  async deactivateDietPlan(id) {
    return await dietRepository.deactivate(id);
  }

  /**
   * Delete diet plan
   * @param {number} id - Diet plan ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteDietPlan(id) {
    return await dietRepository.delete(id);
  }

  /**
   * Get meal plan for specific day
   * @param {number} id - Diet plan ID
   * @param {string} day - Day of week
   * @returns {Promise<Array>} Meals for the day
   */
  async getMealPlanByDay(id, day) {
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDays.includes(day.toLowerCase())) {
      throw new ValidationError(['Invalid day. Must be one of: ' + validDays.join(', ')]);
    }

    return await dietRepository.getMealPlanByDay(id, day);
  }

  /**
   * Calculate total calories from meal plan
   * @param {Object} mealPlan - Meal plan JSONB object
   * @returns {number} Total weekly calories
   */
  calculateTotalCalories(mealPlan) {
    return dietRepository.calculateTotalCalories(mealPlan);
  }

  /**
   * Validate meal plan structure
   * @param {Object} mealPlan - Meal plan JSONB object
   * @returns {Object} Validation result
   */
  validateMealPlan(mealPlan) {
    return dietRepository.validateMealPlan(mealPlan);
  }

  /**
   * Get diet plan statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Statistics
   */
  async getDietPlanStatistics(filters = {}) {
    return await dietRepository.getStatistics(filters);
  }
}

export default new DietService();
