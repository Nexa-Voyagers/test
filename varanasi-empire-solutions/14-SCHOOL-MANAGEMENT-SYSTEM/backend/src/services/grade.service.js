import { gradeRepository } from '../repositories/grade.repository.js';

class GradeService {
  async getAllGrades(schoolId) {
    return await gradeRepository.findAll(schoolId);
  }

  async createGrade(gradeData) {
    return await gradeRepository.create(gradeData);
  }

  async updateGrade(id, updateData) {
    return await gradeRepository.update(id, updateData);
  }

  async deleteGrade(id) {
    return await gradeRepository.delete(id);
  }
}

export const gradeService = new GradeService();
