import { classRepository } from '../repositories/class.repository.js';
export const classService = {
  async create(data) { return classRepository.create(data); },
  async getAll(filters) { return classRepository.findAll(filters); },
  async getById(id) { return classRepository.findById(id); },
  async update(id, data) { return classRepository.update(id, data); },
  async delete(id) { return classRepository.delete(id); }
};
