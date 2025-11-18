import { platformRepository } from '../repositories/platform.repository.js';
export const platformService = {
  async create(data) { return platformRepository.create(data); },
  async getAll(filters) { return platformRepository.findAll(filters); },
  async getById(id) { return platformRepository.findById(id); },
  async update(id, data) { return platformRepository.update(id, data); },
  async delete(id) { return platformRepository.delete(id); }
};
