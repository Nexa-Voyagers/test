import { earningRepository } from '../repositories/earning.repository.js';
export const earningService = {
  async create(data) { return earningRepository.create(data); },
  async getAll(filters) { return earningRepository.findAll(filters); },
  async getById(id) { return earningRepository.findById(id); },
  async update(id, data) { return earningRepository.update(id, data); },
  async delete(id) { return earningRepository.delete(id); }
};
