import { tableService } from '../services/table.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Create floor
 * POST /api/tables/floors
 */
const createFloor = asyncHandler(async (req, res) => {
  const { floor_name, floor_number, total_tables } = req.body;

  const floor = await tableService.createFloor({
    restaurant_id: req.user.restaurant_id,
    floor_name,
    floor_number,
    total_tables,
  });

  logger.info(`Floor created: ${floor_name}`);

  res.status(201).json({
    success: true,
    message: 'Floor created successfully',
    data: floor,
  });
});

/**
 * Create table
 * POST /api/tables
 */
const createTable = asyncHandler(async (req, res) => {
  const {
    floor_id,
    table_number,
    table_name,
    seating_capacity,
    table_type,
    position_x,
    position_y,
  } = req.body;

  const table = await tableService.createTable({
    restaurant_id: req.user.restaurant_id,
    floor_id,
    table_number,
    table_name,
    seating_capacity,
    table_type,
    position_x,
    position_y,
  });

  logger.info(`Table created: ${table_number}`);

  res.status(201).json({
    success: true,
    message: 'Table created successfully',
    data: table,
  });
});

/**
 * Get table by ID
 * GET /api/tables/:id
 */
const getTable = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const table = await tableService.getTable(id);

  res.json({
    success: true,
    data: table,
  });
});

/**
 * Get restaurant tables
 * GET /api/tables
 */
const getRestaurantTables = asyncHandler(async (req, res) => {
  const { floorId, status } = req.query;

  const tables = await tableService.getTablesByRestaurant(req.user.restaurant_id, {
    floorId,
    status,
  });

  res.json({
    success: true,
    data: tables,
  });
});

/**
 * Get available tables
 * GET /api/tables/available
 */
const getAvailableTables = asyncHandler(async (req, res) => {
  const { capacity = 1 } = req.query;

  const tables = await tableService.getAvailableTables(req.user.restaurant_id, parseInt(capacity));

  res.json({
    success: true,
    data: tables,
  });
});

/**
 * Occupy table
 * PATCH /api/tables/:id/occupy
 */
const occupyTable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderId } = req.body;

  const table = await tableService.occupyTable(id, orderId);

  logger.info(`Table occupied: ${id} with order ${orderId}`);

  res.json({
    success: true,
    message: 'Table marked as occupied',
    data: table,
  });
});

/**
 * Release table
 * PATCH /api/tables/:id/release
 */
const releaseTable = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const table = await tableService.releaseTable(id);

  logger.info(`Table released: ${id}`);

  res.json({
    success: true,
    message: 'Table marked as available',
    data: table,
  });
});

/**
 * Get floors
 * GET /api/tables/floors
 */
const getFloors = asyncHandler(async (req, res) => {
  const floors = await tableService.getFloors(req.user.restaurant_id);

  res.json({
    success: true,
    data: floors,
  });
});

/**
 * Create reservation
 * POST /api/tables/reservations
 */
const createReservation = asyncHandler(async (req, res) => {
  const {
    table_id,
    customer_id,
    reservation_date,
    reservation_time,
    party_size,
    customer_name,
    customer_phone,
    customer_email,
    special_requests,
    occasion,
  } = req.body;

  const reservation = await tableService.createReservation({
    restaurant_id: req.user.restaurant_id,
    table_id,
    customer_id,
    reservation_date,
    reservation_time,
    party_size,
    customer_name,
    customer_phone,
    customer_email,
    special_requests,
    occasion,
  });

  logger.info(`Reservation created for: ${customer_name}`);

  res.status(201).json({
    success: true,
    message: 'Reservation created successfully',
    data: reservation,
  });
});

/**
 * Get reservations by date
 * GET /api/tables/reservations/:date
 */
const getReservationsByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;

  const reservations = await tableService.getReservationsByDate(req.user.restaurant_id, date);

  res.json({
    success: true,
    data: reservations,
  });
});

/**
 * Generate QR code for table
 * GET /api/tables/:id/qr-code
 */
const generateQRCode = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const qrCode = await tableService.generateTableQRCode(req.user.restaurant_id, id);

  logger.info(`QR code generated for table: ${id}`);

  res.json({
    success: true,
    message: 'QR code generated successfully',
    data: {
      tableId: id,
      qrCode,
    },
  });
});

/**
 * Update table
 * PATCH /api/tables/:id
 */
const updateTable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const table = await tableService.updateTable(id, updateData);

  logger.info(`Table updated: ${id}`);

  res.json({
    success: true,
    message: 'Table updated successfully',
    data: table,
  });
});

/**
 * Get table statistics
 * GET /api/tables/statistics
 */
const getStatistics = asyncHandler(async (req, res) => {
  const stats = await tableService.getStatistics(req.user.restaurant_id);

  res.json({
    success: true,
    data: stats,
  });
});

/**
 * Reserve table
 * POST /api/tables/:id/reserve
 */
const reserveTable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reservationData = req.body;

  const reservation = await tableService.reserveTable(id, reservationData);

  logger.info(`Table reserved: ${id}`);

  res.status(201).json({
    success: true,
    message: 'Table reserved successfully',
    data: reservation,
  });
});


/**
 * Update table status
 */
const updateTableStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  let result;
  if (status === 'OCCUPIED') {
    result = await tableService.occupy(id);
  } else if (status === 'AVAILABLE') {
    result = await tableService.release(id);
  } else {
    result = await tableService.updateTable(id, { status });
  }
  
  logger.info(`Table ${id} status updated to ${status}`);
  
  res.json({
    success: true,
    message: 'Table status updated successfully',
    data: result,
  });
});
export const tableController = {
  createFloor,
  createTable,
  getTable,
  getRestaurantTables,
  getAvailableTables,
  occupyTable,
  releaseTable,
  getFloors,
  createReservation,
  getReservationsByDate,
  generateQRCode,
  updateTable,
  getStatistics,
  reserveTable,
  updateTableStatus,
};
