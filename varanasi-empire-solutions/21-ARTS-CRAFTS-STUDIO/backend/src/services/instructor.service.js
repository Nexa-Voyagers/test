import { instructorRepository } from '../repositories/instructor.repository.js';
export const instructorService = {
  async create(data) { return instructorRepository.create(data); },
  async getAll(filters) { return instructorRepository.findAll(filters); },
  async getById(id) { return instructorRepository.findById(id); },
  async update(id, data) { return instructorRepository.update(id, data); },
  async delete(id) { return instructorRepository.delete(id); }
};
