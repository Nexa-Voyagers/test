import customOrderService from '../services/custom-order.service.js';

/**
 * Custom Order Controller
 * Handles HTTP requests for custom order management
 */
class CustomOrderController {
  /**
   * Create a new custom order
   * @route POST /api/v1/custom-orders
   */
  async createCustomOrder(req, res) {
    const order = await customOrderService.createCustomOrder(req.body);
    res.status(201).json({
      success: true,
      message: 'Custom order created successfully',
      data: order
    });
  }

  /**
   * Get custom order by ID
   * @route GET /api/v1/custom-orders/:id
   */
  async getCustomOrderById(req, res) {
    const order = await customOrderService.getCustomOrderById(req.params.id);
    res.json({
      success: true,
      data: order
    });
  }

  /**
   * Get all custom orders with filters
   * @route GET /api/v1/custom-orders
   */
  async getAllCustomOrders(req, res) {
    const result = await customOrderService.getAllCustomOrders(req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Update custom order status
   * @route PATCH /api/v1/custom-orders/:id/status
   */
  async updateOrderStatus(req, res) {
    const { status, ...additionalData } = req.body;
    const order = await customOrderService.updateOrderStatus(
      req.params.id,
      status,
      additionalData
    );
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  }

  /**
   * Update custom order
   * @route PUT /api/v1/custom-orders/:id
   */
  async updateCustomOrder(req, res) {
    const order = await customOrderService.updateCustomOrder(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Custom order updated successfully',
      data: order
    });
  }

  /**
   * Assign weaver to custom order
   * @route POST /api/v1/custom-orders/:id/assign-weaver
   */
  async assignWeaver(req, res) {
    const { weaver_id } = req.body;
    const order = await customOrderService.assignWeaver(req.params.id, weaver_id);
    res.json({
      success: true,
      message: 'Weaver assigned successfully',
      data: order
    });
  }

  /**
   * Approve design
   * @route POST /api/v1/custom-orders/:id/approve-design
   */
  async approveDesign(req, res) {
    const { estimated_price } = req.body;
    const order = await customOrderService.approveDesign(req.params.id, estimated_price);
    res.json({
      success: true,
      message: 'Design approved successfully',
      data: order
    });
  }

  /**
   * Start production
   * @route POST /api/v1/custom-orders/:id/start-production
   */
  async startProduction(req, res) {
    const order = await customOrderService.startProduction(req.params.id);
    res.json({
      success: true,
      message: 'Production started successfully',
      data: order
    });
  }

  /**
   * Complete quality check
   * @route POST /api/v1/custom-orders/:id/quality-check
   */
  async completeQualityCheck(req, res) {
    const { quality_rating, notes } = req.body;
    const order = await customOrderService.completeQualityCheck(
      req.params.id,
      quality_rating,
      notes
    );
    res.json({
      success: true,
      message: 'Quality check completed successfully',
      data: order
    });
  }

  /**
   * Mark ready for delivery
   * @route POST /api/v1/custom-orders/:id/ready-for-delivery
   */
  async markReadyForDelivery(req, res) {
    const { final_price } = req.body;
    const order = await customOrderService.markReadyForDelivery(req.params.id, final_price);
    res.json({
      success: true,
      message: 'Order marked as ready for delivery',
      data: order
    });
  }

  /**
   * Complete custom order
   * @route POST /api/v1/custom-orders/:id/complete
   */
  async completeOrder(req, res) {
    const { final_price } = req.body;
    const order = await customOrderService.completeOrder(req.params.id, final_price);
    res.json({
      success: true,
      message: 'Custom order completed successfully',
      data: order
    });
  }

  /**
   * Cancel custom order
   * @route POST /api/v1/custom-orders/:id/cancel
   */
  async cancelOrder(req, res) {
    const { reason } = req.body;
    const order = await customOrderService.cancelOrder(req.params.id, reason);
    res.json({
      success: true,
      message: 'Custom order cancelled successfully',
      data: order
    });
  }

  /**
   * Get pending custom orders
   * @route GET /api/v1/custom-orders/pending
   */
  async getPendingOrders(req, res) {
    const { store_id } = req.query;
    const orders = await customOrderService.getPendingOrders(store_id || null);
    res.json({
      success: true,
      data: orders
    });
  }

  /**
   * Get overdue custom orders
   * @route GET /api/v1/custom-orders/overdue
   */
  async getOverdueOrders(req, res) {
    const { store_id } = req.query;
    const orders = await customOrderService.getOverdueOrders(store_id || null);
    res.json({
      success: true,
      data: orders
    });
  }

  /**
   * Get orders by customer
   * @route GET /api/v1/custom-orders/customer/:customerId
   */
  async getOrdersByCustomer(req, res) {
    const result = await customOrderService.getOrdersByCustomer(req.params.customerId, req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Get orders by weaver
   * @route GET /api/v1/custom-orders/weaver/:weaverId
   */
  async getOrdersByWeaver(req, res) {
    const result = await customOrderService.getOrdersByWeaver(req.params.weaverId, req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Get custom order statistics
   * @route GET /api/v1/custom-orders/statistics
   */
  async getOrderStatistics(req, res) {
    const stats = await customOrderService.getOrderStatistics(req.query);
    res.json({
      success: true,
      data: stats
    });
  }

  /**
   * Generate custom order number
   * @route GET /api/v1/custom-orders/generate-order-number
   */
  async generateOrderNumber(req, res) {
    const { store_id } = req.query;
    const orderNumber = await customOrderService.generateOrderNumber(store_id);
    res.json({
      success: true,
      data: { order_number: orderNumber }
    });
  }
}

export default new CustomOrderController();
