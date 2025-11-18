import customerRepository from '../repositories/customer.repository.js';
import storeRepository from '../repositories/store.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Customer Service
 * Business logic for customer management
 */
class CustomerService {
  /**
   * Loyalty tier thresholds
   */
  static LOYALTY_THRESHOLDS = {
    SILVER: 0,
    GOLD: 50000,
    PLATINUM: 200000
  };

  /**
   * Create a new customer
   * @param {Object} customerData - Customer information
   * @returns {Promise<Object>} Created customer
   */
  async createCustomer(customerData) {
    // Validate required fields
    if (!customerData.store_id) {
      throw new BadRequestError('Store ID is required');
    }

    if (!customerData.customer_name) {
      throw new BadRequestError('Customer name is required');
    }

    if (!customerData.phone) {
      throw new BadRequestError('Phone number is required');
    }

    if (!customerData.customer_type) {
      throw new BadRequestError('Customer type is required');
    }

    // Validate customer type
    const validTypes = ['RETAIL', 'WHOLESALE', 'BOUTIQUE'];
    if (!validTypes.includes(customerData.customer_type)) {
      throw new BadRequestError('Invalid customer type. Must be RETAIL, WHOLESALE, or BOUTIQUE');
    }

    // Verify store exists
    const store = await storeRepository.findById(customerData.store_id);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    // Validate phone format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(customerData.phone.replace(/[^0-9]/g, ''))) {
      throw new BadRequestError('Invalid phone number format');
    }

    // Check if phone already exists
    const existingCustomer = await customerRepository.findByPhone(customerData.phone);
    if (existingCustomer) {
      throw new BadRequestError('Customer with this phone number already exists');
    }

    // Validate email if provided
    if (customerData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerData.email)) {
        throw new BadRequestError('Invalid email format');
      }
    }

    // Set initial loyalty tier
    if (!customerData.loyalty_tier) {
      customerData.loyalty_tier = 'SILVER';
    }

    return await customerRepository.create(customerData);
  }

  /**
   * Get customer by ID
   * @param {number} id - Customer ID
   * @returns {Promise<Object>} Customer details
   */
  async getCustomerById(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return customer;
  }

  /**
   * Get all customers with filters and pagination
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Customers list with metadata
   */
  async getAllCustomers(filters = {}) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const offset = (page - 1) * limit;

    const queryFilters = {
      ...filters,
      limit,
      offset
    };

    const [customers, total] = await Promise.all([
      customerRepository.findAll(queryFilters),
      customerRepository.count(filters)
    ]);

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update customer
   * @param {number} id - Customer ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated customer
   */
  async updateCustomer(id, updates) {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    // Validate customer type if updating
    if (updates.customer_type) {
      const validTypes = ['RETAIL', 'WHOLESALE', 'BOUTIQUE'];
      if (!validTypes.includes(updates.customer_type)) {
        throw new BadRequestError('Invalid customer type. Must be RETAIL, WHOLESALE, or BOUTIQUE');
      }
    }

    // Validate phone if updating
    if (updates.phone && updates.phone !== customer.phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(updates.phone.replace(/[^0-9]/g, ''))) {
        throw new BadRequestError('Invalid phone number format');
      }

      // Check if new phone already exists
      const existingCustomer = await customerRepository.findByPhone(updates.phone);
      if (existingCustomer && existingCustomer.customer_id !== id) {
        throw new BadRequestError('Customer with this phone number already exists');
      }
    }

    // Validate email if updating
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        throw new BadRequestError('Invalid email format');
      }
    }

    return await customerRepository.update(id, updates);
  }

  /**
   * Delete customer (soft delete)
   * @param {number} id - Customer ID
   * @returns {Promise<Object>} Success message
   */
  async deleteCustomer(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    // Check for outstanding balance
    if (customer.outstanding_balance > 0) {
      throw new BadRequestError('Cannot delete customer with outstanding balance');
    }

    await customerRepository.delete(id);

    return { message: 'Customer deleted successfully' };
  }

  /**
   * Search customers
   * @param {string} searchTerm - Search term
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Matching customers
   */
  async searchCustomers(searchTerm, storeId = null) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestError('Search term must be at least 2 characters');
    }

    return await customerRepository.search(searchTerm, storeId);
  }

  /**
   * Get customer purchase history
   * @param {number} id - Customer ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Purchase history with pagination
   */
  async getCustomerPurchaseHistory(id, options = {}) {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 50;
    const offset = (page - 1) * limit;

    const purchases = await customerRepository.getPurchaseHistory(id, { limit, offset });

    return {
      customer_id: id,
      customer_name: customer.customer_name,
      loyalty_tier: customer.loyalty_tier,
      total_purchases: customer.total_purchases,
      data: purchases,
      pagination: {
        page,
        limit
      }
    };
  }

  /**
   * Get customers with outstanding balance
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Customers with outstanding balance
   */
  async getCustomersWithOutstandingBalance(storeId = null) {
    return await customerRepository.getWithOutstandingBalance(storeId);
  }

  /**
   * Get top customers by purchase amount
   * @param {number} storeId - Store ID (optional)
   * @param {number} limit - Number of customers
   * @returns {Promise<Array>} Top customers
   */
  async getTopCustomers(storeId = null, limit = 10) {
    if (limit < 1 || limit > 100) {
      throw new BadRequestError('Limit must be between 1 and 100');
    }

    return await customerRepository.getTopCustomers(storeId, limit);
  }

  /**
   * Get customers by loyalty tier
   * @param {string} tier - Loyalty tier
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Customers in tier
   */
  async getCustomersByLoyaltyTier(tier, storeId = null) {
    const validTiers = ['SILVER', 'GOLD', 'PLATINUM'];
    if (!validTiers.includes(tier)) {
      throw new BadRequestError('Invalid loyalty tier. Must be SILVER, GOLD, or PLATINUM');
    }

    return await customerRepository.getByLoyaltyTier(tier, storeId);
  }

  /**
   * Calculate loyalty tier based on total purchases
   * @param {number} totalPurchases - Total purchase amount
   * @returns {string} Loyalty tier
   */
  calculateLoyaltyTier(totalPurchases) {
    if (totalPurchases >= CustomerService.LOYALTY_THRESHOLDS.PLATINUM) {
      return 'PLATINUM';
    } else if (totalPurchases >= CustomerService.LOYALTY_THRESHOLDS.GOLD) {
      return 'GOLD';
    } else {
      return 'SILVER';
    }
  }

  /**
   * Update customer loyalty tier manually (admin override)
   * @param {number} id - Customer ID
   * @param {string} tier - New loyalty tier
   * @returns {Promise<Object>} Updated customer
   */
  async updateLoyaltyTier(id, tier) {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const validTiers = ['SILVER', 'GOLD', 'PLATINUM'];
    if (!validTiers.includes(tier)) {
      throw new BadRequestError('Invalid loyalty tier. Must be SILVER, GOLD, or PLATINUM');
    }

    return await customerRepository.update(id, { loyalty_tier: tier });
  }

  /**
   * Process payment and update outstanding balance
   * @param {number} id - Customer ID
   * @param {number} amount - Payment amount
   * @returns {Promise<Object>} Updated customer
   */
  async recordPayment(id, amount) {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    if (amount <= 0) {
      throw new BadRequestError('Payment amount must be positive');
    }

    if (amount > customer.outstanding_balance) {
      throw new BadRequestError('Payment amount exceeds outstanding balance');
    }

    return await customerRepository.updateOutstandingBalance(id, amount, 'subtract');
  }
}

export default new CustomerService();
