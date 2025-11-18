import guestRepository from '../repositories/guest.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Service for event guest business logic
 */
class GuestService {
  /**
   * Create a new guest
   * @param {Object} guestData - Guest data
   * @returns {Promise<Object>} Created guest
   */
  async createGuest(guestData) {
    // Validate required fields
    const errors = this.validateGuestData(guestData);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    return await guestRepository.create(guestData);
  }

  /**
   * Create multiple guests in bulk
   * @param {Array} guests - Array of guest data
   * @returns {Promise<Array>} Created guests
   */
  async createBulkGuests(guests) {
    // Validate each guest
    for (const guest of guests) {
      const errors = this.validateGuestData(guest);
      if (errors.length > 0) {
        throw new ValidationError(errors);
      }
    }

    return await guestRepository.createBulk(guests);
  }

  /**
   * Get all guests with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of guests
   */
  async getGuests(filters = {}) {
    return await guestRepository.findAll(filters);
  }

  /**
   * Get guest by ID
   * @param {string} id - Guest ID
   * @returns {Promise<Object>} Guest data
   */
  async getGuestById(id) {
    return await guestRepository.findById(id);
  }

  /**
   * Get guests for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Event guests
   */
  async getEventGuests(eventId) {
    return await guestRepository.findByEventId(eventId);
  }

  /**
   * Get guests by RSVP status
   * @param {string} eventId - Event ID
   * @param {string} rsvpStatus - RSVP status
   * @returns {Promise<Array>} Guests by RSVP status
   */
  async getGuestsByRSVPStatus(eventId, rsvpStatus) {
    return await guestRepository.getGuestsByRSVPStatus(eventId, rsvpStatus);
  }

  /**
   * Get guests by category
   * @param {string} eventId - Event ID
   * @param {string} category - Guest category
   * @returns {Promise<Array>} Guests by category
   */
  async getGuestsByCategory(eventId, category) {
    return await guestRepository.getGuestsByCategory(eventId, category);
  }

  /**
   * Get guests without invitations
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Guests without invitations
   */
  async getGuestsWithoutInvitations(eventId) {
    return await guestRepository.getGuestsWithoutInvitations(eventId);
  }

  /**
   * Get guests with pending RSVP
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Guests with pending RSVP
   */
  async getGuestsWithPendingRSVP(eventId) {
    return await guestRepository.getGuestsWithPendingRSVP(eventId);
  }

  /**
   * Update guest
   * @param {string} id - Guest ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated guest
   */
  async updateGuest(id, updateData) {
    // Validate email if provided
    if (updateData.guest_email && !this.isValidEmail(updateData.guest_email)) {
      throw new ValidationError([{ field: 'guest_email', message: 'Invalid email format' }]);
    }

    // Validate number of attendees
    if (updateData.number_of_attendees !== undefined) {
      const attendees = parseInt(updateData.number_of_attendees);
      if (attendees < 1) {
        throw new ValidationError([{
          field: 'number_of_attendees',
          message: 'Number of attendees must be at least 1',
        }]);
      }
    }

    return await guestRepository.update(id, updateData);
  }

  /**
   * Update RSVP status
   * @param {string} id - Guest ID
   * @param {string} rsvpStatus - RSVP status
   * @returns {Promise<Object>} Updated guest
   */
  async updateRSVPStatus(id, rsvpStatus) {
    return await guestRepository.updateRSVPStatus(id, rsvpStatus);
  }

  /**
   * Mark invitation as sent
   * @param {string} id - Guest ID
   * @returns {Promise<Object>} Updated guest
   */
  async markInvitationSent(id) {
    return await guestRepository.markInvitationSent(id);
  }

  /**
   * Mark multiple invitations as sent
   * @param {Array} guestIds - Array of guest IDs
   * @returns {Promise<number>} Number of updated guests
   */
  async markMultipleInvitationsSent(guestIds) {
    if (!Array.isArray(guestIds) || guestIds.length === 0) {
      throw new ValidationError([{
        field: 'guest_ids',
        message: 'Guest IDs array is required',
      }]);
    }

    return await guestRepository.markMultipleInvitationsSent(guestIds);
  }

  /**
   * Delete guest
   * @param {string} id - Guest ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteGuest(id) {
    return await guestRepository.delete(id);
  }

  /**
   * Get event guest statistics
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Guest statistics
   */
  async getEventGuestStatistics(eventId) {
    const stats = await guestRepository.getEventGuestStatistics(eventId);
    const responseRate = await guestRepository.getRSVPResponseRate(eventId);

    return {
      ...stats,
      response_rate: responseRate,
    };
  }

  /**
   * Get statistics by category
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Statistics by category
   */
  async getStatisticsByCategory(eventId) {
    return await guestRepository.getStatisticsByCategory(eventId);
  }

  /**
   * Get guests with special requirements
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Guests with special requirements
   */
  async getGuestsWithSpecialRequirements(eventId) {
    return await guestRepository.getGuestsWithSpecialRequirements(eventId);
  }

  /**
   * Search guests
   * @param {string} eventId - Event ID
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching guests
   */
  async searchGuests(eventId, searchTerm) {
    return await guestRepository.searchGuests(eventId, searchTerm);
  }

  /**
   * Calculate total confirmed attendees
   * @param {string} eventId - Event ID
   * @returns {Promise<number>} Total confirmed attendees
   */
  async getConfirmedAttendeesCount(eventId) {
    const stats = await guestRepository.getEventGuestStatistics(eventId);
    return parseInt(stats.confirmed_attendees || 0);
  }

  /**
   * Import guests from CSV data
   * @param {string} eventId - Event ID
   * @param {Array} csvData - Array of guest objects from CSV
   * @returns {Promise<Object>} Import results
   */
  async importGuestsFromCSV(eventId, csvData) {
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < csvData.length; i++) {
      const guestData = { ...csvData[i], event_id: eventId };

      try {
        const errors = this.validateGuestData(guestData);
        if (errors.length > 0) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            errors,
          });
          continue;
        }

        await guestRepository.create(guestData);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Validate guest data
   * @param {Object} guestData - Guest data
   * @returns {Array} Validation errors
   */
  validateGuestData(guestData) {
    const errors = [];

    if (!guestData.event_id) {
      errors.push({ field: 'event_id', message: 'Event is required' });
    }

    if (!guestData.guest_name || guestData.guest_name.trim() === '') {
      errors.push({ field: 'guest_name', message: 'Guest name is required' });
    }

    if (guestData.guest_email && !this.isValidEmail(guestData.guest_email)) {
      errors.push({ field: 'guest_email', message: 'Invalid email format' });
    }

    if (guestData.number_of_attendees !== undefined) {
      const attendees = parseInt(guestData.number_of_attendees);
      if (isNaN(attendees) || attendees < 1) {
        errors.push({
          field: 'number_of_attendees',
          message: 'Number of attendees must be at least 1',
        });
      }
    }

    return errors;
  }

  /**
   * Validate email format
   * @param {string} email - Email address
   * @returns {boolean} Valid status
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default new GuestService();
