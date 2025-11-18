import { warehouseRepository } from '../repositories/warehouse.repository.js';

export const warehouseService = {
  async createWarehouse(data) { return warehouseRepository.create(data); },
  async getAllWarehouses(filters) { return warehouseRepository.findAll(filters); },
  async getWarehouse(id) { return warehouseRepository.findById(id); },
  async updateWarehouse(id, data) { return warehouseRepository.update(id, data); },
  async deleteWarehouse(id) { return warehouseRepository.delete(id); }
};
