import { vehicleRepository } from '../repositories/vehicle.repository.js';

export const vehicleService = {
  async createVehicle(data) { return vehicleRepository.create(data); },
  async getAllVehicles(filters) { return vehicleRepository.findAll(filters); },
  async getVehicle(id) { return vehicleRepository.findById(id); },
  async updateVehicle(id, data) { return vehicleRepository.update(id, data); },
  async deleteVehicle(id) { return vehicleRepository.delete(id); }
};
