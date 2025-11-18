import { tableRepository } from '../repositories/table.repository.js';
import { NotFoundError, AppError } from '../utils/errors.js';
import QRCode from 'qrcode';

/**
 * Create floor
 * @param {Object} floorData - Floor data
 * @returns {Promise<Object>} Created floor
 */
const createFloor = async (floorData) => {
  const floor = await tableRepository.createFloor(floorData);
  return floor;
};

/**
 * Create table
 * @param {Object} tableData - Table data
 * @returns {Promise<Object>} Created table
 */
const createTable = async (tableData) => {
  // Validate seating capacity
  if (tableData.seating_capacity && tableData.seating_capacity <= 0) {
    throw new AppError('Seating capacity must be greater than 0', 400);
  }

  const table = await tableRepository.createTable(tableData);
  return table;
};

/**
 * Get table by ID
 * @param {string} tableId - Table ID
 * @returns {Promise<Object>} Table object
 */
const getTable = async (tableId) => {
  const table = await tableRepository.findById(tableId);
  if (!table) {
    throw new NotFoundError('Table');
  }
  return table;
};

/**
 * Get tables by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Tables
 */
const getTablesByRestaurant = async (restaurantId, options = {}) => {
  const tables = await tableRepository.findByRestaurant(restaurantId, options);
  return tables;
};

/**
 * Get available tables
 * @param {string} restaurantId - Restaurant ID
 * @param {number} capacity - Minimum capacity
 * @returns {Promise<Array>} Available tables
 */
const getAvailableTables = async (restaurantId, capacity = 1) => {
  const tables = await tableRepository.findAvailable(restaurantId, capacity);
  if (tables.length === 0) {
    throw new AppError('No available tables with required capacity', 409);
  }
  return tables;
};

/**
 * Mark table as occupied
 * @param {string} tableId - Table ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Updated table
 */
const occupyTable = async (tableId, orderId) => {
  const table = await tableRepository.updateStatus(tableId, 'OCCUPIED', orderId);
  if (!table) {
    throw new NotFoundError('Table');
  }
  return table;
};

/**
 * Release table (mark as available)
 * @param {string} tableId - Table ID
 * @returns {Promise<Object>} Updated table
 */
const releaseTable = async (tableId) => {
  const table = await tableRepository.updateStatus(tableId, 'AVAILABLE', null);
  if (!table) {
    throw new NotFoundError('Table');
  }
  return table;
};

/**
 * Get floors by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Floors
 */
const getFloors = async (restaurantId) => {
  const floors = await tableRepository.findFloors(restaurantId);
  return floors;
};

/**
 * Create reservation
 * @param {Object} reservationData - Reservation data
 * @returns {Promise<Object>} Created reservation
 */
const createReservation = async (reservationData) => {
  // Validate date and time
  const reservationDateTime = new Date(`${reservationData.reservation_date}T${reservationData.reservation_time}`);
  if (reservationDateTime < new Date()) {
    throw new AppError('Cannot create reservation for past date/time', 400);
  }

  const reservation = await tableRepository.createReservation(reservationData);
  return reservation;
};

/**
 * Get reservations by date
 * @param {string} restaurantId - Restaurant ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Array>} Reservations
 */
const getReservationsByDate = async (restaurantId, date) => {
  const reservations = await tableRepository.findReservationsByDate(restaurantId, date);
  return reservations;
};

/**
 * Generate QR code for table
 * @param {string} restaurantId - Restaurant ID
 * @param {string} tableId - Table ID
 * @returns {Promise<string>} QR code data URL
 */
const generateTableQRCode = async (restaurantId, tableId) => {
  try {
    // Get base URL from environment
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const qrData = `${baseUrl}/restaurant/${restaurantId}/table/${tableId}`;

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    throw new AppError('Failed to generate QR code', 500);
  }
};

/**
 * Update table
 * @param {string} tableId - Table ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated table
 */
const updateTable = async (tableId, updateData) => {
  if (updateData.seating_capacity && updateData.seating_capacity <= 0) {
    throw new AppError('Seating capacity must be greater than 0', 400);
  }

  const table = await tableRepository.update(tableId, updateData);
  if (!table) {
    throw new NotFoundError('Table');
  }

  return table;
};

/**
 * Get table statistics
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} Table statistics
 */
const getStatistics = async (restaurantId) => {
  const stats = await tableRepository.getStatistics(restaurantId);
  return stats;
};

/**
 * Reserve table
 * @param {string} tableId - Table ID
 * @param {Object} reservationData - Reservation details
 * @returns {Promise<Object>} Reservation
 */
const reserveTable = async (tableId, reservationData) => {
  const table = await tableRepository.findById(tableId);
  if (!table) {
    throw new NotFoundError('Table');
  }

  const reservation = await tableRepository.createReservation({
    ...reservationData,
    table_id: tableId,
  });

  // Update table status to RESERVED
  await tableRepository.updateStatus(tableId, 'RESERVED');

  return reservation;
};

export const tableService = {
  createFloor,
  createTable,
  getTable,
  getTablesByRestaurant,
  getAvailableTables,
  occupyTable,
  releaseTable,
  getFloors,
  createReservation,
  getReservationsByDate,
  generateTableQRCode,
  updateTable,
  getStatistics,
  reserveTable,
};
