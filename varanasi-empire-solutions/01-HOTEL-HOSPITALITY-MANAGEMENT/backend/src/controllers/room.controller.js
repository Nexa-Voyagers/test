import { roomService } from '../services/room.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Create room
 * POST /api/v1/rooms
 */
const createRoom = asyncHandler(async (req, res) => {
  const room = await roomService.createRoom(req.body);

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    data: room,
  });
});

/**
 * Get room
 * GET /api/v1/rooms/:id
 */
const getRoom = asyncHandler(async (req, res) => {
  const room = await roomService.getRoom(req.params.id);

  res.json({
    success: true,
    data: room,
  });
});

/**
 * Get rooms by property
 * GET /api/v1/properties/:propertyId/rooms
 */
const getRoomsByProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { status = null, floor = null, limit = 50, offset = 0 } = req.query;

  const result = await roomService.getRoomsByProperty(propertyId, {
    status,
    floor: floor ? parseInt(floor) : null,
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  res.json({
    success: true,
    data: result.rooms,
    pagination: {
      total: result.totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});

/**
 * Update room
 * PUT /api/v1/rooms/:id
 */
const updateRoom = asyncHandler(async (req, res) => {
  const room = await roomService.updateRoom(req.params.id, req.body);

  res.json({
    success: true,
    message: 'Room updated successfully',
    data: room,
  });
});

/**
 * Check room availability
 * POST /api/v1/rooms/availability/check
 */
const checkAvailability = asyncHandler(async (req, res) => {
  const { propertyId, categoryId, checkInDate, checkOutDate } = req.body;

  const availableRooms = await roomService.checkAvailability(
    propertyId,
    categoryId,
    checkInDate,
    checkOutDate
  );

  res.json({
    success: true,
    message: 'Rooms available for the selected dates',
    data: availableRooms,
  });
});

/**
 * Get room status summary
 * GET /api/v1/properties/:propertyId/room-status
 */
const getRoomStatusSummary = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const summary = await roomService.getRoomStatusSummary(propertyId);

  res.json({
    success: true,
    data: summary,
  });
});

/**
 * Mark room as available
 * PATCH /api/v1/rooms/:id/mark-available
 */
const markAvailable = asyncHandler(async (req, res) => {
  const room = await roomService.markAvailable(req.params.id);

  res.json({
    success: true,
    message: 'Room marked as available',
    data: room,
  });
});

/**
 * Mark room for maintenance
 * PATCH /api/v1/rooms/:id/mark-maintenance
 */
const markMaintenance = asyncHandler(async (req, res) => {
  const room = await roomService.markMaintenance(req.params.id);

  res.json({
    success: true,
    message: 'Room marked for maintenance',
    data: room,
  });
});

/**
 * Block room
 * PATCH /api/v1/rooms/:id/block
 */
const blockRoom = asyncHandler(async (req, res) => {
  const room = await roomService.blockRoom(req.params.id);

  res.json({
    success: true,
    message: 'Room blocked successfully',
    data: room,
  });
});

export const roomController = {
  createRoom,
  getRoom,
  getRoomsByProperty,
  updateRoom,
  checkAvailability,
  getRoomStatusSummary,
  markAvailable,
  markMaintenance,
  blockRoom,
};
