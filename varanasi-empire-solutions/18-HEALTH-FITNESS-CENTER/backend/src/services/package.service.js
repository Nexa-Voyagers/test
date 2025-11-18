import { packageRepository } from '../repositories/package.repository.js';
export const packageService = {
  async create(data) { return packageRepository.create(data); },
  async getAll(filters) { return packageRepository.findAll(filters); },
  async getById(id) { return packageRepository.findById(id); },
  async update(id, data) { return packageRepository.update(id, data); },
  async delete(id) { return packageRepository.delete(id); }
};
