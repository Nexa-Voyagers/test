import { centerRepository } from '../repositories/center.repository.js';
export const centerService = {
  async create(data) { return centerRepository.create(data); },
  async getAll(filters) { return centerRepository.findAll(filters); },
  async getById(id) { return centerRepository.findById(id); },
  async update(id, data) { return centerRepository.update(id, data); },
  async delete(id) { return centerRepository.delete(id); }
};
