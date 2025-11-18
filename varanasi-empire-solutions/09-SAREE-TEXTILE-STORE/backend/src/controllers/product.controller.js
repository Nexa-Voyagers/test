import productService from '../services/product.service.js';

/**
 * Product Controller
 * Handles HTTP requests for product management
 */
class ProductController {
  /**
   * Create a new product
   * @route POST /api/v1/products
   */
  async createProduct(req, res) {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  }

  /**
   * Get product by ID
   * @route GET /api/v1/products/:id
   */
  async getProductById(req, res) {
    const product = await productService.getProductById(req.params.id);
    res.json({
      success: true,
      data: product
    });
  }

  /**
   * Get all products with filters
   * @route GET /api/v1/products
   */
  async getAllProducts(req, res) {
    const result = await productService.getAllProducts(req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Update product
   * @route PUT /api/v1/products/:id
   */
  async updateProduct(req, res) {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  }

  /**
   * Update product stock
   * @route PATCH /api/v1/products/:id/stock
   */
  async updateStock(req, res) {
    const { quantity, operation = 'add' } = req.body;
    const product = await productService.updateProductStock(
      req.params.id,
      quantity,
      operation
    );
    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    });
  }

  /**
   * Delete product
   * @route DELETE /api/v1/products/:id
   */
  async deleteProduct(req, res) {
    const result = await productService.deleteProduct(req.params.id);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Search products
   * @route GET /api/v1/products/search
   */
  async searchProducts(req, res) {
    const { q, limit = 50 } = req.query;
    const products = await productService.searchProducts(q, parseInt(limit));
    res.json({
      success: true,
      data: products
    });
  }

  /**
   * Get low stock products
   * @route GET /api/v1/products/low-stock
   */
  async getLowStockProducts(req, res) {
    const { store_id } = req.query;
    const products = await productService.getLowStockProducts(store_id || null);
    res.json({
      success: true,
      data: products
    });
  }

  /**
   * Get out of stock products
   * @route GET /api/v1/products/out-of-stock
   */
  async getOutOfStockProducts(req, res) {
    const { store_id } = req.query;
    const products = await productService.getOutOfStockProducts(store_id || null);
    res.json({
      success: true,
      data: products
    });
  }

  /**
   * Get GI tagged products
   * @route GET /api/v1/products/gi-tagged
   */
  async getGITaggedProducts(req, res) {
    const products = await productService.getGITaggedProducts();
    res.json({
      success: true,
      data: products
    });
  }

  /**
   * Get product price for customer type
   * @route GET /api/v1/products/:id/price
   */
  async getProductPrice(req, res) {
    const { customer_type = 'RETAIL' } = req.query;
    const price = await productService.getProductPrice(req.params.id, customer_type);
    res.json({
      success: true,
      data: price
    });
  }

  /**
   * Bulk update stock
   * @route POST /api/v1/products/bulk-update-stock
   */
  async bulkUpdateStock(req, res) {
    const { updates } = req.body;
    const results = await productService.bulkUpdateStock(updates);
    res.json({
      success: true,
      data: results
    });
  }
}

export default new ProductController();
