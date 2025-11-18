import { orderRepository } from '../repositories/order.repository.js';
import { restaurantRepository } from '../repositories/restaurant.repository.js';
import { menuRepository } from '../repositories/menu.repository.js';
import { tableRepository } from '../repositories/table.repository.js';
import { NotFoundError, AppError, ValidationError } from '../utils/errors.js';
import { transaction } from '../config/database.js';

/**
 * Calculate order totals with taxes and charges
 * @param {string} restaurantId - Restaurant ID
 * @param {number} subtotal - Order subtotal
 * @param {number} discountAmount - Discount amount
 * @returns {Promise<Object>} Calculated totals
 */
const calculateOrderTotals = async (restaurantId, subtotal, discountAmount = 0) => {
  const settings = await restaurantRepository.getSettings(restaurantId);

  const cgstAmount = (subtotal * settings.tax_rate_cgst) / 100;
  const sgstAmount = (subtotal * settings.tax_rate_sgst) / 100;
  const serviceChargeAmount = (subtotal * settings.service_charge_percent) / 100;

  const totalTax = cgstAmount + sgstAmount;
  const totalAmount = subtotal - discountAmount + totalTax + serviceChargeAmount;

  return {
    subtotal,
    discountAmount,
    cgstAmount: Math.round(cgstAmount * 100) / 100,
    sgstAmount: Math.round(sgstAmount * 100) / 100,
    serviceChargeAmount: Math.round(serviceChargeAmount * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
};

/**
 * Create order
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} Created order
 */
const createOrder = async (orderData) => {
  // Validate order type
  const validOrderTypes = ['DINE_IN', 'TAKEAWAY', 'DELIVERY', 'DRIVE_THROUGH'];
  if (!validOrderTypes.includes(orderData.order_type)) {
    throw new ValidationError([{ field: 'order_type', message: 'Invalid order type' }]);
  }

  // Generate order number
  const orderNumber = generateOrderNumber(orderData.restaurant_id);

  // Calculate totals
  const totals = await calculateOrderTotals(
    orderData.restaurant_id,
    orderData.subtotal,
    orderData.discount_amount || 0
  );

  const order = await orderRepository.create({
    ...orderData,
    order_number: orderNumber,
    ...totals,
  });

  // If dine-in, mark table as occupied
  if (orderData.order_type === 'DINE_IN' && orderData.table_id) {
    await tableRepository.updateStatus(orderData.table_id, 'OCCUPIED', order.id);
  }

  return order;
};

/**
 * Get order with items
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order with items
 */
const getOrder = async (orderId) => {
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order');
  }
  return order;
};

/**
 * Add item to order
 * @param {string} orderId - Order ID
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Created order item
 */
const addItemToOrder = async (orderId, itemData) => {
  // Get order
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order');
  }

  // Get menu item
  const menuItem = await menuRepository.findItemById(itemData.menu_item_id);
  if (!menuItem) {
    throw new NotFoundError('Menu item');
  }

  // Calculate item price
  let unitPrice = menuItem.base_price;
  if (itemData.variant_id) {
    const variant = menuItem.variants?.find(v => v.id === itemData.variant_id);
    if (variant) {
      unitPrice += variant.price_adjustment;
    }
  }

  const totalPrice = unitPrice * (itemData.quantity || 1);

  // Add item to order
  const item = await orderRepository.addItem(orderId, {
    ...itemData,
    unit_price: unitPrice,
    total_price: totalPrice,
    item_name: menuItem.item_name,
    item_code: menuItem.item_code,
    cooking_station: menuItem.cooking_station,
  });

  return item;
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError([{ field: 'status', message: 'Invalid order status' }]);
  }

  const order = await orderRepository.updateStatus(orderId, status);
  if (!order) {
    throw new NotFoundError('Order');
  }

  // If order completed or cancelled, release table
  if ((status === 'COMPLETED' || status === 'CANCELLED') && order.table_id) {
    await tableRepository.updateStatus(order.table_id, 'AVAILABLE', null);
  }

  return order;
};

/**
 * Generate KOT (Kitchen Order Ticket)
 * @param {string} orderId - Order ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} KOT details
 */
const generateKOT = async (orderId, userId) => {
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order');
  }

  if (!order.items || order.items.length === 0) {
    throw new AppError('Order has no items', 400);
  }

  // Group items by cooking station
  const stationGroups = {};
  order.items.forEach(item => {
    const station = item.cooking_station || 'KITCHEN_HOT';
    if (!stationGroups[station]) {
      stationGroups[station] = [];
    }
    stationGroups[station].push(item);
  });

  // Create KOT entries for each station
  const kotNumber = generateKOTNumber(order.restaurant_id);

  const kotLog = await orderRepository.createKOT({
    order_id: orderId,
    kot_number: kotNumber,
    cooking_station: 'ALL',
    items: order.items,
    printed_by: userId,
  });

  // Update item statuses
  for (const item of order.items) {
    await orderRepository.updateItemStatus(item.id, 'SENT_TO_KITCHEN');
  }

  return {
    kotNumber,
    orderId,
    items: order.items,
    stationGroups,
    createdAt: kotLog.printed_at,
  };
};

/**
 * Process payment
 * @param {string} orderId - Order ID
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Payment confirmation
 */
const processPayment = async (orderId, paymentData) => {
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order');
  }

  // Validate payment amount
  if (paymentData.amount > order.total_amount) {
    throw new AppError('Payment amount exceeds order total', 400);
  }

  const paidAmount = order.paid_amount + paymentData.amount;
  const balanceAmount = order.total_amount - paidAmount;
  const paymentStatus = balanceAmount === 0 ? 'PAID' : balanceAmount > 0 ? 'PARTIAL' : 'REFUNDED';

  // Update order payment status
  await orderRepository.update(orderId, {
    paid_amount: paidAmount,
    balance_amount: balanceAmount,
    payment_status: paymentStatus,
  });

  return {
    orderId,
    paidAmount,
    balanceAmount,
    paymentStatus,
    totalAmount: order.total_amount,
  };
};

/**
 * Get orders by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Orders and pagination
 */
const getOrdersByRestaurant = async (restaurantId, options = {}) => {
  const { orders, totalCount } = await orderRepository.findByRestaurant(restaurantId, options);

  return {
    orders,
    totalCount,
    page: Math.ceil((options.offset || 0) / (options.limit || 20)) + 1,
    limit: options.limit || 20,
  };
};

/**
 * Get daily sales report
 * @param {string} restaurantId - Restaurant ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Object>} Daily sales data
 */
const getDailySales = async (restaurantId, date) => {
  const sales = await orderRepository.getDailySales(restaurantId, date);
  if (!sales) {
    throw new NotFoundError('Sales data for date');
  }

  return {
    date,
    ...sales,
    netRevenue: sales.gross_revenue - sales.discounts,
    averageOrderValue: sales.total_orders > 0 ? Math.round((sales.gross_revenue / sales.total_orders) * 100) / 100 : 0,
  };
};

/**
 * Cancel order
 * @param {string} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Cancelled order
 */
const cancelOrder = async (orderId, reason, userId) => {
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order');
  }

  if (['COMPLETED', 'CANCELLED'].includes(order.order_status)) {
    throw new AppError('Cannot cancel completed or already cancelled order', 400);
  }

  const updated = await orderRepository.update(orderId, {
    order_status: 'CANCELLED',
    cancelled_at: new Date(),
    cancelled_by: userId,
    cancellation_reason: reason,
  });

  // Release table if dine-in
  if (order.table_id) {
    await tableRepository.updateStatus(order.table_id, 'AVAILABLE', null);
  }

  return updated;
};

/**
 * Generate order number
 * @param {string} restaurantId - Restaurant ID
 * @returns {string} Order number
 */
const generateOrderNumber = (restaurantId) => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

/**
 * Generate KOT number
 * @param {string} restaurantId - Restaurant ID
 * @returns {string} KOT number
 */
const generateKOTNumber = (restaurantId) => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `KOT-${timestamp}-${random}`;
};

/**
 * Update item status
 * @param {string} itemId - Item ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated item
 */
const updateItemStatus = async (itemId, status) => {
  const validStatuses = ['PENDING', 'SENT_TO_KITCHEN', 'PREPARING', 'READY', 'SERVED'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError([{ field: 'status', message: 'Invalid item status' }]);
  }

  const item = await orderRepository.updateItemStatus(itemId, status);
  if (!item) {
    throw new NotFoundError('Order item');
  }

  return item;
};

export const orderService = {
  calculateOrderTotals,
  createOrder,
  getOrder,
  addItemToOrder,
  updateOrderStatus,
  generateKOT,
  processPayment,
  getOrdersByRestaurant,
  getDailySales,
  cancelOrder,
  updateItemStatus,
};
