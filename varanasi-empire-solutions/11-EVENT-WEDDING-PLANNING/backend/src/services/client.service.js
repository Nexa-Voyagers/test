import clientRepository from '../repositories/client.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Service for client business logic
 */
class ClientService {
  /**
   * Create a new client
   * @param {Object} clientData - Client data
   * @returns {Promise<Object>} Created client
   */
  async createClient(clientData) {
    // Validate required fields
    const errors = this.validateClientData(clientData);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    // Generate client code if not provided
    if (!clientData.client_code) {
      clientData.client_code = await clientRepository.generateClientCode();
    }

    return await clientRepository.create(clientData);
  }

  /**
   * Get all clients with filters and search
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of clients
   */
  async getClients(filters = {}) {
    return await clientRepository.findAll(filters);
  }

  /**
   * Get client by ID
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Client data
   */
  async getClientById(id) {
    return await clientRepository.findById(id);
  }

  /**
   * Get client with event history
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Client with events
   */
  async getClientWithEvents(id) {
    return await clientRepository.findByIdWithEvents(id);
  }

  /**
   * Search clients by name or phone
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching clients
   */
  async searchClients(searchTerm) {
    return await clientRepository.findAll({ search: searchTerm });
  }

  /**
   * Find clients by phone number
   * @param {string} phone - Phone number
   * @returns {Promise<Array>} Matching clients
   */
  async findClientsByPhone(phone) {
    return await clientRepository.findByPhone(phone);
  }

  /**
   * Update client
   * @param {string} id - Client ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated client
   */
  async updateClient(id, updateData) {
    // Validate update data
    if (updateData.email && !this.isValidEmail(updateData.email)) {
      throw new ValidationError([{ field: 'email', message: 'Invalid email format' }]);
    }

    if (updateData.phone && !this.isValidPhone(updateData.phone)) {
      throw new ValidationError([{ field: 'phone', message: 'Invalid phone number format' }]);
    }

    // Validate budget range
    if (updateData.budget_min && updateData.budget_max) {
      if (parseFloat(updateData.budget_min) > parseFloat(updateData.budget_max)) {
        throw new ValidationError([{ field: 'budget', message: 'Minimum budget cannot be greater than maximum budget' }]);
      }
    }

    return await clientRepository.update(id, updateData);
  }

  /**
   * Delete client
   * @param {string} id - Client ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteClient(id) {
    return await clientRepository.delete(id);
  }

  /**
   * Get client statistics
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Client statistics
   */
  async getClientStatistics(id) {
    return await clientRepository.getStatistics(id);
  }

  /**
   * Get client profile with statistics
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Complete client profile
   */
  async getClientProfile(id) {
    const client = await clientRepository.findById(id);
    const statistics = await clientRepository.getStatistics(id);
    const events = await clientRepository.findByIdWithEvents(id);

    return {
      ...client,
      statistics,
      events: events.events,
    };
  }

  /**
   * Validate client data
   * @param {Object} clientData - Client data
   * @returns {Array} Validation errors
   */
  validateClientData(clientData) {
    const errors = [];

    if (!clientData.first_name || clientData.first_name.trim() === '') {
      errors.push({ field: 'first_name', message: 'First name is required' });
    }

    if (!clientData.phone || clientData.phone.trim() === '') {
      errors.push({ field: 'phone', message: 'Phone number is required' });
    } else if (!this.isValidPhone(clientData.phone)) {
      errors.push({ field: 'phone', message: 'Invalid phone number format' });
    }

    if (clientData.email && !this.isValidEmail(clientData.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (clientData.budget_min && clientData.budget_max) {
      if (parseFloat(clientData.budget_min) > parseFloat(clientData.budget_max)) {
        errors.push({ field: 'budget', message: 'Minimum budget cannot be greater than maximum budget' });
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

  /**
   * Validate phone number format
   * @param {string} phone - Phone number
   * @returns {boolean} Valid status
   */
  isValidPhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    return phoneRegex.test(phone);
  }
}

export default new ClientService();
