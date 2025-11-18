import { unitRepository } from '../repositories/unit.repository.js';
import { ConflictError, ValidationError } from '../utils/errors.js';

export const unitService = {
  async createUnit(data) {
    // Check if code already exists
    const existing = await unitRepository.findByCode(data.code);
    if (existing) {
      throw new ConflictError('Unit code already exists');
    }

    return unitRepository.create(data);
  },

  async getAllUnits(filters) {
    return unitRepository.findAll(filters);
  },

  async getUnit(id) {
    return unitRepository.findById(id);
  },

  async updateUnit(id, data) {
    // If updating code, check if it's already taken
    if (data.code) {
      const existing = await unitRepository.findByCode(data.code);
      if (existing && existing.id !== parseInt(id)) {
        throw new ConflictError('Unit code already exists');
      }
    }

    return unitRepository.update(id, data);
  },

  async deleteUnit(id) {
    return unitRepository.delete(id);
  },

  async getUnitStats(id) {
    const unit = await unitRepository.findById(id);
    const stats = await unitRepository.getStats(id);
    return { unit, stats };
  },

  async activateUnit(id) {
    return unitRepository.update(id, { status: 'active' });
  },

  async deactivateUnit(id) {
    return unitRepository.update(id, { status: 'inactive' });
  },
};
