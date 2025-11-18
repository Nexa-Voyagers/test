import eventService from '../services/event.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for event endpoints
 */
class EventController {
  /**
   * @route   POST /api/events
   * @desc    Create a new event
   * @access  Private
   */
  createEvent = asyncHandler(async (req, res) => {
    const event = await eventService.createEvent(req.body);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  });

  /**
   * @route   GET /api/events
   * @desc    Get all events with optional filters
   * @access  Private
   */
  getEvents = asyncHandler(async (req, res) => {
    const filters = {
      company_id: req.query.company_id,
      client_id: req.query.client_id,
      event_type: req.query.event_type,
      event_status: req.query.event_status,
      venue_city: req.query.venue_city,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      search: req.query.search,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    };

    const events = await eventService.getEvents(filters);

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  });

  /**
   * @route   GET /api/events/:id
   * @desc    Get event by ID
   * @access  Private
   */
  getEventById = asyncHandler(async (req, res) => {
    const event = await eventService.getEventById(req.params.id);

    res.json({
      success: true,
      data: event,
    });
  });

  /**
   * @route   GET /api/events/:id/details
   * @desc    Get complete event details with all related data
   * @access  Private
   */
  getEventDetails = asyncHandler(async (req, res) => {
    const eventDetails = await eventService.getCompleteEventDetails(req.params.id);

    res.json({
      success: true,
      data: eventDetails,
    });
  });

  /**
   * @route   GET /api/events/:id/budget
   * @desc    Get event budget summary with alerts
   * @access  Private
   */
  getEventBudget = asyncHandler(async (req, res) => {
    const budgetSummary = await eventService.getEventBudgetSummary(req.params.id);

    res.json({
      success: true,
      data: budgetSummary,
    });
  });

  /**
   * @route   GET /api/events/budget-alerts
   * @desc    Get events with budget alerts
   * @access  Private
   */
  getBudgetAlerts = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const events = await eventService.getEventsWithBudgetAlerts(company_id);

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  });

  /**
   * @route   GET /api/events/upcoming
   * @desc    Get upcoming events
   * @access  Private
   */
  getUpcomingEvents = asyncHandler(async (req, res) => {
    const days = req.query.days ? parseInt(req.query.days) : 30;
    const { company_id } = req.query;

    const events = await eventService.getUpcomingEvents(days, company_id);

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  });

  /**
   * @route   PUT /api/events/:id
   * @desc    Update event
   * @access  Private
   */
  updateEvent = asyncHandler(async (req, res) => {
    const event = await eventService.updateEvent(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  });

  /**
   * @route   PUT /api/events/:id/status
   * @desc    Update event status
   * @access  Private
   */
  updateEventStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const event = await eventService.updateEventStatus(req.params.id, status);

    res.json({
      success: true,
      message: 'Event status updated successfully',
      data: event,
    });
  });

  /**
   * @route   PUT /api/events/:id/recalculate-cost
   * @desc    Recalculate event actual cost from vendor bookings
   * @access  Private
   */
  recalculateEventCost = asyncHandler(async (req, res) => {
    const event = await eventService.recalculateEventCost(req.params.id);

    res.json({
      success: true,
      message: 'Event cost recalculated successfully',
      data: event,
    });
  });

  /**
   * @route   GET /api/events/:id/readiness
   * @desc    Check event readiness
   * @access  Private
   */
  checkEventReadiness = asyncHandler(async (req, res) => {
    const readiness = await eventService.checkEventReadiness(req.params.id);

    res.json({
      success: true,
      data: readiness,
    });
  });

  /**
   * @route   DELETE /api/events/:id
   * @desc    Delete event
   * @access  Private
   */
  deleteEvent = asyncHandler(async (req, res) => {
    await eventService.deleteEvent(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  });

  /**
   * @route   GET /api/events/statistics/status
   * @desc    Get event statistics by status
   * @access  Private
   */
  getStatusStatistics = asyncHandler(async (req, res) => {
    const { company_id } = req.query;
    const statistics = await eventService.getEventStatusStatistics(company_id);

    res.json({
      success: true,
      data: statistics,
    });
  });
}

export default new EventController();
