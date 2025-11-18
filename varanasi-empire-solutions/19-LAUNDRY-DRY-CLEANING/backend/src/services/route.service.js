import { routeRepository } from '../repositories/route.repository.js';
export const routeService = {
  async create(data) { return routeRepository.create(data); },
  async getAll(filters) { return routeRepository.findAll(filters); },
  async getById(id) { return routeRepository.findById(id); },
  async update(id, data) { return routeRepository.update(id, data); },
  async delete(id) { return routeRepository.delete(id); }
};
