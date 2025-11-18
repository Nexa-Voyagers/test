import { asyncHandler } from '../utils/asyncHandler.js';
import memberService from '../services/member.service.js';
import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

/**
 * Member Controller
 * Handles HTTP requests for member operations
 */

// Validation schemas
const createMemberSchema = Joi.object({
  gym_id: Joi.number().integer().required(),
  first_name: Joi.string().required().max(100),
  last_name: Joi.string().required().max(100),
  email: Joi.string().email().required().max(255),
  phone: Joi.string().required().max(15),
  date_of_birth: Joi.date(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  address: Joi.string(),
  city: Joi.string().max(100),
  state: Joi.string().max(100),
  pincode: Joi.string().max(10),
  emergency_contact_name: Joi.string().max(100),
  emergency_contact_phone: Joi.string().max(15),
  health_conditions: Joi.string(),
  fitness_goals: Joi.string(),
  photo_url: Joi.string().max(500)
});

const updateMemberSchema = Joi.object({
  gym_id: Joi.number().integer(),
  first_name: Joi.string().max(100),
  last_name: Joi.string().max(100),
  email: Joi.string().email().max(255),
  phone: Joi.string().max(15),
  date_of_birth: Joi.date(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  address: Joi.string(),
  city: Joi.string().max(100),
  state: Joi.string().max(100),
  pincode: Joi.string().max(10),
  emergency_contact_name: Joi.string().max(100),
  emergency_contact_phone: Joi.string().max(15),
  health_conditions: Joi.string(),
  fitness_goals: Joi.string(),
  photo_url: Joi.string().max(500),
  is_active: Joi.boolean()
}).min(1);

/**
 * @route   POST /api/v1/members
 * @desc    Create a new member
 * @access  Private
 */
export const createMember = asyncHandler(async (req, res) => {
  const { error } = createMemberSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const member = await memberService.createMember(req.body);

  res.status(201).json({
    success: true,
    message: 'Member created successfully',
    data: member
  });
});

/**
 * @route   GET /api/v1/members
 * @desc    Get all members with filters
 * @access  Private
 */
export const getAllMembers = asyncHandler(async (req, res) => {
  const { gym_id, search, gender, city, is_active, page = 1, limit = 50 } = req.query;

  const filters = {
    gym_id: gym_id ? parseInt(gym_id) : undefined,
    search,
    gender,
    city,
    is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };

  const result = await memberService.getAllMembers(filters);

  res.json({
    success: true,
    data: result.members,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: Math.ceil(result.total / result.limit)
    }
  });
});

/**
 * @route   GET /api/v1/members/search
 * @desc    Search members by name or phone
 * @access  Private
 */
export const searchMembers = asyncHandler(async (req, res) => {
  const { q, limit = 20 } = req.query;

  if (!q || q.trim() === '') {
    throw new ValidationError(['Search query is required']);
  }

  const members = await memberService.searchMembers(q, parseInt(limit));

  res.json({
    success: true,
    data: members
  });
});

/**
 * @route   GET /api/v1/members/expiring-memberships
 * @desc    Get members with expiring memberships
 * @access  Private
 */
export const getMembersWithExpiringMemberships = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;

  const members = await memberService.getMembersWithExpiringMemberships(parseInt(days));

  res.json({
    success: true,
    data: members
  });
});

/**
 * @route   GET /api/v1/members/:id
 * @desc    Get member by ID
 * @access  Private
 */
export const getMemberById = asyncHandler(async (req, res) => {
  const member = await memberService.getMemberById(parseInt(req.params.id));

  res.json({
    success: true,
    data: member
  });
});

/**
 * @route   GET /api/v1/members/:id/with-membership
 * @desc    Get member with membership details
 * @access  Private
 */
export const getMemberWithMembership = asyncHandler(async (req, res) => {
  const member = await memberService.getMemberWithMembership(parseInt(req.params.id));

  res.json({
    success: true,
    data: member
  });
});

/**
 * @route   PUT /api/v1/members/:id
 * @desc    Update member
 * @access  Private
 */
export const updateMember = asyncHandler(async (req, res) => {
  const { error } = updateMemberSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const member = await memberService.updateMember(parseInt(req.params.id), req.body);

  res.json({
    success: true,
    message: 'Member updated successfully',
    data: member
  });
});

/**
 * @route   DELETE /api/v1/members/:id
 * @desc    Delete member (soft delete)
 * @access  Private
 */
export const deleteMember = asyncHandler(async (req, res) => {
  await memberService.deleteMember(parseInt(req.params.id));

  res.json({
    success: true,
    message: 'Member deleted successfully'
  });
});

export default {
  createMember,
  getAllMembers,
  searchMembers,
  getMembersWithExpiringMemberships,
  getMemberById,
  getMemberWithMembership,
  updateMember,
  deleteMember
};
