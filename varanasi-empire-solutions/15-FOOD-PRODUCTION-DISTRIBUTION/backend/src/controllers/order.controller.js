import { orderService } from '../services/order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).json({ success: true, message: 'Order created', data: order });
});

export const addOrderItem = asyncHandler(async (req, res) => {
  const item = await orderService.addOrderItem(req.params.orderId, req.body);
  res.status(201).json({ success: true, message: 'Item added', data: item });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const filters = {
    distributor_id: req.query.distributor_id,
    status: req.query.status,
    payment_status: req.query.payment_status,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    limit: parseInt(req.query.limit) || 50,
    offset: parseInt(req.query.offset) || 0,
  };
  const orders = await orderService.getAllOrders(filters);
  res.json({ success: true, count: orders.length, data: orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(req.params.id);
  res.json({ success: true, data: order });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrder(req.params.id, req.body);
  res.json({ success: true, message: 'Order updated', data: order });
});

export const approveOrder = asyncHandler(async (req, res) => {
  const order = await orderService.approveOrder(req.params.id, req.user.id);
  res.json({ success: true, message: 'Order approved', data: order });
});

export const processOrder = asyncHandler(async (req, res) => {
  const order = await orderService.processOrder(req.params.id);
  res.json({ success: true, message: 'Order processing', data: order });
});

export const shipOrder = asyncHandler(async (req, res) => {
  const order = await orderService.shipOrder(req.params.id, req.body.tracking_info);
  res.json({ success: true, message: 'Order shipped', data: order });
});

export const deliverOrder = asyncHandler(async (req, res) => {
  const order = await orderService.deliverOrder(req.params.id);
  res.json({ success: true, message: 'Order delivered', data: order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.body.reason);
  res.json({ success: true, message: 'Order cancelled', data: order });
});

export const recordPayment = asyncHandler(async (req, res) => {
  const { amount, payment_date } = req.body;
  const order = await orderService.recordPayment(req.params.id, amount, payment_date);
  res.json({ success: true, message: 'Payment recorded', data: order });
});
