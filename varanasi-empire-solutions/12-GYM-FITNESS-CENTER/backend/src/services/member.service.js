import memberRepository from '../repositories/member.repository.js';
import { ValidationError, ConflictError } from '../utils/errors.js';

/**
 * Member Service
 * Business logic for member operations
 */
class MemberService {
  /**
   * Create a new member
   * @param {Object} memberData - Member data
   * @returns {Promise<Object>} Created member
   */
  async createMember(memberData) {
    // Validate required fields
    if (!memberData.gym_id || !memberData.first_name || !memberData.last_name || !memberData.email || !memberData.phone) {
      throw new ValidationError(['gym_id, first_name, last_name, email, and phone are required']);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberData.email)) {
      throw new ValidationError(['Invalid email format']);
    }

    // Check if email already exists
    const existingEmail = await memberRepository.findByEmail(memberData.email);
    if (existingEmail) {
      throw new ConflictError('Email already registered');
    }

    // Check if phone already exists
    const existingPhone = await memberRepository.findByPhone(memberData.phone);
    if (existingPhone) {
      throw new ConflictError('Phone number already registered');
    }

    return await memberRepository.create(memberData);
  }

  /**
   * Get all members
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Members and metadata
   */
  async getAllMembers(filters = {}) {
    const members = await memberRepository.findAll(filters);
    const total = await memberRepository.count(filters);

    return {
      members,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50
    };
  }

  /**
   * Get member by ID
   * @param {number} id - Member ID
   * @returns {Promise<Object>} Member data
   */
  async getMemberById(id) {
    return await memberRepository.findById(id);
  }

  /**
   * Get member with membership details
   * @param {number} id - Member ID
   * @returns {Promise<Object>} Member with membership
   */
  async getMemberWithMembership(id) {
    return await memberRepository.findWithMembership(id);
  }

  /**
   * Update member
   * @param {number} id - Member ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated member
   */
  async updateMember(id, updateData) {
    // Validate email if provided
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        throw new ValidationError(['Invalid email format']);
      }

      // Check if email is taken by another member
      const existing = await memberRepository.findByEmail(updateData.email);
      if (existing && existing.member_id !== id) {
        throw new ConflictError('Email already registered');
      }
    }

    // Validate phone if provided
    if (updateData.phone) {
      const existing = await memberRepository.findByPhone(updateData.phone);
      if (existing && existing.member_id !== id) {
        throw new ConflictError('Phone number already registered');
      }
    }

    return await memberRepository.update(id, updateData);
  }

  /**
   * Delete member
   * @param {number} id - Member ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteMember(id) {
    return await memberRepository.delete(id);
  }

  /**
   * Search members
   * @param {string} searchTerm - Search term
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Matching members
   */
  async searchMembers(searchTerm, limit = 20) {
    return await memberRepository.search(searchTerm, limit);
  }

  /**
   * Get members with expiring memberships
   * @param {number} days - Days until expiry
   * @returns {Promise<Array>} Members with expiring memberships
   */
  async getMembersWithExpiringMemberships(days = 7) {
    return await memberRepository.findWithExpiringMemberships(days);
  }

  /**
   * Get active members by gym
   * @param {number} gymId - Gym ID
   * @returns {Promise<Array>} Active members
   */
  async getActiveMembersByGym(gymId) {
    return await memberRepository.findActiveByGym(gymId);
  }
}

export default new MemberService();
