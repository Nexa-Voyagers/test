import { membershipRepository } from '../repositories/membership.repository.js';
export const membershipService = {
  async create(data) { return membershipRepository.create(data); },
  async getAll(filters) { return membershipRepository.findAll(filters); },
  async getById(id) { return membershipRepository.findById(id); },
  async update(id, data) { return membershipRepository.update(id, data); },
  async delete(id) { return membershipRepository.delete(id); }
};
