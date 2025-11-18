import clientService from '../services/client.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for client endpoints
 */
class ClientController {
  /**
   * @route   POST /api/clients
   * @desc    Create a new client
   * @access  Private
   */
  createClient = asyncHandler(async (req, res) => {
    const client = await clientService.createClient(req.body);

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client,
    });
  });

  /**
   * @route   GET /api/clients
   * @desc    Get all clients with optional filters and search
   * @access  Private
   */
  getClients = asyncHandler(async (req, res) => {
    const filters = {
      search: req.query.search,
      city: req.query.city,
      budget_min: req.query.budget_min ? parseFloat(req.query.budget_min) : undefined,
      budget_max: req.query.budget_max ? parseFloat(req.query.budget_max) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    };

    const clients = await clientService.getClients(filters);

    res.json({
      success: true,
      count: clients.length,
      data: clients,
    });
  });

  /**
   * @route   GET /api/clients/search
   * @desc    Search clients by name or phone
   * @access  Private
   */
  searchClients = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const clients = await clientService.searchClients(q);

    res.json({
      success: true,
      count: clients.length,
      data: clients,
    });
  });

  /**
   * @route   GET /api/clients/:id
   * @desc    Get client by ID
   * @access  Private
   */
  getClientById = asyncHandler(async (req, res) => {
    const client = await clientService.getClientById(req.params.id);

    res.json({
      success: true,
      data: client,
    });
  });

  /**
   * @route   GET /api/clients/:id/profile
   * @desc    Get complete client profile with events and statistics
   * @access  Private
   */
  getClientProfile = asyncHandler(async (req, res) => {
    const profile = await clientService.getClientProfile(req.params.id);

    res.json({
      success: true,
      data: profile,
    });
  });

  /**
   * @route   GET /api/clients/:id/events
   * @desc    Get client with event history
   * @access  Private
   */
  getClientEvents = asyncHandler(async (req, res) => {
    const clientWithEvents = await clientService.getClientWithEvents(req.params.id);

    res.json({
      success: true,
      data: clientWithEvents,
    });
  });

  /**
   * @route   PUT /api/clients/:id
   * @desc    Update client
   * @access  Private
   */
  updateClient = asyncHandler(async (req, res) => {
    const client = await clientService.updateClient(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: client,
    });
  });

  /**
   * @route   DELETE /api/clients/:id
   * @desc    Delete client
   * @access  Private
   */
  deleteClient = asyncHandler(async (req, res) => {
    await clientService.deleteClient(req.params.id);

    res.json({
      success: true,
      message: 'Client deleted successfully',
    });
  });

  /**
   * @route   GET /api/clients/:id/statistics
   * @desc    Get client statistics
   * @access  Private
   */
  getClientStatistics = asyncHandler(async (req, res) => {
    const statistics = await clientService.getClientStatistics(req.params.id);

    res.json({
      success: true,
      data: statistics,
    });
  });
}

export default new ClientController();
