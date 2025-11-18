import { distributorRepository } from '../repositories/distributor.repository.js';
import { ConflictError } from '../utils/errors.js';

export const distributorService = {
  async createDistributor(data) {
    // Check if code already exists
    const existing = await distributorRepository.findByCode(data.code);
    if (existing) {
      throw new ConflictError('Distributor code already exists');
    }

    return distributorRepository.create(data);
  },

  async getAllDistributors(filters) {
    return distributorRepository.findAll(filters);
  },

  async getDistributor(id) {
    return distributorRepository.findById(id);
  },

  async updateDistributor(id, data) {
    // If updating code, check if it's already taken
    if (data.code) {
      const existing = await distributorRepository.findByCode(data.code);
      if (existing && existing.id !== parseInt(id)) {
        throw new ConflictError('Distributor code already exists');
      }
    }

    return distributorRepository.update(id, data);
  },

  async deleteDistributor(id) {
    return distributorRepository.delete(id);
  },

  async getDistributorStats(id) {
    const distributor = await distributorRepository.findById(id);
    const stats = await distributorRepository.getStats(id);
    return { distributor, stats };
  },

  async activateDistributor(id) {
    return distributorRepository.update(id, { status: 'active' });
  },

  async deactivateDistributor(id) {
    return distributorRepository.update(id, { status: 'inactive' });
  },

  async getDistributorsByTerritory(territory) {
    return distributorRepository.findAll({ territory, status: 'active' });
  },

  async getDistributorsWithColdStorage() {
    return distributorRepository.findAll({ has_cold_storage: true, status: 'active' });
  },
};
