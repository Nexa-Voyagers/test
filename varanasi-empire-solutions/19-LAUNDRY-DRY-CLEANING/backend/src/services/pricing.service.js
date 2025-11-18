import { pricingRepository } from '../repositories/pricing.repository.js';
export const pricingService = {
  async create(data) { return pricingRepository.create(data); },
  async getAll(filters) { return pricingRepository.findAll(filters); },
  async getById(id) { return pricingRepository.findById(id); },
  async update(id, data) { return pricingRepository.update(id, data); },
  async delete(id) { return pricingRepository.delete(id); }
};
