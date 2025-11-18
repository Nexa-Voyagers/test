import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Repository for event_tasks table
 * Handles all database operations for event task management
 */
class TaskRepository {
  /**
   * Create a new event task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task
   */
  async create(taskData) {
    const {
      event_id,
      task_name,
      task_category,
      due_date,
      assigned_to,
      priority,
      task_status,
    } = taskData;

    const query = `
      INSERT INTO event_tasks (
        event_id, task_name, task_category, due_date,
        assigned_to, priority, task_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      event_id,
      task_name,
      task_category,
      due_date,
      assigned_to,
      priority || 'MEDIUM',
      task_status || 'PENDING',
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Create multiple tasks in bulk
   * @param {Array} tasks - Array of task data
   * @returns {Promise<Array>} Created tasks
   */
  async createBulk(tasks) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const createdTasks = [];
      for (const taskData of tasks) {
        const query = `
          INSERT INTO event_tasks (
            event_id, task_name, task_category, due_date,
            assigned_to, priority, task_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;

        const values = [
          taskData.event_id,
          taskData.task_name,
          taskData.task_category,
          taskData.due_date,
          taskData.assigned_to,
          taskData.priority || 'MEDIUM',
          taskData.task_status || 'PENDING',
        ];

        const result = await client.query(query, values);
        createdTasks.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return createdTasks;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Find all tasks with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of tasks
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        et.*,
        e.event_number,
        e.event_name,
        e.event_date,
        e.event_status
      FROM event_tasks et
      JOIN events e ON et.event_id = e.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.event_id) {
      query += ` AND et.event_id = $${paramCount}`;
      values.push(filters.event_id);
      paramCount++;
    }

    if (filters.task_status) {
      query += ` AND et.task_status = $${paramCount}`;
      values.push(filters.task_status);
      paramCount++;
    }

    if (filters.priority) {
      query += ` AND et.priority = $${paramCount}`;
      values.push(filters.priority);
      paramCount++;
    }

    if (filters.task_category) {
      query += ` AND et.task_category = $${paramCount}`;
      values.push(filters.task_category);
      paramCount++;
    }

    if (filters.assigned_to) {
      query += ` AND et.assigned_to ILIKE $${paramCount}`;
      values.push(`%${filters.assigned_to}%`);
      paramCount++;
    }

    if (filters.overdue) {
      query += ` AND et.due_date < CURRENT_DATE AND et.task_status != 'COMPLETED'`;
    }

    query += ' ORDER BY et.due_date ASC, et.priority DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Task data
   */
  async findById(id) {
    const query = `
      SELECT
        et.*,
        e.event_number,
        e.event_name,
        e.event_date,
        e.event_status
      FROM event_tasks et
      JOIN events e ON et.event_id = e.id
      WHERE et.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Task');
    }

    return result.rows[0];
  }

  /**
   * Find tasks by event ID
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} List of tasks
   */
  async findByEventId(eventId) {
    const query = `
      SELECT * FROM event_tasks
      WHERE event_id = $1
      ORDER BY
        CASE priority
          WHEN 'HIGH' THEN 1
          WHEN 'MEDIUM' THEN 2
          WHEN 'LOW' THEN 3
        END,
        due_date ASC
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Get overdue tasks
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Array>} Overdue tasks
   */
  async getOverdueTasks(eventId = null) {
    let query = `
      SELECT
        et.*,
        e.event_number,
        e.event_name,
        e.event_date,
        CURRENT_DATE - et.due_date as days_overdue
      FROM event_tasks et
      JOIN events e ON et.event_id = e.id
      WHERE et.due_date < CURRENT_DATE
        AND et.task_status != 'COMPLETED'
    `;

    const values = [];
    if (eventId) {
      query += ' AND et.event_id = $1';
      values.push(eventId);
    }

    query += ' ORDER BY days_overdue DESC, et.priority DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get tasks due soon (within specified days)
   * @param {number} days - Number of days to look ahead
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Array>} Tasks due soon
   */
  async getTasksDueSoon(days = 7, eventId = null) {
    let query = `
      SELECT
        et.*,
        e.event_number,
        e.event_name,
        e.event_date,
        et.due_date - CURRENT_DATE as days_until_due
      FROM event_tasks et
      JOIN events e ON et.event_id = e.id
      WHERE et.due_date >= CURRENT_DATE
        AND et.due_date <= CURRENT_DATE + $1
        AND et.task_status != 'COMPLETED'
    `;

    const values = [days];
    if (eventId) {
      query += ' AND et.event_id = $2';
      values.push(eventId);
    }

    query += ' ORDER BY et.due_date ASC, et.priority DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update task
   * @param {string} id - Task ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated task
   */
  async update(id, updateData) {
    const allowedFields = [
      'task_name',
      'task_category',
      'due_date',
      'assigned_to',
      'priority',
      'task_status',
    ];

    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE event_tasks
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Task');
    }

    return result.rows[0];
  }

  /**
   * Update task status
   * @param {string} id - Task ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated task
   */
  async updateStatus(id, status) {
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const query = `
      UPDATE event_tasks
      SET task_status = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Task');
    }

    return result.rows[0];
  }

  /**
   * Mark task as completed
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Updated task
   */
  async markAsCompleted(id) {
    return this.updateStatus(id, 'COMPLETED');
  }

  /**
   * Delete task
   * @param {string} id - Task ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM event_tasks WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Task');
    }

    return true;
  }

  /**
   * Get event task statistics
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Task statistics
   */
  async getEventTaskStatistics(eventId) {
    const query = `
      SELECT
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN task_status = 'COMPLETED' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN task_status = 'IN_PROGRESS' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN task_status = 'PENDING' THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN due_date < CURRENT_DATE AND task_status != 'COMPLETED' THEN 1 END) as overdue_tasks,
        COUNT(CASE WHEN priority = 'HIGH' THEN 1 END) as high_priority_tasks,
        CASE
          WHEN COUNT(*) > 0 THEN
            ROUND((COUNT(CASE WHEN task_status = 'COMPLETED' THEN 1 END)::numeric / COUNT(*)::numeric * 100), 2)
          ELSE 0
        END as completion_percentage
      FROM event_tasks
      WHERE event_id = $1
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows[0] || {
      total_tasks: 0,
      completed_tasks: 0,
      in_progress_tasks: 0,
      pending_tasks: 0,
      overdue_tasks: 0,
      high_priority_tasks: 0,
      completion_percentage: 0,
    };
  }

  /**
   * Get tasks grouped by category
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Tasks grouped by category
   */
  async getTasksByCategory(eventId) {
    const query = `
      SELECT
        task_category,
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN task_status = 'COMPLETED' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN task_status = 'PENDING' THEN 1 END) as pending_tasks
      FROM event_tasks
      WHERE event_id = $1
      GROUP BY task_category
      ORDER BY task_category
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Get tasks grouped by priority
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Tasks grouped by priority
   */
  async getTasksByPriority(eventId) {
    const query = `
      SELECT
        priority,
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN task_status = 'COMPLETED' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN due_date < CURRENT_DATE AND task_status != 'COMPLETED' THEN 1 END) as overdue_tasks
      FROM event_tasks
      WHERE event_id = $1
      GROUP BY priority
      ORDER BY
        CASE priority
          WHEN 'HIGH' THEN 1
          WHEN 'MEDIUM' THEN 2
          WHEN 'LOW' THEN 3
        END
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Get tasks assigned to a person
   * @param {string} assignedTo - Person name
   * @returns {Promise<Array>} Assigned tasks
   */
  async getTasksByAssignee(assignedTo) {
    const query = `
      SELECT
        et.*,
        e.event_number,
        e.event_name,
        e.event_date
      FROM event_tasks et
      JOIN events e ON et.event_id = e.id
      WHERE et.assigned_to ILIKE $1
        AND et.task_status != 'COMPLETED'
      ORDER BY et.due_date ASC, et.priority DESC
    `;

    const result = await pool.query(query, [`%${assignedTo}%`]);
    return result.rows;
  }

  /**
   * Check if task exists
   * @param {string} id - Task ID
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id) {
    const query = 'SELECT 1 FROM event_tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Calculate task priority based on due date
   * @param {string} dueDate - Due date
   * @returns {string} Suggested priority
   */
  calculatePriority(dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0 || daysUntilDue <= 3) {
      return 'HIGH';
    } else if (daysUntilDue <= 7) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }
}

export default new TaskRepository();
