import { guestService } from '../services/guest.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Create guest
 * POST /api/v1/guests
 */
const createGuest = asyncHandler(async (req, res) => {
  const guest = await guestService.createGuest(req.body);

  res.status(201).json({
    success: true,
    message: 'Guest created successfully',
    data: guest,
  });
});

/**
 * Get guest
 * GET /api/v1/guests/:id
 */
const getGuest = asyncHandler(async (req, res) => {
  const guest = await guestService.getGuest(req.params.id);

  res.json({
    success: true,
    data: guest,
  });
});

/**
 * Search guests
 * GET /api/v1/guests/search
 */
const searchGuests = asyncHandler(async (req, res) => {
  const { q, limit = 20, offset = 0 } = req.query;

  const result = await guestService.searchGuests(q, {
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  res.json({
    success: true,
    data: result.guests,
    pagination: {
      total: result.totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});

/**
 * Update guest
 * PUT /api/v1/guests/:id
 */
const updateGuest = asyncHandler(async (req, res) => {
  const guest = await guestService.updateGuest(req.params.id, req.body);

  res.json({
    success: true,
    message: 'Guest updated successfully',
    data: guest,
  });
});

/**
 * Get VIP guests
 * GET /api/v1/guests/vip-list
 */
const getVIPGuests = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const guests = await guestService.getVIPGuests(parseInt(limit));

  res.json({
    success: true,
    data: guests,
  });
});

/**
 * Get repeat guests
 * GET /api/v1/guests/repeat-list
 */
const getRepeatGuests = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const guests = await guestService.getRepeatGuests(parseInt(limit));

  res.json({
    success: true,
    data: guests,
  });
});

/**
 * Get guest preferences
 * GET /api/v1/guests/:id/preferences
 */
const getGuestPreferences = asyncHandler(async (req, res) => {
  const preferences = await guestService.getGuestPreferences(req.params.id);

  res.json({
    success: true,
    data: preferences,
  });
});

/**
 * Award loyalty points
 * POST /api/v1/guests/:id/award-points
 */
const awardLoyaltyPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;

  const guest = await guestService.awardLoyaltyPoints(req.params.id, points);

  res.json({
    success: true,
    message: 'Loyalty points awarded successfully',
    data: guest,
  });
});

/**
 * Redeem loyalty points
 * POST /api/v1/guests/:id/redeem-points
 */
const redeemLoyaltyPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;

  const guest = await guestService.redeemLoyaltyPoints(req.params.id, points);

  res.json({
    success: true,
    message: 'Loyalty points redeemed successfully',
    data: guest,
  });
});

export const guestController = {
  createGuest,
  getGuest,
  searchGuests,
  updateGuest,
  getVIPGuests,
  getRepeatGuests,
  getGuestPreferences,
  awardLoyaltyPoints,
  redeemLoyaltyPoints,
};
