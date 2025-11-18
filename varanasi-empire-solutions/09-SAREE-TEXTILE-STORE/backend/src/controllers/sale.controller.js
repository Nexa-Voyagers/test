import saleService from '../services/sale.service.js';

/**
 * Sale Controller
 * Handles HTTP requests for sales management
 */
class SaleController {
  /**
   * Create a new sale invoice
   * @route POST /api/v1/sales
   */
  async createSale(req, res) {
    const { sale_data, items } = req.body;
    const sale = await saleService.createSale(sale_data, items);
    res.status(201).json({
      success: true,
      message: 'Sale invoice created successfully',
      data: sale
    });
  }

  /**
   * Get sale by ID
   * @route GET /api/v1/sales/:id
   */
  async getSaleById(req, res) {
    const sale = await saleService.getSaleById(req.params.id);
    res.json({
      success: true,
      data: sale
    });
  }

  /**
   * Get sale by invoice number
   * @route GET /api/v1/sales/invoice/:invoiceNumber
   */
  async getSaleByInvoiceNumber(req, res) {
    const sale = await saleService.getSaleByInvoiceNumber(req.params.invoiceNumber);
    res.json({
      success: true,
      data: sale
    });
  }

  /**
   * Get all sales with filters
   * @route GET /api/v1/sales
   */
  async getAllSales(req, res) {
    const result = await saleService.getAllSales(req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Update payment status
   * @route PATCH /api/v1/sales/:id/payment
   */
  async updatePaymentStatus(req, res) {
    const sale = await saleService.updatePaymentStatus(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: sale
    });
  }

  /**
   * Get sales summary
   * @route GET /api/v1/sales/summary
   */
  async getSalesSummary(req, res) {
    const summary = await saleService.getSalesSummary(req.query);
    res.json({
      success: true,
      data: summary
    });
  }

  /**
   * Get top selling products
   * @route GET /api/v1/sales/top-products
   */
  async getTopSellingProducts(req, res) {
    const products = await saleService.getTopSellingProducts(req.query);
    res.json({
      success: true,
      data: products
    });
  }

  /**
   * Calculate GST
   * @route POST /api/v1/sales/calculate-gst
   */
  async calculateGST(req, res) {
    const { amount, gst_percentage = 5 } = req.body;
    const gstBreakdown = saleService.calculateGST(amount, gst_percentage);
    res.json({
      success: true,
      data: gstBreakdown
    });
  }

  /**
   * Generate invoice number
   * @route GET /api/v1/sales/generate-invoice-number
   */
  async generateInvoiceNumber(req, res) {
    const { store_id } = req.query;
    const invoiceNumber = await saleService.generateInvoiceNumber(store_id);
    res.json({
      success: true,
      data: { invoice_number: invoiceNumber }
    });
  }

  /**
   * Get daily sales report
   * @route GET /api/v1/sales/daily-report
   */
  async getDailySalesReport(req, res) {
    const { store_id, date } = req.query;
    const reportDate = date ? new Date(date) : new Date();
    const report = await saleService.getDailySalesReport(store_id, reportDate);
    res.json({
      success: true,
      data: report
    });
  }

  /**
   * Validate sale items
   * @route POST /api/v1/sales/validate-items
   */
  async validateSaleItems(req, res) {
    const { items } = req.body;
    const validation = await saleService.validateSaleItems(items);
    res.json({
      success: true,
      data: validation
    });
  }
}

export default new SaleController();
