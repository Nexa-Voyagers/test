import clientRepository from '../repositories/client.repository.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Client Service
 * Business logic for client operations
 */
class ClientService {
  /**
   * Create a new client
   * @param {Object} clientData - Client data
   * @returns {Promise<Object>} Created client
   */
  async createClient(clientData) {
    // Check if client code already exists
    const existingCode = await clientRepository.findByCode(clientData.client_code);
    if (existingCode) {
      throw new ConflictError('Client code already exists');
    }

    // Check if phone number already exists
    const existingPhone = await clientRepository.findByPhone(clientData.phone);
    if (existingPhone) {
      throw new ConflictError('Phone number already exists');
    }

    // Validate client type
    const validClientTypes = ['INDIVIDUAL', 'CORPORATE'];
    if (clientData.client_type && !validClientTypes.includes(clientData.client_type)) {
      throw new Error(`Invalid client type. Must be one of: ${validClientTypes.join(', ')}`);
    }

    // Validate required fields based on client type
    if (clientData.client_type === 'INDIVIDUAL') {
      if (!clientData.first_name) {
        throw new Error('First name is required for individual clients');
      }
    } else if (clientData.client_type === 'CORPORATE') {
      if (!clientData.company_name) {
        throw new Error('Company name is required for corporate clients');
      }
    }

    return await clientRepository.create(clientData);
  }

  /**
   * Get client by ID
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Client object
   */
  async getClientById(id) {
    const client = await clientRepository.findById(id);

    if (!client) {
      throw new NotFoundError('Client');
    }

    return client;
  }

  /**
   * Get all clients with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Clients and pagination info
   */
  async getAllClients(options) {
    return await clientRepository.findAll(options);
  }

  /**
   * Update client
   * @param {string} id - Client ID
   * @param {Object} clientData - Updated client data
   * @returns {Promise<Object>} Updated client
   */
  async updateClient(id, clientData) {
    // Validate client type if provided
    if (clientData.client_type) {
      const validClientTypes = ['INDIVIDUAL', 'CORPORATE'];
      if (!validClientTypes.includes(clientData.client_type)) {
        throw new Error(`Invalid client type. Must be one of: ${validClientTypes.join(', ')}`);
      }
    }

    return await clientRepository.update(id, clientData);
  }

  /**
   * Delete client (soft delete)
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Deleted client
   */
  async deleteClient(id) {
    return await clientRepository.delete(id);
  }

  /**
   * Get client statistics
   * @param {string} clientId - Client ID
   * @returns {Promise<Object>} Client statistics
   */
  async getClientStatistics(clientId) {
    const stats = await clientRepository.getClientStatistics(clientId);

    if (!stats) {
      throw new NotFoundError('Client');
    }

    // Calculate additional metrics
    const totalDecidedCases = parseInt(stats.won_cases) + parseInt(stats.lost_cases);
    const winRate = totalDecidedCases > 0
      ? ((parseInt(stats.won_cases) / totalDecidedCases) * 100).toFixed(2)
      : 0;

    const paymentRate = parseFloat(stats.total_billed) > 0
      ? ((parseFloat(stats.total_paid) / parseFloat(stats.total_billed)) * 100).toFixed(2)
      : 0;

    return {
      ...stats,
      win_rate: parseFloat(winRate),
      payment_rate: parseFloat(paymentRate),
      has_outstanding_payments: parseFloat(stats.outstanding_amount) > 0,
    };
  }

  /**
   * Search clients
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} List of matching clients
   */
  async searchClients(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('Search term must be at least 2 characters');
    }

    return await clientRepository.searchClients(searchTerm);
  }

  /**
   * Get clients with outstanding payments
   * @returns {Promise<Array>} List of clients with outstanding payments
   */
  async getClientsWithOutstandingPayments() {
    return await clientRepository.getClientsWithOutstandingPayments();
  }

  /**
   * Get client display name
   * @param {Object} client - Client object
   * @returns {string} Display name
   */
  getClientDisplayName(client) {
    if (client.client_type === 'CORPORATE') {
      return client.company_name;
    } else {
      return `${client.first_name} ${client.last_name || ''}`.trim();
    }
  }
}

export default new ClientService();
