import { productRepository } from '../repositories/product.repository.js';
export const productService = {
  async create(data) { return productRepository.create(data); },
  async getAll(filters) { return productRepository.findAll(filters); },
  async getById(id) { return productRepository.findById(id); },
  async update(id, data) { return productRepository.update(id, data); },
  async delete(id) { return productRepository.delete(id); }
};
