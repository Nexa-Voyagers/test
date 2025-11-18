import { assessmentRepository } from '../repositories/assessment.repository.js';
export const assessmentService = {
  async create(data) { return assessmentRepository.create(data); },
  async getAll(filters) { return assessmentRepository.findAll(filters); },
  async getById(id) { return assessmentRepository.findById(id); },
  async update(id, data) { return assessmentRepository.update(id, data); },
  async delete(id) { return assessmentRepository.delete(id); }
};
