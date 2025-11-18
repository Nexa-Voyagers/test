import { chainRepository } from '../repositories/chain.repository.js';
export const chainService = {
  async create(data) { return chainRepository.create(data); },
  async getAll(filters) { return chainRepository.findAll(filters); },
  async getById(id) { return chainRepository.findById(id); },
  async update(id, data) { return chainRepository.update(id, data); },
  async delete(id) { return chainRepository.delete(id); }
};
