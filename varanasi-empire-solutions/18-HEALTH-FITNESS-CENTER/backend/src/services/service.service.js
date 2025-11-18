import { serviceRepository } from '../repositories/service.repository.js';
export const serviceService = {
  async create(data) { return serviceRepository.create(data); },
  async getAll(filters) { return serviceRepository.findAll(filters); },
  async getById(id) { return serviceRepository.findById(id); },
  async update(id, data) { return serviceRepository.update(id, data); },
  async delete(id) { return serviceRepository.delete(id); }
};
