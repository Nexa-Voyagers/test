import { studentRepository } from '../repositories/student.repository.js';
export const studentService = {
  async create(data) { return studentRepository.create(data); },
  async getAll(filters) { return studentRepository.findAll(filters); },
  async getById(id) { return studentRepository.findById(id); },
  async update(id, data) { return studentRepository.update(id, data); },
  async delete(id) { return studentRepository.delete(id); }
};
