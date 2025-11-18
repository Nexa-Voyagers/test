import { salonRepository } from '../repositories/salon.repository.js';
export const salonService = {
  async create(data) { return salonRepository.create(data); },
  async getAll(filters) { return salonRepository.findAll(filters); },
  async getById(id) { return salonRepository.findById(id); },
  async update(id, data) { return salonRepository.update(id, data); },
  async delete(id) { return salonRepository.delete(id); }
};
