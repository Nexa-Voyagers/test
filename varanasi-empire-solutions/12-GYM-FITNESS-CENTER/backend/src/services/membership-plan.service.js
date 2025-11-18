import membershipPlanRepository from '../repositories/membership-plan.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Membership Plan Service
 * Business logic for membership plan operations
 */
class MembershipPlanService {
  /**
   * Create a new membership plan
   * @param {Object} planData - Plan data
   * @returns {Promise<Object>} Created plan
   */
  async createPlan(planData) {
    // Validate required fields
    if (!planData.name || !planData.duration_months || !planData.plan_fee) {
      throw new ValidationError(['Name, duration_months, and plan_fee are required']);
    }

    // Validate numeric fields
    if (planData.duration_months < 1 || planData.duration_months > 60) {
      throw new ValidationError(['Duration must be between 1 and 60 months']);
    }

    if (planData.plan_fee < 0) {
      throw new ValidationError(['Plan fee cannot be negative']);
    }

    if (planData.registration_fee && planData.registration_fee < 0) {
      throw new ValidationError(['Registration fee cannot be negative']);
    }

    return await membershipPlanRepository.create(planData);
  }

  /**
   * Get all membership plans
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Plans and metadata
   */
  async getAllPlans(filters = {}) {
    const plans = await membershipPlanRepository.findAll(filters);
    const total = await membershipPlanRepository.count(filters);

    return {
      plans,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50
    };
  }

  /**
   * Get membership plan by ID
   * @param {number} id - Plan ID
   * @returns {Promise<Object>} Plan data
   */
  async getPlanById(id) {
    return await membershipPlanRepository.findById(id);
  }

  /**
   * Get plan with popularity stats
   * @param {number} id - Plan ID
   * @returns {Promise<Object>} Plan with statistics
   */
  async getPlanWithStats(id) {
    const plan = await membershipPlanRepository.findById(id);
    const popularity = await membershipPlanRepository.getPopularity(id);

    return {
      ...plan,
      popularity
    };
  }

  /**
   * Update membership plan
   * @param {number} id - Plan ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated plan
   */
  async updatePlan(id, updateData) {
    // Validate numeric fields if provided
    if (updateData.duration_months !== undefined) {
      if (updateData.duration_months < 1 || updateData.duration_months > 60) {
        throw new ValidationError(['Duration must be between 1 and 60 months']);
      }
    }

    if (updateData.plan_fee !== undefined && updateData.plan_fee < 0) {
      throw new ValidationError(['Plan fee cannot be negative']);
    }

    if (updateData.registration_fee !== undefined && updateData.registration_fee < 0) {
      throw new ValidationError(['Registration fee cannot be negative']);
    }

    return await membershipPlanRepository.update(id, updateData);
  }

  /**
   * Delete membership plan
   * @param {number} id - Plan ID
   * @returns {Promise<boolean>} Success status
   */
  async deletePlan(id) {
    return await membershipPlanRepository.delete(id);
  }

  /**
   * Get active plans
   * @returns {Promise<Array>} Active plans
   */
  async getActivePlans() {
    return await membershipPlanRepository.findActive();
  }

  /**
   * Get all plans with statistics
   * @returns {Promise<Array>} Plans with statistics
   */
  async getPlansWithStats() {
    return await membershipPlanRepository.findAllWithStats();
  }
}

export default new MembershipPlanService();
