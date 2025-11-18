import taskRepository from '../repositories/task.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Service for event task business logic
 */
class TaskService {
  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task
   */
  async createTask(taskData) {
    // Validate required fields
    const errors = this.validateTaskData(taskData);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    // Auto-calculate priority based on due date if not provided
    if (!taskData.priority && taskData.due_date) {
      taskData.priority = taskRepository.calculatePriority(taskData.due_date);
    }

    return await taskRepository.create(taskData);
  }

  /**
   * Create multiple tasks in bulk
   * @param {Array} tasks - Array of task data
   * @returns {Promise<Array>} Created tasks
   */
  async createBulkTasks(tasks) {
    // Validate each task
    for (const task of tasks) {
      const errors = this.validateTaskData(task);
      if (errors.length > 0) {
        throw new ValidationError(errors);
      }

      // Auto-calculate priority
      if (!task.priority && task.due_date) {
        task.priority = taskRepository.calculatePriority(task.due_date);
      }
    }

    return await taskRepository.createBulk(tasks);
  }

  /**
   * Get all tasks with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of tasks
   */
  async getTasks(filters = {}) {
    return await taskRepository.findAll(filters);
  }

  /**
   * Get task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Task data
   */
  async getTaskById(id) {
    return await taskRepository.findById(id);
  }

  /**
   * Get tasks for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Event tasks
   */
  async getEventTasks(eventId) {
    return await taskRepository.findByEventId(eventId);
  }

  /**
   * Get overdue tasks
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Array>} Overdue tasks
   */
  async getOverdueTasks(eventId = null) {
    return await taskRepository.getOverdueTasks(eventId);
  }

  /**
   * Get tasks due soon
   * @param {number} days - Number of days to look ahead
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Array>} Tasks due soon
   */
  async getTasksDueSoon(days = 7, eventId = null) {
    return await taskRepository.getTasksDueSoon(days, eventId);
  }

  /**
   * Update task
   * @param {string} id - Task ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(id, updateData) {
    // Recalculate priority if due date changes
    if (updateData.due_date && !updateData.priority) {
      updateData.priority = taskRepository.calculatePriority(updateData.due_date);
    }

    return await taskRepository.update(id, updateData);
  }

  /**
   * Update task status
   * @param {string} id - Task ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated task
   */
  async updateTaskStatus(id, status) {
    return await taskRepository.updateStatus(id, status);
  }

  /**
   * Mark task as completed
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Updated task
   */
  async completeTask(id) {
    return await taskRepository.markAsCompleted(id);
  }

  /**
   * Delete task
   * @param {string} id - Task ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteTask(id) {
    return await taskRepository.delete(id);
  }

  /**
   * Get event task statistics
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Task statistics
   */
  async getEventTaskStatistics(eventId) {
    return await taskRepository.getEventTaskStatistics(eventId);
  }

  /**
   * Get tasks grouped by category
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Tasks by category
   */
  async getTasksByCategory(eventId) {
    return await taskRepository.getTasksByCategory(eventId);
  }

  /**
   * Get tasks grouped by priority
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Tasks by priority
   */
  async getTasksByPriority(eventId) {
    return await taskRepository.getTasksByPriority(eventId);
  }

  /**
   * Get tasks assigned to a person
   * @param {string} assignedTo - Person name
   * @returns {Promise<Array>} Assigned tasks
   */
  async getTasksByAssignee(assignedTo) {
    return await taskRepository.getTasksByAssignee(assignedTo);
  }

  /**
   * Generate default wedding checklist
   * @param {string} eventId - Event ID
   * @param {string} eventDate - Event date
   * @returns {Promise<Array>} Created tasks
   */
  async generateWeddingChecklist(eventId, eventDate) {
    const weddingDate = new Date(eventDate);
    const tasks = [];

    // 6 months before
    const sixMonthsBefore = new Date(weddingDate);
    sixMonthsBefore.setMonth(sixMonthsBefore.getMonth() - 6);

    tasks.push({
      event_id: eventId,
      task_name: 'Finalize venue booking',
      task_category: 'VENUE',
      due_date: sixMonthsBefore.toISOString().split('T')[0],
      priority: 'HIGH',
    });

    tasks.push({
      event_id: eventId,
      task_name: 'Book photographer/videographer',
      task_category: 'VENDORS',
      due_date: sixMonthsBefore.toISOString().split('T')[0],
      priority: 'HIGH',
    });

    // 3 months before
    const threeMonthsBefore = new Date(weddingDate);
    threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - 3);

    tasks.push({
      event_id: eventId,
      task_name: 'Finalize catering menu',
      task_category: 'CATERING',
      due_date: threeMonthsBefore.toISOString().split('T')[0],
      priority: 'HIGH',
    });

    tasks.push({
      event_id: eventId,
      task_name: 'Send save-the-date cards',
      task_category: 'INVITATIONS',
      due_date: threeMonthsBefore.toISOString().split('T')[0],
      priority: 'MEDIUM',
    });

    // 2 months before
    const twoMonthsBefore = new Date(weddingDate);
    twoMonthsBefore.setMonth(twoMonthsBefore.getMonth() - 2);

    tasks.push({
      event_id: eventId,
      task_name: 'Book decorator',
      task_category: 'DECORATION',
      due_date: twoMonthsBefore.toISOString().split('T')[0],
      priority: 'HIGH',
    });

    // 1 month before
    const oneMonthBefore = new Date(weddingDate);
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);

    tasks.push({
      event_id: eventId,
      task_name: 'Send wedding invitations',
      task_category: 'INVITATIONS',
      due_date: oneMonthBefore.toISOString().split('T')[0],
      priority: 'HIGH',
    });

    tasks.push({
      event_id: eventId,
      task_name: 'Finalize guest list',
      task_category: 'PLANNING',
      due_date: oneMonthBefore.toISOString().split('T')[0],
      priority: 'HIGH',
    });

    // 2 weeks before
    const twoWeeksBefore = new Date(weddingDate);
    twoWeeksBefore.setDate(twoWeeksBefore.getDate() - 14);

    tasks.push({
      event_id: eventId,
      task_name: 'Confirm vendor bookings',
      task_category: 'VENDORS',
      due_date: twoWeeksBefore.toISOString().split('T')[0],
      priority: 'HIGH',
    });

    // 1 week before
    const oneWeekBefore = new Date(weddingDate);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

    tasks.push({
      event_id: eventId,
      task_name: 'Final venue walkthrough',
      task_category: 'VENUE',
      due_date: oneWeekBefore.toISOString().split('T')[0],
      priority: 'HIGH',
    });

    tasks.push({
      event_id: eventId,
      task_name: 'Confirm final headcount',
      task_category: 'CATERING',
      due_date: oneWeekBefore.toISOString().split('T')[0],
      priority: 'HIGH',
    });

    return await this.createBulkTasks(tasks);
  }

  /**
   * Validate task data
   * @param {Object} taskData - Task data
   * @returns {Array} Validation errors
   */
  validateTaskData(taskData) {
    const errors = [];

    if (!taskData.event_id) {
      errors.push({ field: 'event_id', message: 'Event is required' });
    }

    if (!taskData.task_name || taskData.task_name.trim() === '') {
      errors.push({ field: 'task_name', message: 'Task name is required' });
    }

    if (taskData.due_date && new Date(taskData.due_date) < new Date()) {
      errors.push({ field: 'due_date', message: 'Due date cannot be in the past' });
    }

    return errors;
  }
}

export default new TaskService();
