import { providerRepository } from '../repositories/provider.repository.js';
export const providerService = {
  async create(data) { return providerRepository.create(data); },
  async getAll(filters) { return providerRepository.findAll(filters); },
  async getById(id) { return providerRepository.findById(id); },
  async update(id, data) { return providerRepository.update(id, data); },
  async delete(id) { return providerRepository.delete(id); }
};
