import { orderService } from '../services/order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Create order
 * POST /api/orders
 */
const createOrder = asyncHandler(async (req, res) => {
  const {
    order_type,
    customer_id,
    customer_name,
    customer_phone,
    table_id,
    floor_id,
    guest_count,
    delivery_address,
    delivery_instructions,
    delivery_partner,
    delivery_charge,
    subtotal,
    discount_amount,
    discount_reason,
    special_instructions,
  } = req.body;

  const order = await orderService.createOrder({
    restaurant_id: req.user.restaurant_id,
    order_type,
    customer_id,
    customer_name,
    customer_phone,
    table_id,
    floor_id,
    guest_count,
    delivery_address,
    delivery_instructions,
    delivery_partner,
    delivery_charge,
    subtotal,
    discount_amount,
    discount_reason,
    special_instructions,
    created_by: req.user.id,
  });

  logger.info(`Order created: ${order.order_number}`);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

/**
 * Get order by ID
 * GET /api/orders/:id
 */
const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await orderService.getOrder(id);

  res.json({
    success: true,
    data: order,
  });
});

/**
 * Add item to order
 * POST /api/orders/:orderId/items
 */
const addItem = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const {
    menu_item_id,
    variant_id,
    quantity,
    customizations,
    special_instructions,
  } = req.body;

  const item = await orderService.addItemToOrder(orderId, {
    menu_item_id,
    variant_id,
    quantity,
    customizations,
    special_instructions,
  });

  logger.info(`Item added to order: ${orderId}`);

  res.status(201).json({
    success: true,
    message: 'Item added successfully',
    data: item,
  });
});

/**
 * Update order status
 * PATCH /api/orders/:id/status
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await orderService.updateOrderStatus(id, status);

  logger.info(`Order status updated: ${id} -> ${status}`);

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: order,
  });
});

/**
 * Generate KOT
 * POST /api/orders/:id/kot
 */
const generateKOT = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const kot = await orderService.generateKOT(id, req.user.id);

  logger.info(`KOT generated for order: ${id} - ${kot.kotNumber}`);

  res.status(201).json({
    success: true,
    message: 'KOT generated successfully',
    data: kot,
  });
});

/**
 * Process payment
 * POST /api/orders/:id/payment
 */
const processPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, payment_method, card_type, card_last4, upi_transaction_id, gateway_transaction_id } = req.body;

  const payment = await orderService.processPayment(id, { amount });

  logger.info(`Payment processed for order: ${id} - Amount: ${amount}`);

  res.json({
    success: true,
    message: 'Payment processed successfully',
    data: payment,
  });
});

/**
 * Get orders by restaurant
 * GET /api/orders
 */
const getRestaurantOrders = asyncHandler(async (req, res) => {
  const { limit = 20, offset = 0, status, orderType } = req.query;

  const result = await orderService.getOrdersByRestaurant(req.user.restaurant_id, {
    limit: parseInt(limit),
    offset: parseInt(offset),
    status,
    orderType,
  });

  res.json({
    success: true,
    data: result,
  });
});

/**
 * Get daily sales
 * GET /api/orders/sales/daily/:date
 */
const getDailySales = asyncHandler(async (req, res) => {
  const { date } = req.params;

  const sales = await orderService.getDailySales(req.user.restaurant_id, date);

  res.json({
    success: true,
    data: sales,
  });
});

/**
 * Cancel order
 * PATCH /api/orders/:id/cancel
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await orderService.cancelOrder(id, reason, req.user.id);

  logger.info(`Order cancelled: ${id} - Reason: ${reason}`);

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: order,
  });
});

/**
 * Update item status
 * PATCH /api/orders/items/:itemId/status
 */
const updateItemStatus = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { status } = req.body;

  const item = await orderService.updateItemStatus(itemId, status);

  logger.info(`Order item status updated: ${itemId} -> ${status}`);

  res.json({
    success: true,
    message: 'Item status updated successfully',
    data: item,
  });
});

/**
 * Calculate order totals (for preview)
 * POST /api/orders/calculate-total
 */
const calculateTotal = asyncHandler(async (req, res) => {
  const { subtotal, discount_amount } = req.body;

  const totals = await orderService.calculateOrderTotals(
    req.user.restaurant_id,
    subtotal,
    discount_amount || 0
  );

  res.json({
    success: true,
    data: totals,
  });
});

/**
 * Get active orders by table
 * GET /api/orders/table/:tableId
 */
const getOrdersByTable = asyncHandler(async (req, res) => {
  const { tableId } = req.params;

  // This would use a repository method to find orders by table
  res.json({
    success: true,
    message: 'This endpoint would return active orders for a table',
  });
});

export const orderController = {
  createOrder,
  getOrder,
  addItem,
  updateOrderStatus,
  generateKOT,
  processPayment,
  getRestaurantOrders,
  getDailySales,
  cancelOrder,
  updateItemStatus,
  calculateTotal,
  getOrdersByTable,
};
