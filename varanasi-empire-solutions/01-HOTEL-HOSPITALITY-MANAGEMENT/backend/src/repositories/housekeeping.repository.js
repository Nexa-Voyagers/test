import { query } from '../config/database.js';

/**
 * Get rooms needing cleaning
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array>}
 */
const getRoomsNeedingCleaning = async (propertyId) => {
  const sql = `
    SELECT r.*, rc.category_name
    FROM rooms r
    LEFT JOIN room_categories rc ON r.room_category_id = rc.id
    WHERE r.property_id = $1
    AND r.housekeeping_status IN ('DIRTY', 'CLEANING_IN_PROGRESS')
    AND r.is_active = true
    ORDER BY r.floor_number, r.room_number
  `;

  const result = await query(sql, [propertyId]);
  return result.rows;
};

/**
 * Get rooms ready for inspection
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array>}
 */
const getRoomsForInspection = async (propertyId) => {
  const sql = `
    SELECT r.*, rc.category_name
    FROM rooms r
    LEFT JOIN room_categories rc ON r.room_category_id = rc.id
    WHERE r.property_id = $1
    AND r.housekeeping_status = 'CLEANING_IN_PROGRESS'
    AND r.is_active = true
    ORDER BY r.floor_number, r.room_number
  `;

  const result = await query(sql, [propertyId]);
  return result.rows;
};

/**
 * Get cleaned and ready rooms
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array>}
 */
const getCleanedRooms = async (propertyId) => {
  const sql = `
    SELECT r.*, rc.category_name
    FROM rooms r
    LEFT JOIN room_categories rc ON r.room_category_id = rc.id
    WHERE r.property_id = $1
    AND r.housekeeping_status = 'INSPECTED'
    AND r.is_active = true
    ORDER BY r.floor_number, r.room_number
  `;

  const result = await query(sql, [propertyId]);
  return result.rows;
};

/**
 * Create housekeeping task
 * @param {Object} taskData - Task data
 * @returns {Promise<Object>}
 */
const createTask = async (taskData) => {
  const sql = `
    INSERT INTO housekeeping_tasks (
      property_id, room_id, task_type, priority, assigned_to,
      status, scheduled_date, completed_at, notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8)
    RETURNING *
  `;

  const values = [
    taskData.property_id,
    taskData.room_id,
    taskData.task_type,
    taskData.priority || 'NORMAL',
    taskData.assigned_to || null,
    taskData.status || 'PENDING',
    taskData.scheduled_date || new Date().toISOString().split('T')[0],
    taskData.notes || null,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Get housekeeping tasks by property
 * @param {string} propertyId - Property ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
const getTasksByProperty = async (propertyId, { status = 'PENDING', limit = 50 } = {}) => {
  let sql = `
    SELECT ht.*, r.room_number, rc.category_name, u.first_name as staff_name
    FROM housekeeping_tasks ht
    LEFT JOIN rooms r ON ht.room_id = r.id
    LEFT JOIN room_categories rc ON r.room_category_id = rc.id
    LEFT JOIN users u ON ht.assigned_to = u.id
    WHERE ht.property_id = $1
  `;

  const values = [propertyId];
  let paramCount = 2;

  if (status) {
    sql += ` AND ht.status = $${paramCount}`;
    values.push(status);
    paramCount++;
  }

  sql += ` ORDER BY ht.priority DESC, ht.scheduled_date ASC LIMIT $${paramCount}`;
  values.push(limit);

  const result = await query(sql, values);
  return result.rows;
};

/**
 * Assign task to staff
 * @param {string} taskId - Task ID
 * @param {string} staffId - Staff user ID
 * @returns {Promise<Object>}
 */
const assignTask = async (taskId, staffId) => {
  const sql = `
    UPDATE housekeeping_tasks
    SET assigned_to = $1, status = 'ASSIGNED', updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;

  const result = await query(sql, [staffId, taskId]);
  return result.rows[0];
};

/**
 * Start cleaning room
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const startCleaning = async (roomId) => {
  const sql = `
    UPDATE rooms
    SET housekeeping_status = 'CLEANING_IN_PROGRESS', updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await query(sql, [roomId]);
  return result.rows[0];
};

/**
 * Complete cleaning and mark for inspection
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const completeCleaning = async (roomId) => {
  const sql = `
    UPDATE rooms
    SET housekeeping_status = 'CLEANING_IN_PROGRESS', updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await query(sql, [roomId]);
  return result.rows[0];
};

/**
 * Inspect and approve room
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const inspectAndApproveRoom = async (roomId) => {
  const sql = `
    UPDATE rooms
    SET housekeeping_status = 'INSPECTED', updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await query(sql, [roomId]);
  return result.rows[0];
};

/**
 * Mark room as clean
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const markRoomClean = async (roomId) => {
  const sql = `
    UPDATE rooms
    SET housekeeping_status = 'CLEAN', operational_status = 'AVAILABLE', updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await query(sql, [roomId]);
  return result.rows[0];
};

/**
 * Get housekeeping statistics for property
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>}
 */
const getStats = async (propertyId) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM rooms WHERE property_id = $1 AND housekeeping_status = 'DIRTY') as rooms_dirty,
      (SELECT COUNT(*) FROM rooms WHERE property_id = $1 AND housekeeping_status = 'CLEANING_IN_PROGRESS') as rooms_cleaning,
      (SELECT COUNT(*) FROM rooms WHERE property_id = $1 AND housekeeping_status = 'INSPECTED') as rooms_inspected,
      (SELECT COUNT(*) FROM rooms WHERE property_id = $1 AND housekeeping_status = 'CLEAN') as rooms_clean,
      (SELECT COUNT(*) FROM housekeeping_tasks WHERE property_id = $1 AND status = 'PENDING') as pending_tasks,
      (SELECT COUNT(*) FROM housekeeping_tasks WHERE property_id = $1 AND status = 'ASSIGNED') as assigned_tasks,
      (SELECT COUNT(*) FROM housekeeping_tasks WHERE property_id = $1 AND status = 'COMPLETED') as completed_tasks
  `;

  const result = await query(sql, [propertyId]);
  return result.rows[0];
};

export const housekeepingRepository = {
  getRoomsNeedingCleaning,
  getRoomsForInspection,
  getCleanedRooms,
  createTask,
  getTasksByProperty,
  assignTask,
  startCleaning,
  completeCleaning,
  inspectAndApproveRoom,
  markRoomClean,
  getStats,
};
