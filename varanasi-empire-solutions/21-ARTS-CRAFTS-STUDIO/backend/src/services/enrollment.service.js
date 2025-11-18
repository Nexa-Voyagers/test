import { enrollmentRepository } from '../repositories/enrollment.repository.js';
export const enrollmentService = {
  async create(data) { return enrollmentRepository.create(data); },
  async getAll(filters) { return enrollmentRepository.findAll(filters); },
  async getById(id) { return enrollmentRepository.findById(id); },
  async update(id, data) { return enrollmentRepository.update(id, data); },
  async delete(id) { return enrollmentRepository.delete(id); }
};
