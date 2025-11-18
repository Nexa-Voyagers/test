import customOrderRepository from '../repositories/custom-order.repository.js';
import customerRepository from '../repositories/customer.repository.js';
import weaverRepository from '../repositories/weaver.repository.js';
import storeRepository from '../repositories/store.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Custom Order Service
 * Business logic for custom order management with workflow tracking
 */
class CustomOrderService {
  /**
   * Custom order workflow statuses
   */
  static STATUSES = {
    DESIGN_PENDING: 'DESIGN_PENDING',
    WEAVER_ASSIGNED: 'WEAVER_ASSIGNED',
    DESIGN_APPROVED: 'DESIGN_APPROVED',
    IN_PRODUCTION: 'IN_PRODUCTION',
    QUALITY_CHECK: 'QUALITY_CHECK',
    READY_FOR_DELIVERY: 'READY_FOR_DELIVERY',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
  };

  /**
   * Valid status transitions
   */
  static VALID_TRANSITIONS = {
    DESIGN_PENDING: ['WEAVER_ASSIGNED', 'CANCELLED'],
    WEAVER_ASSIGNED: ['DESIGN_APPROVED', 'DESIGN_PENDING', 'CANCELLED'],
    DESIGN_APPROVED: ['IN_PRODUCTION', 'WEAVER_ASSIGNED', 'CANCELLED'],
    IN_PRODUCTION: ['QUALITY_CHECK', 'CANCELLED'],
    QUALITY_CHECK: ['READY_FOR_DELIVERY', 'IN_PRODUCTION', 'CANCELLED'],
    READY_FOR_DELIVERY: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: []
  };

  /**
   * Create a new custom order
   * @param {Object} orderData - Custom order information
   * @returns {Promise<Object>} Created custom order
   */
  async createCustomOrder(orderData) {
    // Validate required fields
    if (!orderData.store_id) {
      throw new BadRequestError('Store ID is required');
    }

    if (!orderData.customer_id) {
      throw new BadRequestError('Customer ID is required');
    }

    if (!orderData.order_number) {
      throw new BadRequestError('Order number is required');
    }

    if (!orderData.fabric_type) {
      throw new BadRequestError('Fabric type is required');
    }

    // Verify store exists
    const store = await storeRepository.findById(orderData.store_id);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    // Verify customer exists
    const customer = await customerRepository.findById(orderData.customer_id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    // Verify weaver exists if provided
    if (orderData.weaver_id) {
      const weaver = await weaverRepository.findById(orderData.weaver_id);
      if (!weaver) {
        throw new NotFoundError('Weaver not found');
      }
      if (!weaver.is_active) {
        throw new BadRequestError('Cannot assign inactive weaver');
      }
      // If weaver is assigned during creation, set status accordingly
      if (!orderData.status) {
        orderData.status = 'WEAVER_ASSIGNED';
      }
    }

    // Validate measurements if provided
    if (orderData.measurements) {
      if (typeof orderData.measurements !== 'object') {
        throw new BadRequestError('Measurements must be a valid JSON object');
      }
    }

    // Validate reference images if provided
    if (orderData.reference_images) {
      if (!Array.isArray(orderData.reference_images)) {
        throw new BadRequestError('Reference images must be an array');
      }
    }

    // Set default status if not provided
    if (!orderData.status) {
      orderData.status = 'DESIGN_PENDING';
    }

    return await customOrderRepository.create(orderData);
  }

  /**
   * Get custom order by ID
   * @param {number} id - Order ID
   * @returns {Promise<Object>} Custom order details
   */
  async getCustomOrderById(id) {
    const order = await customOrderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Custom order not found');
    }
    return order;
  }

  /**
   * Get all custom orders with filters and pagination
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Custom orders list with metadata
   */
  async getAllCustomOrders(filters = {}) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const offset = (page - 1) * limit;

    const queryFilters = {
      ...filters,
      limit,
      offset
    };

    const [orders, total] = await Promise.all([
      customOrderRepository.findAll(queryFilters),
      customOrderRepository.count(filters)
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update custom order status with workflow validation
   * @param {number} id - Order ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data for status update
   * @returns {Promise<Object>} Updated custom order
   */
  async updateOrderStatus(id, status, additionalData = {}) {
    const order = await customOrderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Custom order not found');
    }

    // Validate status
    if (!Object.values(CustomOrderService.STATUSES).includes(status)) {
      throw new BadRequestError('Invalid order status');
    }

    // Validate status transition
    const validTransitions = CustomOrderService.VALID_TRANSITIONS[order.status];
    if (!validTransitions.includes(status)) {
      throw new BadRequestError(
        `Invalid status transition from ${order.status} to ${status}. Valid transitions: ${validTransitions.join(', ')}`
      );
    }

    // Validate required data for specific status changes
    if (status === 'WEAVER_ASSIGNED' && !order.weaver_id && !additionalData.weaver_id) {
      throw new BadRequestError('Weaver ID is required when assigning weaver');
    }

    if (status === 'DESIGN_APPROVED' && !additionalData.estimated_price && !order.estimated_price) {
      throw new BadRequestError('Estimated price is required when approving design');
    }

    return await customOrderRepository.updateStatus(id, status, additionalData);
  }

  /**
   * Update custom order
   * @param {number} id - Order ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated custom order
   */
  async updateCustomOrder(id, updates) {
    const order = await customOrderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Custom order not found');
    }

    // Don't allow updates to completed or cancelled orders
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new BadRequestError(`Cannot update ${order.status.toLowerCase()} order`);
    }

    // Validate measurements if updating
    if (updates.measurements && typeof updates.measurements !== 'object') {
      throw new BadRequestError('Measurements must be a valid JSON object');
    }

    // Validate reference images if updating
    if (updates.reference_images && !Array.isArray(updates.reference_images)) {
      throw new BadRequestError('Reference images must be an array');
    }

    return await customOrderRepository.update(id, updates);
  }

  /**
   * Assign weaver to custom order
   * @param {number} orderId - Order ID
   * @param {number} weaverId - Weaver ID
   * @returns {Promise<Object>} Updated order
   */
  async assignWeaver(orderId, weaverId) {
    const order = await customOrderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Custom order not found');
    }

    const weaver = await weaverRepository.findById(weaverId);
    if (!weaver) {
      throw new NotFoundError('Weaver not found');
    }

    if (!weaver.is_active) {
      throw new BadRequestError('Cannot assign inactive weaver');
    }

    // Check if order is in a valid state for weaver assignment
    if (order.status !== 'DESIGN_PENDING' && order.status !== 'DESIGN_APPROVED') {
      throw new BadRequestError('Can only assign weaver to orders in DESIGN_PENDING or DESIGN_APPROVED status');
    }

    return await customOrderRepository.assignWeaver(orderId, weaverId);
  }

  /**
   * Approve design for custom order
   * @param {number} id - Order ID
   * @param {number} estimatedPrice - Estimated price
   * @returns {Promise<Object>} Updated order
   */
  async approveDesign(id, estimatedPrice) {
    if (!estimatedPrice || estimatedPrice <= 0) {
      throw new BadRequestError('Valid estimated price is required');
    }

    return await this.updateOrderStatus(id, 'DESIGN_APPROVED', { estimated_price: estimatedPrice });
  }

  /**
   * Start production for custom order
   * @param {number} id - Order ID
   * @returns {Promise<Object>} Updated order
   */
  async startProduction(id) {
    const order = await customOrderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Custom order not found');
    }

    if (!order.weaver_id) {
      throw new BadRequestError('Cannot start production without assigned weaver');
    }

    return await this.updateOrderStatus(id, 'IN_PRODUCTION');
  }

  /**
   * Complete quality check for custom order
   * @param {number} id - Order ID
   * @param {number} qualityRating - Quality rating (0-10)
   * @param {string} notes - Quality check notes
   * @returns {Promise<Object>} Updated order
   */
  async completeQualityCheck(id, qualityRating, notes = null) {
    if (qualityRating !== undefined && (qualityRating < 0 || qualityRating > 10)) {
      throw new BadRequestError('Quality rating must be between 0 and 10');
    }

    return await this.updateOrderStatus(id, 'QUALITY_CHECK', {
      quality_rating: qualityRating,
      notes
    });
  }

  /**
   * Mark order ready for delivery
   * @param {number} id - Order ID
   * @param {number} finalPrice - Final price
   * @returns {Promise<Object>} Updated order
   */
  async markReadyForDelivery(id, finalPrice = null) {
    return await this.updateOrderStatus(id, 'READY_FOR_DELIVERY', {
      final_price: finalPrice
    });
  }

  /**
   * Complete custom order
   * @param {number} id - Order ID
   * @param {number} finalPrice - Final price
   * @returns {Promise<Object>} Updated order
   */
  async completeOrder(id, finalPrice = null) {
    return await this.updateOrderStatus(id, 'COMPLETED', {
      final_price: finalPrice
    });
  }

  /**
   * Cancel custom order
   * @param {number} id - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Updated order
   */
  async cancelOrder(id, reason = null) {
    const order = await customOrderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Custom order not found');
    }

    if (order.status === 'COMPLETED') {
      throw new BadRequestError('Cannot cancel completed order');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestError('Order already cancelled');
    }

    const notes = reason ? `Cancelled: ${reason}` : 'Cancelled';

    return await customOrderRepository.updateStatus(id, 'CANCELLED', { notes });
  }

  /**
   * Get pending custom orders
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Pending orders
   */
  async getPendingOrders(storeId = null) {
    return await customOrderRepository.getPendingOrders(storeId);
  }

  /**
   * Get overdue custom orders
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Overdue orders
   */
  async getOverdueOrders(storeId = null) {
    return await customOrderRepository.getOverdueOrders(storeId);
  }

  /**
   * Get custom orders by customer
   * @param {number} customerId - Customer ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Orders with pagination
   */
  async getOrdersByCustomer(customerId, options = {}) {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 50;
    const offset = (page - 1) * limit;

    const orders = await customOrderRepository.getByCustomer(customerId, { limit, offset });

    return {
      customer_id: customerId,
      customer_name: customer.customer_name,
      data: orders,
      pagination: {
        page,
        limit
      }
    };
  }

  /**
   * Get custom orders by weaver
   * @param {number} weaverId - Weaver ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Orders with pagination
   */
  async getOrdersByWeaver(weaverId, options = {}) {
    const weaver = await weaverRepository.findById(weaverId);
    if (!weaver) {
      throw new NotFoundError('Weaver not found');
    }

    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 50;
    const offset = (page - 1) * limit;

    const orders = await customOrderRepository.getByWeaver(weaverId, { limit, offset });

    return {
      weaver_id: weaverId,
      weaver_name: weaver.weaver_name,
      data: orders,
      pagination: {
        page,
        limit
      }
    };
  }

  /**
   * Get custom order statistics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Order statistics
   */
  async getOrderStatistics(filters = {}) {
    return await customOrderRepository.getStatistics(filters);
  }

  /**
   * Generate custom order number
   * @param {number} storeId - Store ID
   * @returns {Promise<string>} Generated order number
   */
  async generateOrderNumber(storeId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Format: CO-STID-YYMM-XXXX
    const prefix = `CO-${storeId}-${year}${month}`;

    // Get count of orders this month for this store
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const monthCount = await customOrderRepository.count({
      store_id: storeId,
      start_date: startOfMonth,
      end_date: endOfMonth
    });

    const sequence = (monthCount + 1).toString().padStart(4, '0');

    return `${prefix}-${sequence}`;
  }
}

export default new CustomOrderService();
