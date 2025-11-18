import guestService from '../services/guest.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for guest endpoints
 */
class GuestController {
  /**
   * @route   POST /api/guests
   * @desc    Create a new guest
   * @access  Private
   */
  createGuest = asyncHandler(async (req, res) => {
    const guest = await guestService.createGuest(req.body);

    res.status(201).json({
      success: true,
      message: 'Guest created successfully',
      data: guest,
    });
  });

  /**
   * @route   POST /api/guests/bulk
   * @desc    Create multiple guests in bulk
   * @access  Private
   */
  createBulkGuests = asyncHandler(async (req, res) => {
    const { guests } = req.body;

    if (!guests || !Array.isArray(guests)) {
      return res.status(400).json({
        success: false,
        message: 'Guests array is required',
      });
    }

    const createdGuests = await guestService.createBulkGuests(guests);

    res.status(201).json({
      success: true,
      message: `${createdGuests.length} guests created successfully`,
      data: createdGuests,
    });
  });

  /**
   * @route   POST /api/guests/import
   * @desc    Import guests from CSV data
   * @access  Private
   */
  importGuestsFromCSV = asyncHandler(async (req, res) => {
    const { event_id, csv_data } = req.body;

    if (!event_id || !csv_data || !Array.isArray(csv_data)) {
      return res.status(400).json({
        success: false,
        message: 'Event ID and CSV data array are required',
      });
    }

    const results = await guestService.importGuestsFromCSV(event_id, csv_data);

    res.json({
      success: true,
      message: `Import completed: ${results.success} successful, ${results.failed} failed`,
      data: results,
    });
  });

  /**
   * @route   GET /api/guests
   * @desc    Get all guests with filters
   * @access  Private
   */
  getGuests = asyncHandler(async (req, res) => {
    const filters = {
      event_id: req.query.event_id,
      guest_category: req.query.guest_category,
      rsvp_status: req.query.rsvp_status,
      invitation_sent: req.query.invitation_sent === 'true' ? true : req.query.invitation_sent === 'false' ? false : undefined,
      search: req.query.search,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    };

    const guests = await guestService.getGuests(filters);

    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  });

  /**
   * @route   GET /api/guests/:id
   * @desc    Get guest by ID
   * @access  Private
   */
  getGuestById = asyncHandler(async (req, res) => {
    const guest = await guestService.getGuestById(req.params.id);

    res.json({
      success: true,
      data: guest,
    });
  });

  /**
   * @route   GET /api/guests/event/:eventId
   * @desc    Get guests for an event
   * @access  Private
   */
  getEventGuests = asyncHandler(async (req, res) => {
    const guests = await guestService.getEventGuests(req.params.eventId);

    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  });

  /**
   * @route   GET /api/guests/event/:eventId/statistics
   * @desc    Get event guest statistics
   * @access  Private
   */
  getEventGuestStatistics = asyncHandler(async (req, res) => {
    const statistics = await guestService.getEventGuestStatistics(req.params.eventId);

    res.json({
      success: true,
      data: statistics,
    });
  });

  /**
   * @route   GET /api/guests/event/:eventId/by-category
   * @desc    Get statistics by category
   * @access  Private
   */
  getStatisticsByCategory = asyncHandler(async (req, res) => {
    const statistics = await guestService.getStatisticsByCategory(req.params.eventId);

    res.json({
      success: true,
      data: statistics,
    });
  });

  /**
   * @route   GET /api/guests/event/:eventId/rsvp/:rsvpStatus
   * @desc    Get guests by RSVP status
   * @access  Private
   */
  getGuestsByRSVPStatus = asyncHandler(async (req, res) => {
    const guests = await guestService.getGuestsByRSVPStatus(
      req.params.eventId,
      req.params.rsvpStatus
    );

    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  });

  /**
   * @route   GET /api/guests/event/:eventId/category/:category
   * @desc    Get guests by category
   * @access  Private
   */
  getGuestsByCategory = asyncHandler(async (req, res) => {
    const guests = await guestService.getGuestsByCategory(
      req.params.eventId,
      req.params.category
    );

    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  });

  /**
   * @route   GET /api/guests/event/:eventId/no-invitation
   * @desc    Get guests without invitations
   * @access  Private
   */
  getGuestsWithoutInvitations = asyncHandler(async (req, res) => {
    const guests = await guestService.getGuestsWithoutInvitations(req.params.eventId);

    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  });

  /**
   * @route   GET /api/guests/event/:eventId/pending-rsvp
   * @desc    Get guests with pending RSVP
   * @access  Private
   */
  getGuestsWithPendingRSVP = asyncHandler(async (req, res) => {
    const guests = await guestService.getGuestsWithPendingRSVP(req.params.eventId);

    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  });

  /**
   * @route   GET /api/guests/event/:eventId/special-requirements
   * @desc    Get guests with special requirements
   * @access  Private
   */
  getGuestsWithSpecialRequirements = asyncHandler(async (req, res) => {
    const guests = await guestService.getGuestsWithSpecialRequirements(req.params.eventId);

    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  });

  /**
   * @route   GET /api/guests/event/:eventId/confirmed-count
   * @desc    Get confirmed attendees count
   * @access  Private
   */
  getConfirmedAttendeesCount = asyncHandler(async (req, res) => {
    const count = await guestService.getConfirmedAttendeesCount(req.params.eventId);

    res.json({
      success: true,
      data: { confirmed_attendees: count },
    });
  });

  /**
   * @route   GET /api/guests/event/:eventId/search
   * @desc    Search guests
   * @access  Private
   */
  searchGuests = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const guests = await guestService.searchGuests(req.params.eventId, q);

    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  });

  /**
   * @route   PUT /api/guests/:id
   * @desc    Update guest
   * @access  Private
   */
  updateGuest = asyncHandler(async (req, res) => {
    const guest = await guestService.updateGuest(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Guest updated successfully',
      data: guest,
    });
  });

  /**
   * @route   PUT /api/guests/:id/rsvp
   * @desc    Update RSVP status
   * @access  Private
   */
  updateRSVPStatus = asyncHandler(async (req, res) => {
    const { rsvp_status } = req.body;

    if (!rsvp_status) {
      return res.status(400).json({
        success: false,
        message: 'RSVP status is required',
      });
    }

    const guest = await guestService.updateRSVPStatus(req.params.id, rsvp_status);

    res.json({
      success: true,
      message: 'RSVP status updated successfully',
      data: guest,
    });
  });

  /**
   * @route   PUT /api/guests/:id/invitation-sent
   * @desc    Mark invitation as sent
   * @access  Private
   */
  markInvitationSent = asyncHandler(async (req, res) => {
    const guest = await guestService.markInvitationSent(req.params.id);

    res.json({
      success: true,
      message: 'Invitation marked as sent',
      data: guest,
    });
  });

  /**
   * @route   PUT /api/guests/invitations/bulk-sent
   * @desc    Mark multiple invitations as sent
   * @access  Private
   */
  markMultipleInvitationsSent = asyncHandler(async (req, res) => {
    const { guest_ids } = req.body;

    if (!guest_ids) {
      return res.status(400).json({
        success: false,
        message: 'Guest IDs array is required',
      });
    }

    const count = await guestService.markMultipleInvitationsSent(guest_ids);

    res.json({
      success: true,
      message: `${count} invitations marked as sent`,
      data: { updated_count: count },
    });
  });

  /**
   * @route   DELETE /api/guests/:id
   * @desc    Delete guest
   * @access  Private
   */
  deleteGuest = asyncHandler(async (req, res) => {
    await guestService.deleteGuest(req.params.id);

    res.json({
      success: true,
      message: 'Guest deleted successfully',
    });
  });
}

export default new GuestController();
