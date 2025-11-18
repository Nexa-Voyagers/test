import { therapistRepository } from '../repositories/therapist.repository.js';
export const therapistService = {
  async create(data) { return therapistRepository.create(data); },
  async getAll(filters) { return therapistRepository.findAll(filters); },
  async getById(id) { return therapistRepository.findById(id); },
  async update(id, data) { return therapistRepository.update(id, data); },
  async delete(id) { return therapistRepository.delete(id); }
};
