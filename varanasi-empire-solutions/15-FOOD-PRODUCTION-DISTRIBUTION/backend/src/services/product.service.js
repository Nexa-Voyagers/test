import { productRepository } from '../repositories/product.repository.js';
import { ConflictError } from '../utils/errors.js';

export const productService = {
  async createProduct(data) {
    // Check if SKU already exists
    const existing = await productRepository.findBySku(data.sku);
    if (existing) {
      throw new ConflictError('Product SKU already exists');
    }

    // Calculate expiry date if shelf life is provided
    if (data.shelf_life_days && !data.expiry_date) {
      const productionDate = new Date();
      const expiryDate = new Date(productionDate);
      expiryDate.setDate(expiryDate.getDate() + data.shelf_life_days);
      data.expiry_date = expiryDate;
    }

    return productRepository.create(data);
  },

  async getAllProducts(filters) {
    return productRepository.findAll(filters);
  },

  async getProduct(id) {
    return productRepository.findById(id);
  },

  async updateProduct(id, data) {
    // If updating SKU, check if it's already taken
    if (data.sku) {
      const existing = await productRepository.findBySku(data.sku);
      if (existing && existing.id !== parseInt(id)) {
        throw new ConflictError('Product SKU already exists');
      }
    }

    return productRepository.update(id, data);
  },

  async deleteProduct(id) {
    return productRepository.delete(id);
  },

  async getCategories() {
    return productRepository.getCategories();
  },

  async activateProduct(id) {
    return productRepository.update(id, { status: 'active' });
  },

  async deactivateProduct(id) {
    return productRepository.update(id, { status: 'inactive' });
  },
};
