import saleRepository from '../repositories/sale.repository.js';
import productRepository from '../repositories/product.repository.js';
import customerRepository from '../repositories/customer.repository.js';
import storeRepository from '../repositories/store.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Sale Service
 * Business logic for sales management and GST calculations
 */
class SaleService {
  /**
   * Create a new sale invoice
   * @param {Object} saleData - Sale information
   * @param {Array} items - Sale items
   * @returns {Promise<Object>} Created invoice with items
   */
  async createSale(saleData, items) {
    // Validate required fields
    if (!saleData.store_id) {
      throw new BadRequestError('Store ID is required');
    }

    if (!saleData.invoice_number) {
      throw new BadRequestError('Invoice number is required');
    }

    if (!items || items.length === 0) {
      throw new BadRequestError('At least one item is required');
    }

    // Verify store exists
    const store = await storeRepository.findById(saleData.store_id);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    // Verify customer exists if provided
    if (saleData.customer_id) {
      const customer = await customerRepository.findById(saleData.customer_id);
      if (!customer) {
        throw new NotFoundError('Customer not found');
      }
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

      // Get product details
      const product = await productRepository.findById(item.product_id);
      if (!product) {
        throw new NotFoundError(`Product with ID ${item.product_id} not found`);
      }

      // Check stock availability
      if (product.stock_quantity < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for ${product.product_name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`
        );
      }

      // Determine price based on customer type
      let unitPrice;
      if (saleData.customer_id) {
        const customer = await customerRepository.findById(saleData.customer_id);
        unitPrice = (customer.customer_type === 'WHOLESALE' || customer.customer_type === 'BOUTIQUE')
          ? product.wholesale_price
          : product.retail_price;
      } else {
        unitPrice = item.unit_price || product.retail_price;
      }

      enrichedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        discount_amount: item.discount_amount || 0,
        gst_percentage: product.gst_percentage
      });
    }

    // Validate payment method
    const validPaymentMethods = ['CASH', 'CARD', 'UPI', 'NET_BANKING', 'CHEQUE'];
    if (!validPaymentMethods.includes(saleData.payment_method)) {
      throw new BadRequestError('Invalid payment method');
    }

    // Validate payment status
    const validPaymentStatuses = ['PAID', 'PARTIAL', 'UNPAID'];
    if (saleData.payment_status && !validPaymentStatuses.includes(saleData.payment_status)) {
      throw new BadRequestError('Invalid payment status');
    }

    // Create the sale
    return await saleRepository.createSale(saleData, enrichedItems);
  }

  /**
   * Get sale invoice by ID
   * @param {number} id - Invoice ID
   * @returns {Promise<Object>} Invoice with items
   */
  async getSaleById(id) {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundError('Sale invoice not found');
    }
    return sale;
  }

  /**
   * Get sale invoice by invoice number
   * @param {string} invoiceNumber - Invoice number
   * @returns {Promise<Object>} Invoice with items
   */
  async getSaleByInvoiceNumber(invoiceNumber) {
    const sale = await saleRepository.findByInvoiceNumber(invoiceNumber);
    if (!sale) {
      throw new NotFoundError('Sale invoice not found');
    }
    return sale;
  }

  /**
   * Get all sales with filters and pagination
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Sales list with metadata
   */
  async getAllSales(filters = {}) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const offset = (page - 1) * limit;

    const queryFilters = {
      ...filters,
      limit,
      offset
    };

    const [sales, total] = await Promise.all([
      saleRepository.findAll(queryFilters),
      saleRepository.count(filters)
    ]);

    return {
      data: sales,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update payment status
   * @param {number} id - Invoice ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Updated invoice
   */
  async updatePaymentStatus(id, paymentData) {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundError('Sale invoice not found');
    }

    // Validate payment status
    const validPaymentStatuses = ['PAID', 'PARTIAL', 'UNPAID'];
    if (!validPaymentStatuses.includes(paymentData.payment_status)) {
      throw new BadRequestError('Invalid payment status');
    }

    // Validate payment received
    if (paymentData.payment_received < 0) {
      throw new BadRequestError('Payment received cannot be negative');
    }

    if (paymentData.payment_received > sale.total_amount) {
      throw new BadRequestError('Payment received cannot exceed total amount');
    }

    // Auto-set payment status based on amount
    if (paymentData.payment_received >= sale.total_amount) {
      paymentData.payment_status = 'PAID';
    } else if (paymentData.payment_received > 0) {
      paymentData.payment_status = 'PARTIAL';
    } else {
      paymentData.payment_status = 'UNPAID';
    }

    return await saleRepository.updatePayment(id, paymentData);
  }

  /**
   * Get sales summary for a period
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Sales summary
   */
  async getSalesSummary(filters = {}) {
    return await saleRepository.getSalesSummary(filters);
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

    return await saleRepository.getTopSellingProducts({ ...filters, limit });
  }

  /**
   * Calculate GST for an amount
   * @param {number} amount - Base amount
   * @param {number} gstPercentage - GST percentage
   * @returns {Object} GST breakdown
   */
  calculateGST(amount, gstPercentage = 5) {
    const gstAmount = (amount * gstPercentage) / 100;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return {
      base_amount: amount,
      gst_percentage: gstPercentage,
      cgst,
      sgst,
      total_gst: gstAmount,
      total_amount: amount + gstAmount
    };
  }

  /**
   * Generate invoice number
   * @param {number} storeId - Store ID
   * @returns {Promise<string>} Generated invoice number
   */
  async generateInvoiceNumber(storeId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Format: INV-STID-YYMMDD-XXXX
    const prefix = `INV-${storeId}-${year}${month}${day}`;

    // Get count of invoices today for this store
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const todayCount = await saleRepository.count({
      store_id: storeId,
      start_date: startOfDay,
      end_date: endOfDay
    });

    const sequence = (todayCount + 1).toString().padStart(4, '0');

    return `${prefix}-${sequence}`;
  }

  /**
   * Get daily sales report
   * @param {number} storeId - Store ID
   * @param {Date} date - Date for report
   * @returns {Promise<Object>} Daily sales report
   */
  async getDailySalesReport(storeId, date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const summary = await saleRepository.getSalesSummary({
      store_id: storeId,
      start_date: startOfDay,
      end_date: endOfDay
    });

    const sales = await saleRepository.findAll({
      store_id: storeId,
      start_date: startOfDay,
      end_date: endOfDay
    });

    return {
      date: date.toISOString().split('T')[0],
      summary,
      sales
    };
  }

  /**
   * Validate sale items before creating invoice
   * @param {Array} items - Sale items
   * @returns {Promise<Object>} Validation result
   */
  async validateSaleItems(items) {
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

      if (product.stock_quantity < item.quantity) {
        errors.push(
          `Item ${i + 1} (${product.product_name}): Insufficient stock. Available: ${product.stock_quantity}`
        );
        continue;
      }

      validItems.push({
        product_id: item.product_id,
        product_name: product.product_name,
        quantity: item.quantity,
        available_stock: product.stock_quantity,
        unit_price: product.retail_price,
        gst_percentage: product.gst_percentage
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      validItems
    };
  }
}

export default new SaleService();
