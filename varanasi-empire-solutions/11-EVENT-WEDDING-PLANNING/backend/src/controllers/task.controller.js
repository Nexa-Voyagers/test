import taskService from '../services/task.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for task endpoints
 */
class TaskController {
  /**
   * @route   POST /api/tasks
   * @desc    Create a new task
   * @access  Private
   */
  createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.body);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  });

  /**
   * @route   POST /api/tasks/bulk
   * @desc    Create multiple tasks in bulk
   * @access  Private
   */
  createBulkTasks = asyncHandler(async (req, res) => {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: 'Tasks array is required',
      });
    }

    const createdTasks = await taskService.createBulkTasks(tasks);

    res.status(201).json({
      success: true,
      message: `${createdTasks.length} tasks created successfully`,
      data: createdTasks,
    });
  });

  /**
   * @route   POST /api/tasks/wedding-checklist
   * @desc    Generate default wedding checklist
   * @access  Private
   */
  generateWeddingChecklist = asyncHandler(async (req, res) => {
    const { event_id, event_date } = req.body;

    if (!event_id || !event_date) {
      return res.status(400).json({
        success: false,
        message: 'Event ID and event date are required',
      });
    }

    const tasks = await taskService.generateWeddingChecklist(event_id, event_date);

    res.status(201).json({
      success: true,
      message: 'Wedding checklist generated successfully',
      data: tasks,
    });
  });

  /**
   * @route   GET /api/tasks
   * @desc    Get all tasks with filters
   * @access  Private
   */
  getTasks = asyncHandler(async (req, res) => {
    const filters = {
      event_id: req.query.event_id,
      task_status: req.query.task_status,
      priority: req.query.priority,
      task_category: req.query.task_category,
      assigned_to: req.query.assigned_to,
      overdue: req.query.overdue === 'true',
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    };

    const tasks = await taskService.getTasks(filters);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  });

  /**
   * @route   GET /api/tasks/overdue
   * @desc    Get overdue tasks
   * @access  Private
   */
  getOverdueTasks = asyncHandler(async (req, res) => {
    const { event_id } = req.query;
    const tasks = await taskService.getOverdueTasks(event_id);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  });

  /**
   * @route   GET /api/tasks/due-soon
   * @desc    Get tasks due soon
   * @access  Private
   */
  getTasksDueSoon = asyncHandler(async (req, res) => {
    const days = req.query.days ? parseInt(req.query.days) : 7;
    const { event_id } = req.query;

    const tasks = await taskService.getTasksDueSoon(days, event_id);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  });

  /**
   * @route   GET /api/tasks/:id
   * @desc    Get task by ID
   * @access  Private
   */
  getTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);

    res.json({
      success: true,
      data: task,
    });
  });

  /**
   * @route   GET /api/tasks/event/:eventId
   * @desc    Get tasks for an event
   * @access  Private
   */
  getEventTasks = asyncHandler(async (req, res) => {
    const tasks = await taskService.getEventTasks(req.params.eventId);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  });

  /**
   * @route   GET /api/tasks/event/:eventId/statistics
   * @desc    Get event task statistics
   * @access  Private
   */
  getEventTaskStatistics = asyncHandler(async (req, res) => {
    const statistics = await taskService.getEventTaskStatistics(req.params.eventId);

    res.json({
      success: true,
      data: statistics,
    });
  });

  /**
   * @route   GET /api/tasks/event/:eventId/by-category
   * @desc    Get tasks grouped by category
   * @access  Private
   */
  getTasksByCategory = asyncHandler(async (req, res) => {
    const tasks = await taskService.getTasksByCategory(req.params.eventId);

    res.json({
      success: true,
      data: tasks,
    });
  });

  /**
   * @route   GET /api/tasks/event/:eventId/by-priority
   * @desc    Get tasks grouped by priority
   * @access  Private
   */
  getTasksByPriority = asyncHandler(async (req, res) => {
    const tasks = await taskService.getTasksByPriority(req.params.eventId);

    res.json({
      success: true,
      data: tasks,
    });
  });

  /**
   * @route   GET /api/tasks/assignee/:assignedTo
   * @desc    Get tasks assigned to a person
   * @access  Private
   */
  getTasksByAssignee = asyncHandler(async (req, res) => {
    const tasks = await taskService.getTasksByAssignee(req.params.assignedTo);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  });

  /**
   * @route   PUT /api/tasks/:id
   * @desc    Update task
   * @access  Private
   */
  updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  });

  /**
   * @route   PUT /api/tasks/:id/status
   * @desc    Update task status
   * @access  Private
   */
  updateTaskStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const task = await taskService.updateTaskStatus(req.params.id, status);

    res.json({
      success: true,
      message: 'Task status updated successfully',
      data: task,
    });
  });

  /**
   * @route   PUT /api/tasks/:id/complete
   * @desc    Mark task as completed
   * @access  Private
   */
  completeTask = asyncHandler(async (req, res) => {
    const task = await taskService.completeTask(req.params.id);

    res.json({
      success: true,
      message: 'Task completed successfully',
      data: task,
    });
  });

  /**
   * @route   DELETE /api/tasks/:id
   * @desc    Delete task
   * @access  Private
   */
  deleteTask = asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  });
}

export default new TaskController();
