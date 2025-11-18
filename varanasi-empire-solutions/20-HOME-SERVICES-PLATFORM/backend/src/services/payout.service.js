import { payoutRepository } from '../repositories/payout.repository.js';
export const payoutService = {
  async create(data) { return payoutRepository.create(data); },
  async getAll(filters) { return payoutRepository.findAll(filters); },
  async getById(id) { return payoutRepository.findById(id); },
  async update(id, data) { return payoutRepository.update(id, data); },
  async delete(id) { return payoutRepository.delete(id); }
};
