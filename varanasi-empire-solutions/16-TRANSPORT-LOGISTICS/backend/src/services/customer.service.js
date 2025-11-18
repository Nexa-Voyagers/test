import { customerRepository } from '../repositories/customer.repository.js';

export const customerService = {
  async createCustomer(data) { return customerRepository.create(data); },
  async getAllCustomers(filters) { return customerRepository.findAll(filters); },
  async getCustomer(id) { return customerRepository.findById(id); },
  async updateCustomer(id, data) { return customerRepository.update(id, data); },
  async deleteCustomer(id) { return customerRepository.delete(id); }
};
