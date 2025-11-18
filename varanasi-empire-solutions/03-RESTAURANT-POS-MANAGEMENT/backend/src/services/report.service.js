import { orderRepository } from '../repositories/order.repository.js';
import { tableRepository } from '../repositories/table.repository.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

/**
 * Get sales report for date range
 * @param {string} restaurantId - Restaurant ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Sales report
 */
const getSalesReport = async (restaurantId, startDate, endDate) => {
  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new ValidationError([{ field: 'dates', message: 'Invalid date format' }]);
  }

  if (start > end) {
    throw new ValidationError([{ field: 'endDate', message: 'End date must be after start date' }]);
  }

  const orders = await orderRepository.findByDateRange(restaurantId, startDate, endDate);

  if (orders.length === 0) {
    return {
      startDate,
      endDate,
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      totalDiscount: 0,
      totalTax: 0,
      orders: [],
    };
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalDiscount = orders.reduce((sum, order) => sum + (order.discount_amount || 0), 0);
  const totalTax = orders.reduce((sum, order) => sum + ((order.cgst_amount || 0) + (order.sgst_amount || 0)), 0);

  return {
    startDate,
    endDate,
    totalOrders: orders.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageOrderValue: Math.round((totalRevenue / orders.length) * 100) / 100,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    netRevenue: Math.round((totalRevenue - totalDiscount) * 100) / 100,
    orders,
  };
};

/**
 * Get daily sales report
 * @param {string} restaurantId - Restaurant ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Object>} Daily sales report
 */
const getDailySalesReport = async (restaurantId, date) => {
  const sales = await orderRepository.getDailySales(restaurantId, date);

  if (!sales) {
    return {
      date,
      totalOrders: 0,
      grossRevenue: 0,
      netRevenue: 0,
      averageOrderValue: 0,
    };
  }

  const netRevenue = sales.gross_revenue - sales.discounts;
  const averageOrderValue = sales.total_orders > 0 ? Math.round((sales.gross_revenue / sales.total_orders) * 100) / 100 : 0;

  return {
    date,
    totalOrders: sales.total_orders,
    dineInOrders: sales.dine_in_orders,
    takeawayOrders: sales.takeaway_orders,
    deliveryOrders: sales.delivery_orders,
    cancelledOrders: sales.cancelled_orders,
    grossRevenue: Math.round(sales.gross_revenue * 100) / 100,
    discounts: Math.round(sales.discounts * 100) / 100,
    taxes: Math.round(sales.taxes_collected * 100) / 100,
    netRevenue: Math.round(netRevenue * 100) / 100,
    averageOrderValue,
    uniqueCustomers: sales.unique_customers,
  };
};

/**
 * Get revenue report by order type
 * @param {string} restaurantId - Restaurant ID
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Object>} Revenue by order type
 */
const getRevenueByOrderType = async (restaurantId, startDate, endDate) => {
  const orders = await orderRepository.findByDateRange(restaurantId, startDate, endDate);

  const orderTypes = {};
  orders.forEach(order => {
    if (!orderTypes[order.order_type]) {
      orderTypes[order.order_type] = {
        count: 0,
        revenue: 0,
        discount: 0,
        tax: 0,
      };
    }
    orderTypes[order.order_type].count++;
    orderTypes[order.order_type].revenue += order.total_amount || 0;
    orderTypes[order.order_type].discount += order.discount_amount || 0;
    orderTypes[order.order_type].tax += (order.cgst_amount || 0) + (order.sgst_amount || 0);
  });

  // Format results
  const results = {};
  Object.keys(orderTypes).forEach(type => {
    const data = orderTypes[type];
    results[type] = {
      count: data.count,
      revenue: Math.round(data.revenue * 100) / 100,
      discount: Math.round(data.discount * 100) / 100,
      tax: Math.round(data.tax * 100) / 100,
      averageOrderValue: Math.round((data.revenue / data.count) * 100) / 100,
    };
  });

  return results;
};

/**
 * Get table occupancy report
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} Table occupancy statistics
 */
const getTableOccupancyReport = async (restaurantId) => {
  const stats = await tableRepository.getStatistics(restaurantId);

  return {
    totalTables: stats.total_tables || 0,
    availableTables: stats.available_tables || 0,
    occupiedTables: stats.occupied_tables || 0,
    reservedTables: stats.reserved_tables || 0,
    totalCapacity: stats.total_capacity || 0,
    occupancyRate: stats.total_tables > 0 ? Math.round((stats.occupied_tables / stats.total_tables) * 100) : 0,
    availabilityRate: stats.total_tables > 0 ? Math.round((stats.available_tables / stats.total_tables) * 100) : 0,
  };
};

/**
 * Get inventory report
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} Inventory statistics
 */
const getInventoryReport = async (restaurantId) => {
  const value = await inventoryRepository.getInventoryValue(restaurantId);
  const lowStockItems = await inventoryRepository.findLowStock(restaurantId);

  return {
    totalValue: Math.round(value.total_value * 100) / 100,
    totalItems: value.total_items || 0,
    lowStockCount: value.low_stock_count || 0,
    lowStockItems: lowStockItems.map(item => ({
      id: item.id,
      name: item.item_name,
      code: item.item_code,
      currentStock: item.current_stock,
      minStock: item.min_stock_level,
      deficit: item.stock_deficit,
    })),
  };
};

/**
 * Get performance metrics
 * @param {string} restaurantId - Restaurant ID
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Object>} Performance metrics
 */
const getPerformanceMetrics = async (restaurantId, startDate, endDate) => {
  const orders = await orderRepository.findByDateRange(restaurantId, startDate, endDate);

  if (orders.length === 0) {
    return {
      startDate,
      endDate,
      totalOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      completionRate: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      totalDiscountsGiven: 0,
      discountPercentage: 0,
    };
  }

  const completedOrders = orders.filter(o => o.order_status === 'COMPLETED').length;
  const cancelledOrders = orders.filter(o => o.order_status === 'CANCELLED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalDiscounts = orders.reduce((sum, o) => sum + (o.discount_amount || 0), 0);
  const grossRevenue = orders.reduce((sum, o) => sum + ((o.subtotal || o.total_amount) + (o.discount_amount || 0)), 0);

  return {
    startDate,
    endDate,
    totalOrders: orders.length,
    completedOrders,
    cancelledOrders,
    completionRate: Math.round((completedOrders / orders.length) * 100),
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageOrderValue: Math.round((totalRevenue / orders.length) * 100) / 100,
    totalDiscountsGiven: Math.round(totalDiscounts * 100) / 100,
    discountPercentage: grossRevenue > 0 ? Math.round((totalDiscounts / grossRevenue) * 100 * 100) / 100 : 0,
  };
};

/**
 * Get hourly sales distribution
 * @param {string} restaurantId - Restaurant ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Array>} Hourly sales
 */
const getHourlySalesDistribution = async (restaurantId, date) => {
  const orders = await orderRepository.findByDateRange(restaurantId, date, date);

  const hourlyData = {};

  // Initialize all hours
  for (let hour = 0; hour < 24; hour++) {
    hourlyData[hour] = {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      orders: 0,
      revenue: 0,
    };
  }

  // Fill in data
  orders.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    hourlyData[hour].orders++;
    hourlyData[hour].revenue += order.total_amount || 0;
  });

  return Object.values(hourlyData);
};

/**
 * Get payment method breakdown
 * @param {string} restaurantId - Restaurant ID
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Object>} Payment methods
 */
const getPaymentMethodBreakdown = async (restaurantId, startDate, endDate) => {
  // This would typically come from a payments table
  // For now, we'll return a structure based on what the system supports
  return {
    startDate,
    endDate,
    paymentMethods: {
      CASH: {
        count: 0,
        amount: 0,
        percentage: 0,
      },
      CARD: {
        count: 0,
        amount: 0,
        percentage: 0,
      },
      UPI: {
        count: 0,
        amount: 0,
        percentage: 0,
      },
      ONLINE: {
        count: 0,
        amount: 0,
        percentage: 0,
      },
    },
  };
};

export const reportService = {
  getSalesReport,
  getDailySalesReport,
  getRevenueByOrderType,
  getTableOccupancyReport,
  getInventoryReport,
  getPerformanceMetrics,
  getHourlySalesDistribution,
  getPaymentMethodBreakdown,
};
