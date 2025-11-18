import analyticsRepository from '../repositories/analytics.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Analytics Service
 * Business logic for analytics and reporting
 */
class AnalyticsService {
  /**
   * Generate daily sales summary
   * @param {number} storeId - Store ID
   * @param {Date} date - Date to generate summary for
   * @returns {Promise<Object>} Generated summary
   */
  async generateDailySummary(storeId, date = new Date()) {
    if (!storeId) {
      throw new BadRequestError('Store ID is required');
    }

    const summaryDate = new Date(date);
    summaryDate.setHours(0, 0, 0, 0);

    return await analyticsRepository.generateDailySummary(storeId, summaryDate);
  }

  /**
   * Get daily sales summaries for a date range
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Daily summaries
   */
  async getDailySummaries(filters = {}) {
    if (!filters.store_id) {
      throw new BadRequestError('Store ID is required');
    }

    // Default to last 30 days if no date range provided
    if (!filters.start_date && !filters.end_date) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      filters.start_date = startDate;
      filters.end_date = endDate;
    }

    return await analyticsRepository.getDailySummaries(filters);
  }

  /**
   * Get comprehensive dashboard statistics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(filters = {}) {
    if (!filters.store_id) {
      throw new BadRequestError('Store ID is required');
    }

    // Default to current month if no date range provided
    if (!filters.start_date && !filters.end_date) {
      const now = new Date();
      filters.start_date = new Date(now.getFullYear(), now.getMonth(), 1);
      filters.end_date = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const [
      salesStats,
      inventoryReport,
      customerAnalytics,
      topProducts
    ] = await Promise.all([
      analyticsRepository.getDashboardStats(filters),
      analyticsRepository.getInventoryReport(filters.store_id),
      analyticsRepository.getCustomerAnalytics({ store_id: filters.store_id }),
      analyticsRepository.getTopSellingProducts({ ...filters, limit: 10 })
    ]);

    return {
      period: {
        start_date: filters.start_date,
        end_date: filters.end_date
      },
      sales: {
        total_invoices: parseInt(salesStats.total_invoices || 0),
        total_sales: parseFloat(salesStats.total_sales || 0),
        total_gst: parseFloat(salesStats.total_gst || 0),
        total_received: parseFloat(salesStats.total_received || 0),
        total_outstanding: parseFloat(salesStats.total_outstanding || 0),
        average_sale_value: parseFloat(salesStats.average_sale_value || 0),
        unique_customers: parseInt(salesStats.unique_customers || 0),
        total_items_sold: parseInt(salesStats.total_items_sold || 0)
      },
      inventory: {
        total_products: parseInt(inventoryReport.total_products || 0),
        total_stock_quantity: parseInt(inventoryReport.total_stock_quantity || 0),
        total_stock_value: parseFloat(inventoryReport.total_stock_value || 0),
        out_of_stock_count: parseInt(inventoryReport.out_of_stock_count || 0),
        low_stock_count: parseInt(inventoryReport.low_stock_count || 0),
        adequate_stock_count: parseInt(inventoryReport.adequate_stock_count || 0)
      },
      customers: {
        total_customers: parseInt(customerAnalytics.total_customers || 0),
        silver_customers: parseInt(customerAnalytics.silver_customers || 0),
        gold_customers: parseInt(customerAnalytics.gold_customers || 0),
        platinum_customers: parseInt(customerAnalytics.platinum_customers || 0),
        total_customer_purchases: parseFloat(customerAnalytics.total_customer_purchases || 0),
        total_outstanding_balance: parseFloat(customerAnalytics.total_outstanding_balance || 0),
        average_customer_value: parseFloat(customerAnalytics.average_customer_value || 0),
        customers_with_outstanding: parseInt(customerAnalytics.customers_with_outstanding || 0)
      },
      top_products: topProducts
    };
  }

  /**
   * Get top selling products
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Top selling products
   */
  async getTopSellingProducts(filters = {}) {
    const limit = parseInt(filters.limit) || 10;
    if (limit < 1 || limit > 100) {
      throw new BadRequestError('Limit must be between 1 and 100');
    }

    return await analyticsRepository.getTopSellingProducts({ ...filters, limit });
  }

  /**
   * Get inventory status report
   * @param {number} storeId - Store ID
   * @returns {Promise<Object>} Inventory statistics
   */
  async getInventoryReport(storeId) {
    if (!storeId) {
      throw new BadRequestError('Store ID is required');
    }

    const report = await analyticsRepository.getInventoryReport(storeId);

    return {
      total_products: parseInt(report.total_products || 0),
      total_stock_quantity: parseInt(report.total_stock_quantity || 0),
      total_stock_value: parseFloat(report.total_stock_value || 0),
      out_of_stock_count: parseInt(report.out_of_stock_count || 0),
      low_stock_count: parseInt(report.low_stock_count || 0),
      adequate_stock_count: parseInt(report.adequate_stock_count || 0),
      stock_health_percentage: this.calculateStockHealthPercentage(report)
    };
  }

  /**
   * Calculate stock health percentage
   * @param {Object} report - Inventory report
   * @returns {number} Health percentage
   */
  calculateStockHealthPercentage(report) {
    const total = parseInt(report.total_products || 0);
    if (total === 0) return 0;

    const adequate = parseInt(report.adequate_stock_count || 0);
    return Math.round((adequate / total) * 100);
  }

  /**
   * Get customer analytics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Customer analytics
   */
  async getCustomerAnalytics(filters = {}) {
    return await analyticsRepository.getCustomerAnalytics(filters);
  }

  /**
   * Get weaver performance analytics
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Weaver performance data
   */
  async getWeaverPerformance(filters = {}) {
    const limit = parseInt(filters.limit) || 10;
    if (limit < 1 || limit > 100) {
      throw new BadRequestError('Limit must be between 1 and 100');
    }

    return await analyticsRepository.getWeaverPerformance({ ...filters, limit });
  }

  /**
   * Get sales by payment method
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Sales by payment method
   */
  async getSalesByPaymentMethod(filters = {}) {
    if (!filters.store_id) {
      throw new BadRequestError('Store ID is required');
    }

    return await analyticsRepository.getSalesByPaymentMethod(filters);
  }

  /**
   * Get sales trends (daily/weekly/monthly)
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Sales trend data
   */
  async getSalesTrends(filters = {}) {
    if (!filters.store_id) {
      throw new BadRequestError('Store ID is required');
    }

    const validPeriods = ['daily', 'weekly', 'monthly'];
    if (filters.period && !validPeriods.includes(filters.period)) {
      throw new BadRequestError('Period must be daily, weekly, or monthly');
    }

    // Default to last 30 days for daily, last 12 weeks for weekly, last 12 months for monthly
    if (!filters.start_date && !filters.end_date) {
      const endDate = new Date();
      const startDate = new Date();

      switch (filters.period) {
        case 'weekly':
          startDate.setDate(startDate.getDate() - 84); // 12 weeks
          break;
        case 'monthly':
          startDate.setMonth(startDate.getMonth() - 12); // 12 months
          break;
        default:
          startDate.setDate(startDate.getDate() - 30); // 30 days
      }

      filters.start_date = startDate;
      filters.end_date = endDate;
    }

    return await analyticsRepository.getSalesTrends(filters);
  }

  /**
   * Get product category performance
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Category performance data
   */
  async getCategoryPerformance(filters = {}) {
    return await analyticsRepository.getCategoryPerformance(filters);
  }

  /**
   * Get custom order analytics
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Custom order statistics
   */
  async getCustomOrderAnalytics(filters = {}) {
    const stats = await analyticsRepository.getCustomOrderAnalytics(filters);

    return {
      total_custom_orders: parseInt(stats.total_custom_orders || 0),
      completed_orders: parseInt(stats.completed_orders || 0),
      cancelled_orders: parseInt(stats.cancelled_orders || 0),
      pending_orders: parseInt(stats.pending_orders || 0),
      total_estimated_value: parseFloat(stats.total_estimated_value || 0),
      total_final_value: parseFloat(stats.total_final_value || 0),
      average_quality_rating: parseFloat(stats.average_quality_rating || 0),
      avg_completion_days: parseFloat(stats.avg_completion_days || 0),
      completion_rate: this.calculateCompletionRate(stats),
      cancellation_rate: this.calculateCancellationRate(stats)
    };
  }

  /**
   * Calculate completion rate
   * @param {Object} stats - Order statistics
   * @returns {number} Completion rate percentage
   */
  calculateCompletionRate(stats) {
    const total = parseInt(stats.total_custom_orders || 0);
    if (total === 0) return 0;

    const completed = parseInt(stats.completed_orders || 0);
    return Math.round((completed / total) * 100);
  }

  /**
   * Calculate cancellation rate
   * @param {Object} stats - Order statistics
   * @returns {number} Cancellation rate percentage
   */
  calculateCancellationRate(stats) {
    const total = parseInt(stats.total_custom_orders || 0);
    if (total === 0) return 0;

    const cancelled = parseInt(stats.cancelled_orders || 0);
    return Math.round((cancelled / total) * 100);
  }

  /**
   * Get comprehensive monthly report
   * @param {number} storeId - Store ID
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Promise<Object>} Monthly report
   */
  async getMonthlyReport(storeId, year, month) {
    if (!storeId) {
      throw new BadRequestError('Store ID is required');
    }

    if (!year || year < 2000 || year > 2100) {
      throw new BadRequestError('Valid year is required');
    }

    if (!month || month < 1 || month > 12) {
      throw new BadRequestError('Valid month (1-12) is required');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const filters = {
      store_id: storeId,
      start_date: startDate,
      end_date: endDate
    };

    const [
      dashboardStats,
      topProducts,
      categoryPerformance,
      salesByPaymentMethod,
      customOrderStats
    ] = await Promise.all([
      this.getDashboardStats(filters),
      this.getTopSellingProducts({ ...filters, limit: 20 }),
      this.getCategoryPerformance(filters),
      this.getSalesByPaymentMethod(filters),
      this.getCustomOrderAnalytics(filters)
    ]);

    return {
      period: {
        year,
        month,
        month_name: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
        start_date: startDate,
        end_date: endDate
      },
      summary: dashboardStats,
      top_products: topProducts,
      category_performance: categoryPerformance,
      payment_methods: salesByPaymentMethod,
      custom_orders: customOrderStats
    };
  }

  /**
   * Get year-to-date summary
   * @param {number} storeId - Store ID
   * @param {number} year - Year
   * @returns {Promise<Object>} YTD summary
   */
  async getYearToDateSummary(storeId, year = new Date().getFullYear()) {
    if (!storeId) {
      throw new BadRequestError('Store ID is required');
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date();

    const filters = {
      store_id: storeId,
      start_date: startDate,
      end_date: endDate
    };

    return await this.getDashboardStats(filters);
  }
}

export default new AnalyticsService();
