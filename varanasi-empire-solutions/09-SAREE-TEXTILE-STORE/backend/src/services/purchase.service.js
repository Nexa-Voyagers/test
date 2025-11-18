import purchaseRepository from '../repositories/purchase.repository.js';
import weaverRepository from '../repositories/weaver.repository.js';
import productRepository from '../repositories/product.repository.js';
import storeRepository from '../repositories/store.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Purchase Service
 * Business logic for purchase order management
 */
class PurchaseService {
  /**
   * Create a new purchase order
   * @param {Object} orderData - Purchase order information
   * @param {Array} items - Purchase order items
   * @returns {Promise<Object>} Created purchase order with items
   */
  async createPurchaseOrder(orderData, items) {
    // Validate required fields
    if (!orderData.store_id) {
      throw new BadRequestError('Store ID is required');
    }

    if (!orderData.weaver_id) {
      throw new BadRequestError('Weaver ID is required');
    }

    if (!orderData.order_number) {
      throw new BadRequestError('Order number is required');
    }

    if (!items || items.length === 0) {
      throw new BadRequestError('At least one item is required');
    }

    // Verify store exists
    const store = await storeRepository.findById(orderData.store_id);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    // Verify weaver exists
    const weaver = await weaverRepository.findById(orderData.weaver_id);
    if (!weaver) {
      throw new NotFoundError('Weaver not found');
    }

    if (!weaver.is_active) {
      throw new BadRequestError('Cannot create order with inactive weaver');
    }

    // Validate and enrich items
    const enrichedItems = [];
    for (const item of items) {
      if (!item.product_id) {
        throw new BadRequestError('Product ID is required for each item');
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new BadRequestError('Valid quantity is required for each item');
      }

      if (!item.unit_price || item.unit_price <= 0) {
        throw new BadRequestError('Valid unit price is required for each item');
      }

      // Verify product exists
      const product = await productRepository.findById(item.product_id);
      if (!product) {
        throw new NotFoundError(`Product with ID ${item.product_id} not found`);
      }

      enrichedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      });
    }

    // Validate advance amount if provided
    if (orderData.advance_amount) {
      if (orderData.advance_amount < 0) {
        throw new BadRequestError('Advance amount cannot be negative');
      }
    }

    // Set default status if not provided
    if (!orderData.status) {
      orderData.status = 'PENDING';
    }

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(orderData.status)) {
      throw new BadRequestError('Invalid order status');
    }

    return await purchaseRepository.createPurchaseOrder(orderData, enrichedItems);
  }

  /**
   * Get purchase order by ID
   * @param {number} id - Order ID
   * @returns {Promise<Object>} Purchase order with items
   */
  async getPurchaseOrderById(id) {
    const order = await purchaseRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Purchase order not found');
    }
    return order;
  }

  /**
   * Get purchase order by order number
   * @param {string} orderNumber - Order number
   * @returns {Promise<Object>} Purchase order with items
   */
  async getPurchaseOrderByOrderNumber(orderNumber) {
    const order = await purchaseRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundError('Purchase order not found');
    }
    return order;
  }

  /**
   * Get all purchase orders with filters and pagination
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Purchase orders list with metadata
   */
  async getAllPurchaseOrders(filters = {}) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const offset = (page - 1) * limit;

    const queryFilters = {
      ...filters,
      limit,
      offset
    };

    const [orders, total] = await Promise.all([
      purchaseRepository.findAll(queryFilters),
      purchaseRepository.count(filters)
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
   * Update purchase order status
   * @param {number} id - Order ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data
   * @returns {Promise<Object>} Updated purchase order
   */
  async updateOrderStatus(id, status, additionalData = {}) {
    const order = await purchaseRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Purchase order not found');
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError('Invalid order status');
    }

    // Validate status transitions
    if (order.status === 'COMPLETED' && status !== 'COMPLETED') {
      throw new BadRequestError('Cannot change status of completed order');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestError('Cannot change status of cancelled order');
    }

    return await purchaseRepository.updateStatus(id, status, additionalData);
  }

  /**
   * Update purchase order
   * @param {number} id - Order ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated purchase order
   */
  async updatePurchaseOrder(id, updates) {
    const order = await purchaseRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Purchase order not found');
    }

    // Don't allow updates to completed or cancelled orders
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new BadRequestError(`Cannot update ${order.status.toLowerCase()} order`);
    }

    // Validate weaver if updating
    if (updates.weaver_id) {
      const weaver = await weaverRepository.findById(updates.weaver_id);
      if (!weaver) {
        throw new NotFoundError('Weaver not found');
      }
      if (!weaver.is_active) {
        throw new BadRequestError('Cannot assign inactive weaver');
      }
    }

    return await purchaseRepository.update(id, updates);
  }

  /**
   * Get pending purchase orders
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Pending orders
   */
  async getPendingOrders(storeId = null) {
    return await purchaseRepository.getPendingOrders(storeId);
  }

  /**
   * Get overdue purchase orders
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Overdue orders
   */
  async getOverdueOrders(storeId = null) {
    return await purchaseRepository.getOverdueOrders(storeId);
  }

  /**
   * Get purchase summary
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Purchase summary
   */
  async getPurchaseSummary(filters = {}) {
    return await purchaseRepository.getPurchaseSummary(filters);
  }

  /**
   * Mark order as received and update stock
   * @param {number} id - Order ID
   * @param {Object} receivingData - Receiving information
   * @returns {Promise<Object>} Updated order
   */
  async receiveOrder(id, receivingData = {}) {
    const order = await purchaseRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Purchase order not found');
    }

    if (order.status === 'COMPLETED') {
      throw new BadRequestError('Order already completed');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestError('Cannot receive cancelled order');
    }

    // Update status to completed (this will automatically update stock)
    return await purchaseRepository.updateStatus(id, 'COMPLETED', {
      delivery_date: receivingData.delivery_date || new Date(),
      quality_check_notes: receivingData.quality_check_notes
    });
  }

  /**
   * Cancel purchase order
   * @param {number} id - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Updated order
   */
  async cancelOrder(id, reason = null) {
    const order = await purchaseRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Purchase order not found');
    }

    if (order.status === 'COMPLETED') {
      throw new BadRequestError('Cannot cancel completed order');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestError('Order already cancelled');
    }

    const notes = reason ? `Cancelled: ${reason}` : 'Cancelled';

    return await purchaseRepository.updateStatus(id, 'CANCELLED', { notes });
  }

  /**
   * Generate purchase order number
   * @param {number} storeId - Store ID
   * @returns {Promise<string>} Generated order number
   */
  async generateOrderNumber(storeId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Format: PO-STID-YYMM-XXXX
    const prefix = `PO-${storeId}-${year}${month}`;

    // Get count of orders this month for this store
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const monthCount = await purchaseRepository.count({
      store_id: storeId,
      start_date: startOfMonth,
      end_date: endOfMonth
    });

    const sequence = (monthCount + 1).toString().padStart(4, '0');

    return `${prefix}-${sequence}`;
  }

  /**
   * Get orders by weaver
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

    const filters = {
      weaver_id: weaverId,
      page,
      limit
    };

    return await this.getAllPurchaseOrders(filters);
  }

  /**
   * Validate purchase order items
   * @param {Array} items - Purchase order items
   * @returns {Promise<Object>} Validation result
   */
  async validatePurchaseItems(items) {
    const errors = [];
    const validItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.product_id) {
        errors.push(`Item ${i + 1}: Product ID is required`);
        continue;
      }

      const product = await productRepository.findById(item.product_id);
      if (!product) {
        errors.push(`Item ${i + 1}: Product not found`);
        continue;
      }

      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${i + 1}: Invalid quantity`);
        continue;
      }

      if (!item.unit_price || item.unit_price <= 0) {
        errors.push(`Item ${i + 1}: Invalid unit price`);
        continue;
      }

      validItems.push({
        product_id: item.product_id,
        product_name: product.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      validItems,
      total_amount: validItems.reduce((sum, item) => sum + item.total_price, 0)
    };
  }
}

export default new PurchaseService();
