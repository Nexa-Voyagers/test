import { routeRepository } from '../repositories/route.repository.js';

export const routeService = {
  async createRoute(data) { return routeRepository.create(data); },
  async getAllRoutes(filters) { return routeRepository.findAll(filters); },
  async getRoute(id) { return routeRepository.findById(id); },
  async updateRoute(id, data) { return routeRepository.update(id, data); },
  async deleteRoute(id) { return routeRepository.delete(id); }
};
