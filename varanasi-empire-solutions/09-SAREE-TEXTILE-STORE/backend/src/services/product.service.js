import productRepository from '../repositories/product.repository.js';
import categoryRepository from '../repositories/category.repository.js';
import storeRepository from '../repositories/store.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

/**
 * Product Service
 * Business logic for product management
 */
class ProductService {
  /**
   * Create a new product
   * @param {Object} productData - Product information
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    // Validate required fields
    if (!productData.store_id) {
      throw new BadRequestError('Store ID is required');
    }

    if (!productData.category_id) {
      throw new BadRequestError('Category ID is required');
    }

    if (!productData.product_name) {
      throw new BadRequestError('Product name is required');
    }

    if (!productData.product_code) {
      throw new BadRequestError('Product code is required');
    }

    if (!productData.fabric_type) {
      throw new BadRequestError('Fabric type is required');
    }

    if (!productData.weave_type) {
      throw new BadRequestError('Weave type is required');
    }

    if (productData.wholesale_price === undefined || productData.wholesale_price === null) {
      throw new BadRequestError('Wholesale price is required');
    }

    if (productData.retail_price === undefined || productData.retail_price === null) {
      throw new BadRequestError('Retail price is required');
    }

    // Verify store exists
    const store = await storeRepository.findById(productData.store_id);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    // Verify category exists
    const category = await categoryRepository.findById(productData.category_id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Check if product code already exists
    const existingProduct = await productRepository.findByProductCode(productData.product_code);
    if (existingProduct) {
      throw new BadRequestError('Product code already exists');
    }

    // Validate prices
    if (productData.wholesale_price < 0 || productData.retail_price < 0) {
      throw new BadRequestError('Prices cannot be negative');
    }

    if (productData.retail_price < productData.wholesale_price) {
      throw new BadRequestError('Retail price should be greater than or equal to wholesale price');
    }

    // Calculate GST based on price (business rule: 5% for ₹0-1000, 12% for >₹1000)
    if (!productData.gst_percentage) {
      productData.gst_percentage = productData.retail_price > 1000 ? 12 : 5;
    }

    return await productRepository.create(productData);
  }

  /**
   * Get product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  /**
   * Get all products with filters and pagination
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Products list with metadata
   */
  async getAllProducts(filters = {}) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const offset = (page - 1) * limit;

    // Parse price range
    if (filters.min_price) {
      filters.min_price = parseFloat(filters.min_price);
    }
    if (filters.max_price) {
      filters.max_price = parseFloat(filters.max_price);
    }

    const queryFilters = {
      ...filters,
      limit,
      offset
    };

    const [products, total] = await Promise.all([
      productRepository.findAll(queryFilters),
      productRepository.count(filters)
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update product
   * @param {number} id - Product ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(id, updates) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Validate category if updating
    if (updates.category_id) {
      const category = await categoryRepository.findById(updates.category_id);
      if (!category) {
        throw new NotFoundError('Category not found');
      }
    }

    // Validate prices if updating
    if (updates.wholesale_price !== undefined || updates.retail_price !== undefined) {
      const newWholesale = updates.wholesale_price !== undefined
        ? updates.wholesale_price
        : product.wholesale_price;
      const newRetail = updates.retail_price !== undefined
        ? updates.retail_price
        : product.retail_price;

      if (newWholesale < 0 || newRetail < 0) {
        throw new BadRequestError('Prices cannot be negative');
      }

      if (newRetail < newWholesale) {
        throw new BadRequestError('Retail price should be greater than or equal to wholesale price');
      }

      // Auto-update GST if price crosses threshold
      if (updates.retail_price !== undefined && !updates.gst_percentage) {
        updates.gst_percentage = updates.retail_price > 1000 ? 12 : 5;
      }
    }

    // Check product code uniqueness if updating
    if (updates.product_code && updates.product_code !== product.product_code) {
      const existingProduct = await productRepository.findByProductCode(updates.product_code);
      if (existingProduct) {
        throw new BadRequestError('Product code already exists');
      }
    }

    return await productRepository.update(id, updates);
  }

  /**
   * Update product stock
   * @param {number} id - Product ID
   * @param {number} quantity - Quantity to add/subtract
   * @param {string} operation - 'add' or 'subtract'
   * @returns {Promise<Object>} Updated product
   */
  async updateProductStock(id, quantity, operation = 'add') {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (quantity < 0) {
      throw new BadRequestError('Quantity cannot be negative');
    }

    if (operation === 'subtract' && product.stock_quantity < quantity) {
      throw new BadRequestError('Insufficient stock');
    }

    return await productRepository.updateStock(id, quantity, operation);
  }

  /**
   * Delete product (soft delete)
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Success message
   */
  async deleteProduct(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    await productRepository.delete(id);

    return { message: 'Product deleted successfully' };
  }

  /**
   * Search products
   * @param {string} searchTerm - Search term
   * @param {number} limit - Limit results
   * @returns {Promise<Array>} Matching products
   */
  async searchProducts(searchTerm, limit = 50) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new BadRequestError('Search term must be at least 2 characters');
    }

    return await productRepository.search(searchTerm, limit);
  }

  /**
   * Get low stock products
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Low stock products
   */
  async getLowStockProducts(storeId = null) {
    return await productRepository.getLowStockProducts(storeId);
  }

  /**
   * Get out of stock products
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Out of stock products
   */
  async getOutOfStockProducts(storeId = null) {
    return await productRepository.getOutOfStockProducts(storeId);
  }

  /**
   * Get products with GI tag
   * @returns {Promise<Array>} GI tagged products
   */
  async getGITaggedProducts() {
    return await productRepository.getGITaggedProducts();
  }

  /**
   * Get product price for customer type
   * @param {number} productId - Product ID
   * @param {string} customerType - Customer type (RETAIL/WHOLESALE/BOUTIQUE)
   * @returns {Promise<Object>} Price information
   */
  async getProductPrice(productId, customerType = 'RETAIL') {
    const product = await this.getProductById(productId);

    let basePrice;
    switch (customerType) {
      case 'WHOLESALE':
      case 'BOUTIQUE':
        basePrice = product.wholesale_price;
        break;
      case 'RETAIL':
      default:
        basePrice = product.retail_price;
        break;
    }

    const gstAmount = (basePrice * product.gst_percentage) / 100;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const totalPrice = basePrice + gstAmount;

    return {
      product_id: product.product_id,
      product_name: product.product_name,
      customer_type: customerType,
      base_price: basePrice,
      gst_percentage: product.gst_percentage,
      cgst,
      sgst,
      total_gst: gstAmount,
      total_price: totalPrice
    };
  }

  /**
   * Bulk update stock (for purchase orders)
   * @param {Array} updates - Array of {product_id, quantity, operation}
   * @returns {Promise<Array>} Updated products
   */
  async bulkUpdateStock(updates) {
    const results = [];

    for (const update of updates) {
      try {
        const product = await this.updateProductStock(
          update.product_id,
          update.quantity,
          update.operation || 'add'
        );
        results.push({ success: true, product });
      } catch (error) {
        results.push({
          success: false,
          product_id: update.product_id,
          error: error.message
        });
      }
    }

    return results;
  }
}

export default new ProductService();
