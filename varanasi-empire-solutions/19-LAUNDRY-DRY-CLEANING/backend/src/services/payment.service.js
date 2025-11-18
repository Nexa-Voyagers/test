import { paymentRepository } from '../repositories/payment.repository.js';
export const paymentService = {
  async create(data) { return paymentRepository.create(data); },
  async getAll(filters) { return paymentRepository.findAll(filters); },
  async getById(id) { return paymentRepository.findById(id); },
  async update(id, data) { return paymentRepository.update(id, data); },
  async delete(id) { return paymentRepository.delete(id); }
};
