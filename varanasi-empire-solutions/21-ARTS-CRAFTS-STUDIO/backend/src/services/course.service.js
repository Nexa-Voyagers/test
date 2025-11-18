import { courseRepository } from '../repositories/course.repository.js';
export const courseService = {
  async create(data) { return courseRepository.create(data); },
  async getAll(filters) { return courseRepository.findAll(filters); },
  async getById(id) { return courseRepository.findById(id); },
  async update(id, data) { return courseRepository.update(id, data); },
  async delete(id) { return courseRepository.delete(id); }
};
