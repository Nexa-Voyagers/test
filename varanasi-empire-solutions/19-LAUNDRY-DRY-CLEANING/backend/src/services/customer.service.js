import { customerRepository } from '../repositories/customer.repository.js';
export const customerService = {
  async create(data) { return customerRepository.create(data); },
  async getAll(filters) { return customerRepository.findAll(filters); },
  async getById(id) { return customerRepository.findById(id); },
  async update(id, data) { return customerRepository.update(id, data); },
  async delete(id) { return customerRepository.delete(id); }
};
