import { driverRepository } from '../repositories/driver.repository.js';

export const driverService = {
  async createDriver(data) { return driverRepository.create(data); },
  async getAllDrivers(filters) { return driverRepository.findAll(filters); },
  async getDriver(id) { return driverRepository.findById(id); },
  async updateDriver(id, data) { return driverRepository.update(id, data); },
  async deleteDriver(id) { return driverRepository.delete(id); }
};
