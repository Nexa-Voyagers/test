import { deliveryRepository } from '../repositories/delivery.repository.js';
export const deliveryService = {
  async create(data) { return deliveryRepository.create(data); },
  async getAll(filters) { return deliveryRepository.findAll(filters); },
  async getById(id) { return deliveryRepository.findById(id); },
  async update(id, data) { return deliveryRepository.update(id, data); },
  async delete(id) { return deliveryRepository.delete(id); }
};
