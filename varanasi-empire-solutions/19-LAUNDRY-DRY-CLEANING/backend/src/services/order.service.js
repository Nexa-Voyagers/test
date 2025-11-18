import { orderRepository } from '../repositories/order.repository.js';
export const orderService = {
  async create(data) { return orderRepository.create(data); },
  async getAll(filters) { return orderRepository.findAll(filters); },
  async getById(id) { return orderRepository.findById(id); },
  async update(id, data) { return orderRepository.update(id, data); },
  async delete(id) { return orderRepository.delete(id); }
};
