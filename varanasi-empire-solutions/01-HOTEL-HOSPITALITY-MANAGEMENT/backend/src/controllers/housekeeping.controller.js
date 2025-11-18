import { housekeepingService } from '../services/housekeeping.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get rooms needing cleaning
 * GET /api/v1/properties/:propertyId/housekeeping/dirty-rooms
 */
const getRoomsNeedingCleaning = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const rooms = await housekeepingService.getRoomsNeedingCleaning(propertyId);

  res.json({
    success: true,
    data: rooms,
  });
});

/**
 * Get rooms for inspection
 * GET /api/v1/properties/:propertyId/housekeeping/inspection-rooms
 */
const getRoomsForInspection = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const rooms = await housekeepingService.getRoomsForInspection(propertyId);

  res.json({
    success: true,
    data: rooms,
  });
});

/**
 * Get cleaned and ready rooms
 * GET /api/v1/properties/:propertyId/housekeeping/cleaned-rooms
 */
const getCleanedRooms = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const rooms = await housekeepingService.getCleanedRooms(propertyId);

  res.json({
    success: true,
    data: rooms,
  });
});

/**
 * Create housekeeping task
 * POST /api/v1/housekeeping/tasks
 */
const createTask = asyncHandler(async (req, res) => {
  const task = await housekeepingService.createTask(req.body);

  res.status(201).json({
    success: true,
    message: 'Housekeeping task created successfully',
    data: task,
  });
});

/**
 * Get tasks by property
 * GET /api/v1/properties/:propertyId/housekeeping/tasks
 */
const getTasksByProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { status = 'PENDING', limit = 50 } = req.query;

  const tasks = await housekeepingService.getTasksByProperty(propertyId, {
    status,
    limit: parseInt(limit),
  });

  res.json({
    success: true,
    data: tasks,
  });
});

/**
 * Assign task to staff
 * POST /api/v1/housekeeping/tasks/:id/assign
 */
const assignTask = asyncHandler(async (req, res) => {
  const { staffId } = req.body;

  const task = await housekeepingService.assignTask(req.params.id, staffId);

  res.json({
    success: true,
    message: 'Task assigned successfully',
    data: task,
  });
});

/**
 * Start cleaning room
 * POST /api/v1/rooms/:id/cleaning/start
 */
const startCleaning = asyncHandler(async (req, res) => {
  const room = await housekeepingService.startCleaning(req.params.id);

  res.json({
    success: true,
    message: 'Cleaning started',
    data: room,
  });
});

/**
 * Complete cleaning
 * POST /api/v1/rooms/:id/cleaning/complete
 */
const completeCleaning = asyncHandler(async (req, res) => {
  const room = await housekeepingService.completeCleaning(req.params.id);

  res.json({
    success: true,
    message: 'Cleaning completed, room ready for inspection',
    data: room,
  });
});

/**
 * Inspect room
 * POST /api/v1/rooms/:id/inspect
 */
const inspectRoom = asyncHandler(async (req, res) => {
  const room = await housekeepingService.inspectRoom(req.params.id);

  res.json({
    success: true,
    message: 'Room inspected and approved',
    data: room,
  });
});

/**
 * Mark room as clean
 * POST /api/v1/rooms/:id/mark-clean
 */
const markRoomClean = asyncHandler(async (req, res) => {
  const room = await housekeepingService.markRoomClean(req.params.id);

  res.json({
    success: true,
    message: 'Room marked as clean and available',
    data: room,
  });
});

/**
 * Get housekeeping statistics
 * GET /api/v1/properties/:propertyId/housekeeping/stats
 */
const getStats = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const stats = await housekeepingService.getStats(propertyId);

  res.json({
    success: true,
    data: stats,
  });
});

export const housekeepingController = {
  getRoomsNeedingCleaning,
  getRoomsForInspection,
  getCleanedRooms,
  createTask,
  getTasksByProperty,
  assignTask,
  startCleaning,
  completeCleaning,
  inspectRoom,
  markRoomClean,
  getStats,
};
