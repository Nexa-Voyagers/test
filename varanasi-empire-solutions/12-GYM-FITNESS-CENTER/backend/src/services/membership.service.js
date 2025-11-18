import membershipRepository from '../repositories/membership.repository.js';
import membershipPlanRepository from '../repositories/membership-plan.repository.js';
import memberRepository from '../repositories/member.repository.js';
import { ValidationError, ConflictError } from '../utils/errors.js';

/**
 * Membership Service
 * Business logic for membership operations including fee calculation and expiry management
 */
class MembershipService {
  /**
   * Enroll member in membership plan
   * @param {Object} enrollmentData - Enrollment data
   * @returns {Promise<Object>} Created membership
   */
  async enrollMembership(enrollmentData) {
    const { member_id, plan_id, start_date, discount = 0, registration_fee = 0, amount_paid = 0, payment_method, notes } = enrollmentData;

    // Validate required fields
    if (!member_id || !plan_id) {
      throw new ValidationError(['member_id and plan_id are required']);
    }

    // Check if member exists
    await memberRepository.findById(member_id);

    // Check if member already has an active membership
    const activeMembership = await membershipRepository.findActiveByMember(member_id);
    if (activeMembership) {
      throw new ConflictError('Member already has an active membership');
    }

    // Get plan details
    const plan = await membershipPlanRepository.findById(plan_id);

    // Calculate final fee: plan_fee + registration_fee - discount
    const final_fee = parseFloat(plan.plan_fee) + parseFloat(registration_fee || 0) - parseFloat(discount || 0);

    if (final_fee < 0) {
      throw new ValidationError(['Final fee cannot be negative']);
    }

    // Calculate end date: start_date + duration_months
    const startDateObj = start_date ? new Date(start_date) : new Date();
    const endDateObj = new Date(startDateObj);
    endDateObj.setMonth(endDateObj.getMonth() + parseInt(plan.duration_months));

    // Determine payment status
    let payment_status = 'PENDING';
    if (amount_paid >= final_fee) {
      payment_status = 'PAID';
    } else if (amount_paid > 0) {
      payment_status = 'PARTIAL';
    }

    const membershipData = {
      member_id,
      plan_id,
      start_date: startDateObj.toISOString().split('T')[0],
      end_date: endDateObj.toISOString().split('T')[0],
      final_fee,
      discount: discount || 0,
      registration_fee: registration_fee || 0,
      amount_paid: amount_paid || 0,
      payment_status,
      payment_method,
      notes
    };

    return await membershipRepository.create(membershipData);
  }

  /**
   * Renew membership
   * @param {number} memberId - Member ID
   * @param {Object} renewalData - Renewal data
   * @returns {Promise<Object>} New membership
   */
  async renewMembership(memberId, renewalData) {
    const { plan_id, discount = 0, amount_paid = 0, payment_method, notes } = renewalData;

    // Get current membership
    const currentMembership = await membershipRepository.findActiveByMember(memberId);

    // Get plan details
    const plan = await membershipPlanRepository.findById(plan_id);

    // Calculate final fee (no registration fee for renewals)
    const final_fee = parseFloat(plan.plan_fee) - parseFloat(discount || 0);

    if (final_fee < 0) {
      throw new ValidationError(['Final fee cannot be negative']);
    }

    // Start date is the day after current membership ends, or today if no active membership
    let startDateObj;
    if (currentMembership && currentMembership.end_date) {
      startDateObj = new Date(currentMembership.end_date);
      startDateObj.setDate(startDateObj.getDate() + 1);
    } else {
      startDateObj = new Date();
    }

    // Calculate end date
    const endDateObj = new Date(startDateObj);
    endDateObj.setMonth(endDateObj.getMonth() + parseInt(plan.duration_months));

    // Determine payment status
    let payment_status = 'PENDING';
    if (amount_paid >= final_fee) {
      payment_status = 'PAID';
    } else if (amount_paid > 0) {
      payment_status = 'PARTIAL';
    }

    const membershipData = {
      member_id: memberId,
      plan_id,
      start_date: startDateObj.toISOString().split('T')[0],
      end_date: endDateObj.toISOString().split('T')[0],
      final_fee,
      discount: discount || 0,
      registration_fee: 0,
      amount_paid: amount_paid || 0,
      payment_status,
      payment_method,
      notes
    };

    // Expire current membership if exists
    if (currentMembership) {
      await membershipRepository.update(currentMembership.membership_id, { status: 'EXPIRED' });
    }

    return await membershipRepository.create(membershipData);
  }

  /**
   * Get all memberships
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Memberships and metadata
   */
  async getAllMemberships(filters = {}) {
    const memberships = await membershipRepository.findAll(filters);
    const total = await membershipRepository.count(filters);

    return {
      memberships,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50
    };
  }

  /**
   * Get membership by ID
   * @param {number} id - Membership ID
   * @returns {Promise<Object>} Membership data
   */
  async getMembershipById(id) {
    return await membershipRepository.findById(id);
  }

  /**
   * Update membership
   * @param {number} id - Membership ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated membership
   */
  async updateMembership(id, updateData) {
    return await membershipRepository.update(id, updateData);
  }

  /**
   * Add payment to membership
   * @param {number} id - Membership ID
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Updated membership
   */
  async addPayment(id, paymentData) {
    const { amount, payment_method } = paymentData;

    if (!amount || amount <= 0) {
      throw new ValidationError(['Payment amount must be greater than 0']);
    }

    if (!payment_method) {
      throw new ValidationError(['Payment method is required']);
    }

    return await membershipRepository.updatePayment(id, amount, payment_method);
  }

  /**
   * Cancel membership
   * @param {number} id - Membership ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancelled membership
   */
  async cancelMembership(id, reason) {
    if (!reason) {
      throw new ValidationError(['Cancellation reason is required']);
    }

    return await membershipRepository.cancel(id, reason);
  }

  /**
   * Get expiring memberships
   * @param {number} days - Days until expiry (default 7)
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Array>} Expiring memberships
   */
  async getExpiringMemberships(days = 7, gymId = null) {
    return await membershipRepository.findExpiring(days, gymId);
  }

  /**
   * Update expired memberships (scheduled job)
   * @returns {Promise<number>} Number of updated memberships
   */
  async updateExpiredMemberships() {
    return await membershipRepository.updateExpiredMemberships();
  }

  /**
   * Get membership history for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Array>} Membership history
   */
  async getMembershipHistory(memberId) {
    return await membershipRepository.findHistoryByMember(memberId);
  }

  /**
   * Get revenue statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Revenue statistics
   */
  async getRevenueStats(filters = {}) {
    return await membershipRepository.getRevenueStats(filters);
  }

  /**
   * Get active membership for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Active membership or null
   */
  async getActiveMembership(memberId) {
    return await membershipRepository.findActiveByMember(memberId);
  }
}

export default new MembershipService();
