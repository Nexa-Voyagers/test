import { invoiceRepository } from '../repositories/invoice.repository.js';
export const invoiceService = {
  async create(data) { return invoiceRepository.create(data); },
  async getAll(filters) { return invoiceRepository.findAll(filters); },
  async getById(id) { return invoiceRepository.findById(id); },
  async update(id, data) { return invoiceRepository.update(id, data); },
  async delete(id) { return invoiceRepository.delete(id); }
};
