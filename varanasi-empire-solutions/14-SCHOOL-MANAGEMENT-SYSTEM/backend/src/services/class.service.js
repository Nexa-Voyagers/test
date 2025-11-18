import { classRepository } from '../repositories/class.repository.js';

class ClassService {
  async getAllClasses(schoolId) {
    return await classRepository.findAll(schoolId);
  }

  async getClassById(id) {
    return await classRepository.findById(id);
  }

  async createClass(classData) {
    return await classRepository.create(classData);
  }

  async updateClass(id, updateData) {
    return await classRepository.update(id, updateData);
  }

  async deleteClass(id) {
    return await classRepository.delete(id);
  }
}

export const classService = new ClassService();
