import customerService from '../services/customer.service.js';

/**
 * Customer Controller
 * Handles HTTP requests for customer management
 */
class CustomerController {
  /**
   * Create a new customer
   * @route POST /api/v1/customers
   */
  async createCustomer(req, res) {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  }

  /**
   * Get customer by ID
   * @route GET /api/v1/customers/:id
   */
  async getCustomerById(req, res) {
    const customer = await customerService.getCustomerById(req.params.id);
    res.json({
      success: true,
      data: customer
    });
  }

  /**
   * Get all customers with filters
   * @route GET /api/v1/customers
   */
  async getAllCustomers(req, res) {
    const result = await customerService.getAllCustomers(req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Update customer
   * @route PUT /api/v1/customers/:id
   */
  async updateCustomer(req, res) {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  }

  /**
   * Update loyalty tier
   * @route PATCH /api/v1/customers/:id/loyalty-tier
   */
  async updateLoyaltyTier(req, res) {
    const { tier } = req.body;
    const customer = await customerService.updateLoyaltyTier(req.params.id, tier);
    res.json({
      success: true,
      message: 'Loyalty tier updated successfully',
      data: customer
    });
  }

  /**
   * Delete customer
   * @route DELETE /api/v1/customers/:id
   */
  async deleteCustomer(req, res) {
    const result = await customerService.deleteCustomer(req.params.id);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Search customers
   * @route GET /api/v1/customers/search
   */
  async searchCustomers(req, res) {
    const { q, store_id } = req.query;
    const customers = await customerService.searchCustomers(q, store_id || null);
    res.json({
      success: true,
      data: customers
    });
  }

  /**
   * Get customer purchase history
   * @route GET /api/v1/customers/:id/purchases
   */
  async getPurchaseHistory(req, res) {
    const result = await customerService.getCustomerPurchaseHistory(req.params.id, req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Get customers with outstanding balance
   * @route GET /api/v1/customers/outstanding-balance
   */
  async getWithOutstandingBalance(req, res) {
    const { store_id } = req.query;
    const customers = await customerService.getCustomersWithOutstandingBalance(store_id || null);
    res.json({
      success: true,
      data: customers
    });
  }

  /**
   * Get top customers
   * @route GET /api/v1/customers/top-customers
   */
  async getTopCustomers(req, res) {
    const { store_id, limit = 10 } = req.query;
    const customers = await customerService.getTopCustomers(
      store_id || null,
      parseInt(limit)
    );
    res.json({
      success: true,
      data: customers
    });
  }

  /**
   * Get customers by loyalty tier
   * @route GET /api/v1/customers/loyalty-tier/:tier
   */
  async getByLoyaltyTier(req, res) {
    const { store_id } = req.query;
    const customers = await customerService.getCustomersByLoyaltyTier(
      req.params.tier,
      store_id || null
    );
    res.json({
      success: true,
      data: customers
    });
  }

  /**
   * Record payment
   * @route POST /api/v1/customers/:id/payments
   */
  async recordPayment(req, res) {
    const { amount } = req.body;
    const customer = await customerService.recordPayment(req.params.id, amount);
    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: customer
    });
  }
}

export default new CustomerController();
