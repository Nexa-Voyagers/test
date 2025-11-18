import { orderRepository } from '../repositories/order.repository.js';
import { distributorRepository } from '../repositories/distributor.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';
import { ConflictError, ValidationError } from '../utils/errors.js';

export const orderService = {
  async createOrder(data) {
    // Validate distributor exists
    await distributorRepository.findById(data.distributor_id);

    // Generate order number if not provided
    if (!data.order_number) {
      const prefix = 'DO';
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      data.order_number = `${prefix}${timestamp}${random}`;
    }

    // Check if order number already exists
    const existing = await orderRepository.findByOrderNumber(data.order_number);
    if (existing) {
      throw new ConflictError('Order number already exists');
    }

    return orderRepository.create(data);
  },

  async addOrderItem(orderId, itemData) {
    const order = await orderRepository.findById(orderId);

    if (order.status !== 'pending' && order.status !== 'draft') {
      throw new ValidationError('Cannot add items to processed orders');
    }

    // Validate product exists
    await productRepository.findById(itemData.product_id);

    // Calculate item totals
    const subtotal = itemData.quantity * itemData.unit_price;
    const discount = itemData.discount || 0;
    const taxAmount = ((subtotal - discount) * itemData.tax_rate) / 100;
    const total = subtotal - discount + taxAmount;

    const item = await orderRepository.createItem({
      order_id: orderId,
      ...itemData,
      tax_amount: taxAmount,
      total: total,
    });

    // Update order totals
    await this.recalculateOrderTotals(orderId);

    return item;
  },

  async recalculateOrderTotals(orderId) {
    const items = await orderRepository.findOrderItems(orderId);
    const order = await orderRepository.findById(orderId);

    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total), 0);
    const taxAmount = items.reduce((sum, item) => sum + parseFloat(item.tax_amount), 0);
    const totalAmount = subtotal + (order.delivery_charge || 0);

    return orderRepository.update(orderId, {
      subtotal: subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
    });
  },

  async getAllOrders(filters) {
    return orderRepository.findAll(filters);
  },

  async getOrder(id) {
    const order = await orderRepository.findById(id);
    const items = await orderRepository.findOrderItems(id);
    return { ...order, items };
  },

  async getOrderItems(orderId) {
    return orderRepository.findOrderItems(orderId);
  },

  async updateOrder(id, data) {
    return orderRepository.update(id, data);
  },

  async approveOrder(id, approvedBy) {
    const order = await orderRepository.findById(id);

    if (order.status !== 'pending') {
      throw new ValidationError('Only pending orders can be approved');
    }

    return orderRepository.update(id, {
      status: 'approved',
      approved_by: approvedBy,
    });
  },

  async processOrder(id) {
    const order = await orderRepository.findById(id);

    if (order.status !== 'approved') {
      throw new ValidationError('Only approved orders can be processed');
    }

    // Reserve inventory for order items
    const items = await orderRepository.findOrderItems(id);
    for (const item of items) {
      const inventory = await inventoryRepository.findByProductAndUnit(
        item.product_id,
        order.unit_id || 1
      );
      if (inventory) {
        await inventoryRepository.reserveStock(inventory.id, item.quantity);
      }
    }

    return orderRepository.updateStatus(id, 'processing');
  },

  async shipOrder(id, trackingInfo) {
    const order = await orderRepository.findById(id);

    if (order.status !== 'processing') {
      throw new ValidationError('Only processing orders can be shipped');
    }

    return orderRepository.update(id, {
      status: 'shipped',
      metadata: { ...order.metadata, tracking_info: trackingInfo },
    });
  },

  async deliverOrder(id) {
    const order = await orderRepository.findById(id);

    if (order.status !== 'shipped') {
      throw new ValidationError('Only shipped orders can be marked as delivered');
    }

    // Release reserved stock and reduce inventory
    const items = await orderRepository.findOrderItems(id);
    for (const item of items) {
      const inventory = await inventoryRepository.findByProductAndUnit(
        item.product_id,
        order.unit_id || 1
      );
      if (inventory) {
        await inventoryRepository.releaseStock(inventory.id, item.quantity);
        await inventoryRepository.updateStock(inventory.id, item.quantity, 'subtract');
      }
    }

    return orderRepository.updateStatus(id, 'delivered');
  },

  async cancelOrder(id, reason) {
    const order = await orderRepository.findById(id);

    if (order.status === 'delivered') {
      throw new ValidationError('Delivered orders cannot be cancelled');
    }

    // Release any reserved stock
    if (order.status === 'processing' || order.status === 'shipped') {
      const items = await orderRepository.findOrderItems(id);
      for (const item of items) {
        const inventory = await inventoryRepository.findByProductAndUnit(
          item.product_id,
          order.unit_id || 1
        );
        if (inventory) {
          await inventoryRepository.releaseStock(inventory.id, item.quantity);
        }
      }
    }

    return orderRepository.updateStatus(id, 'cancelled', reason);
  },

  async recordPayment(id, amount, paymentDate) {
    const order = await orderRepository.findById(id);
    const newPaidAmount = parseFloat(order.paid_amount || 0) + parseFloat(amount);
    const paymentStatus = newPaidAmount >= order.total_amount ? 'paid' : 'partial';

    return orderRepository.update(id, {
      paid_amount: newPaidAmount,
      payment_status: paymentStatus,
      payment_date: paymentDate || new Date(),
    });
  },

  async getSalesStats(filters) {
    return orderRepository.getSalesStats(filters);
  },

  async getOrdersByDistributor(distributorId, filters = {}) {
    return orderRepository.findAll({ ...filters, distributor_id: distributorId });
  },
};
