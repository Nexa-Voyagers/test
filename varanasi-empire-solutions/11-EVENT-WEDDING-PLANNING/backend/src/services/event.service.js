import eventRepository from '../repositories/event.repository.js';
import eventVendorRepository from '../repositories/event-vendor.repository.js';
import { ValidationError, AppError } from '../utils/errors.js';

/**
 * Service for event business logic
 */
class EventService {
  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Created event
   */
  async createEvent(eventData) {
    // Validate required fields
    const errors = this.validateEventData(eventData);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    // Generate event number if not provided
    if (!eventData.event_number) {
      const prefix = eventData.event_type === 'WEDDING' ? 'WED' : 'EVT';
      eventData.event_number = await eventRepository.generateEventNumber(prefix);
    }

    // Set default estimated_cost if not provided
    if (!eventData.estimated_cost && eventData.total_budget) {
      eventData.estimated_cost = eventData.total_budget;
    }

    return await eventRepository.create(eventData);
  }

  /**
   * Get all events with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of events
   */
  async getEvents(filters = {}) {
    return await eventRepository.findAll(filters);
  }

  /**
   * Get event by ID with related data
   * @param {string} id - Event ID
   * @returns {Promise<Object>} Event data
   */
  async getEventById(id) {
    return await eventRepository.findById(id);
  }

  /**
   * Get complete event details with all related data
   * @param {string} id - Event ID
   * @returns {Promise<Object>} Complete event details
   */
  async getCompleteEventDetails(id) {
    const event = await eventRepository.findById(id);
    const budgetSummary = await eventRepository.getBudgetSummary(id);
    const vendorSummary = await eventVendorRepository.getEventVendorSummary(id);

    return {
      ...event,
      budget_summary: budgetSummary,
      vendor_summary: vendorSummary,
    };
  }

  /**
   * Update event
   * @param {string} id - Event ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated event
   */
  async updateEvent(id, updateData) {
    // Validate dates if provided
    if (updateData.event_date && new Date(updateData.event_date) < new Date()) {
      throw new ValidationError([{ field: 'event_date', message: 'Event date cannot be in the past' }]);
    }

    // Validate budget constraints
    if (updateData.estimated_cost && updateData.total_budget) {
      if (parseFloat(updateData.estimated_cost) > parseFloat(updateData.total_budget)) {
        throw new ValidationError([{ field: 'estimated_cost', message: 'Estimated cost cannot exceed total budget' }]);
      }
    }

    return await eventRepository.update(id, updateData);
  }

  /**
   * Update event status with validation
   * @param {string} id - Event ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated event
   */
  async updateEventStatus(id, status) {
    const event = await eventRepository.findById(id);

    // Validate status transition
    const validTransitions = this.getValidStatusTransitions(event.event_status);
    if (!validTransitions.includes(status)) {
      throw new AppError(
        `Cannot transition from ${event.event_status} to ${status}. Valid transitions: ${validTransitions.join(', ')}`,
        400
      );
    }

    return await eventRepository.updateStatus(id, status);
  }

  /**
   * Get valid status transitions
   * @param {string} currentStatus - Current status
   * @returns {Array} Valid next statuses
   */
  getValidStatusTransitions(currentStatus) {
    const transitions = {
      PLANNING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    return transitions[currentStatus] || [];
  }

  /**
   * Calculate and update actual cost from vendor bookings
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Updated event with cost
   */
  async recalculateEventCost(eventId) {
    const actualCost = await eventRepository.updateActualCost(eventId);
    const event = await eventRepository.findById(eventId);

    // Check for budget alerts
    if (actualCost > event.estimated_cost) {
      const overrun = actualCost - event.estimated_cost;
      const percentage = ((overrun / event.estimated_cost) * 100).toFixed(2);

      return {
        ...event,
        budget_alert: {
          type: 'OVER_BUDGET',
          message: `Event is over budget by ${overrun.toFixed(2)} (${percentage}%)`,
          overrun_amount: overrun,
          overrun_percentage: percentage,
        },
      };
    }

    return event;
  }

  /**
   * Get event budget summary with alerts
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Budget summary
   */
  async getEventBudgetSummary(eventId) {
    const summary = await eventRepository.getBudgetSummary(eventId);

    // Add budget alerts
    if (summary.actual_cost > summary.estimated_cost) {
      summary.alert = {
        type: 'OVER_BUDGET',
        severity: 'HIGH',
        message: 'Event costs exceed estimated budget',
      };
    } else if (summary.budget_utilization_percentage > 90) {
      summary.alert = {
        type: 'NEAR_BUDGET_LIMIT',
        severity: 'MEDIUM',
        message: 'Event is approaching budget limit',
      };
    }

    return summary;
  }

  /**
   * Get events with budget alerts
   * @param {string} companyId - Company ID
   * @returns {Promise<Array>} Events exceeding budget
   */
  async getEventsWithBudgetAlerts(companyId = null) {
    return await eventRepository.getEventsWithBudgetAlerts(companyId);
  }

  /**
   * Get upcoming events
   * @param {number} days - Number of days to look ahead
   * @param {string} companyId - Company ID
   * @returns {Promise<Array>} Upcoming events
   */
  async getUpcomingEvents(days = 30, companyId = null) {
    return await eventRepository.getUpcomingEvents(days, companyId);
  }

  /**
   * Delete event
   * @param {string} id - Event ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteEvent(id) {
    return await eventRepository.delete(id);
  }

  /**
   * Get event statistics by status
   * @param {string} companyId - Company ID
   * @returns {Promise<Object>} Status statistics
   */
  async getEventStatusStatistics(companyId = null) {
    return await eventRepository.getStatusStatistics(companyId);
  }

  /**
   * Validate event data
   * @param {Object} eventData - Event data
   * @returns {Array} Validation errors
   */
  validateEventData(eventData) {
    const errors = [];

    if (!eventData.event_name || eventData.event_name.trim() === '') {
      errors.push({ field: 'event_name', message: 'Event name is required' });
    }

    if (!eventData.event_date) {
      errors.push({ field: 'event_date', message: 'Event date is required' });
    } else if (new Date(eventData.event_date) < new Date()) {
      errors.push({ field: 'event_date', message: 'Event date cannot be in the past' });
    }

    if (!eventData.client_id) {
      errors.push({ field: 'client_id', message: 'Client is required' });
    }

    if (eventData.estimated_cost && eventData.total_budget) {
      if (parseFloat(eventData.estimated_cost) > parseFloat(eventData.total_budget)) {
        errors.push({ field: 'estimated_cost', message: 'Estimated cost cannot exceed total budget' });
      }
    }

    // Wedding-specific validations
    if (eventData.event_type === 'WEDDING') {
      if (!eventData.bride_name && !eventData.groom_name) {
        errors.push({ field: 'wedding_details', message: 'Bride or Groom name is required for wedding events' });
      }
    }

    return errors;
  }

  /**
   * Check event readiness
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Readiness status
   */
  async checkEventReadiness(eventId) {
    const event = await eventRepository.findById(eventId);
    const vendorSummary = await eventVendorRepository.getEventVendorSummary(eventId);

    const readiness = {
      ready: true,
      checks: [],
    };

    // Check if vendors are booked
    if (vendorSummary.total_vendors === 0) {
      readiness.ready = false;
      readiness.checks.push({
        type: 'VENDORS',
        status: 'INCOMPLETE',
        message: 'No vendors booked for this event',
      });
    } else if (vendorSummary.pending_vendors > 0) {
      readiness.checks.push({
        type: 'VENDOR_PAYMENTS',
        status: 'WARNING',
        message: `${vendorSummary.pending_vendors} vendor(s) have pending payments`,
      });
    }

    // Check budget
    if (!event.total_budget || event.total_budget === 0) {
      readiness.ready = false;
      readiness.checks.push({
        type: 'BUDGET',
        status: 'INCOMPLETE',
        message: 'Event budget not defined',
      });
    }

    // Check venue
    if (!event.venue_name) {
      readiness.ready = false;
      readiness.checks.push({
        type: 'VENUE',
        status: 'INCOMPLETE',
        message: 'Event venue not specified',
      });
    }

    return readiness;
  }
}

export default new EventService();
