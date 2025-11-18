import purchaseService from '../services/purchase.service.js';

/**
 * Purchase Controller
 * Handles HTTP requests for purchase order management
 */
class PurchaseController {
  /**
   * Create a new purchase order
   * @route POST /api/v1/purchases
   */
  async createPurchaseOrder(req, res) {
    const { order_data, items } = req.body;
    const order = await purchaseService.createPurchaseOrder(order_data, items);
    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      data: order
    });
  }

  /**
   * Get purchase order by ID
   * @route GET /api/v1/purchases/:id
   */
  async getPurchaseOrderById(req, res) {
    const order = await purchaseService.getPurchaseOrderById(req.params.id);
    res.json({
      success: true,
      data: order
    });
  }

  /**
   * Get purchase order by order number
   * @route GET /api/v1/purchases/order/:orderNumber
   */
  async getPurchaseOrderByOrderNumber(req, res) {
    const order = await purchaseService.getPurchaseOrderByOrderNumber(req.params.orderNumber);
    res.json({
      success: true,
      data: order
    });
  }

  /**
   * Get all purchase orders with filters
   * @route GET /api/v1/purchases
   */
  async getAllPurchaseOrders(req, res) {
    const result = await purchaseService.getAllPurchaseOrders(req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Update purchase order status
   * @route PATCH /api/v1/purchases/:id/status
   */
  async updateOrderStatus(req, res) {
    const { status, ...additionalData } = req.body;
    const order = await purchaseService.updateOrderStatus(
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
   * Update purchase order
   * @route PUT /api/v1/purchases/:id
   */
  async updatePurchaseOrder(req, res) {
    const order = await purchaseService.updatePurchaseOrder(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Purchase order updated successfully',
      data: order
    });
  }

  /**
   * Get pending purchase orders
   * @route GET /api/v1/purchases/pending
   */
  async getPendingOrders(req, res) {
    const { store_id } = req.query;
    const orders = await purchaseService.getPendingOrders(store_id || null);
    res.json({
      success: true,
      data: orders
    });
  }

  /**
   * Get overdue purchase orders
   * @route GET /api/v1/purchases/overdue
   */
  async getOverdueOrders(req, res) {
    const { store_id } = req.query;
    const orders = await purchaseService.getOverdueOrders(store_id || null);
    res.json({
      success: true,
      data: orders
    });
  }

  /**
   * Get purchase summary
   * @route GET /api/v1/purchases/summary
   */
  async getPurchaseSummary(req, res) {
    const summary = await purchaseService.getPurchaseSummary(req.query);
    res.json({
      success: true,
      data: summary
    });
  }

  /**
   * Receive order (mark as completed and update stock)
   * @route POST /api/v1/purchases/:id/receive
   */
  async receiveOrder(req, res) {
    const order = await purchaseService.receiveOrder(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Order received and stock updated successfully',
      data: order
    });
  }

  /**
   * Cancel purchase order
   * @route POST /api/v1/purchases/:id/cancel
   */
  async cancelOrder(req, res) {
    const { reason } = req.body;
    const order = await purchaseService.cancelOrder(req.params.id, reason);
    res.json({
      success: true,
      message: 'Purchase order cancelled successfully',
      data: order
    });
  }

  /**
   * Generate purchase order number
   * @route GET /api/v1/purchases/generate-order-number
   */
  async generateOrderNumber(req, res) {
    const { store_id } = req.query;
    const orderNumber = await purchaseService.generateOrderNumber(store_id);
    res.json({
      success: true,
      data: { order_number: orderNumber }
    });
  }

  /**
   * Get orders by weaver
   * @route GET /api/v1/purchases/weaver/:weaverId
   */
  async getOrdersByWeaver(req, res) {
    const result = await purchaseService.getOrdersByWeaver(req.params.weaverId, req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Validate purchase items
   * @route POST /api/v1/purchases/validate-items
   */
  async validatePurchaseItems(req, res) {
    const { items } = req.body;
    const validation = await purchaseService.validatePurchaseItems(items);
    res.json({
      success: true,
      data: validation
    });
  }
}

export default new PurchaseController();
