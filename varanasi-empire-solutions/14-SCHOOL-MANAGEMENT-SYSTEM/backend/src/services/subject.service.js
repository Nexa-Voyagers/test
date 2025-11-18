import { subjectRepository } from '../repositories/subject.repository.js';

class SubjectService {
  async getAllSubjects(schoolId, classId) {
    return await subjectRepository.findAll(schoolId, classId);
  }

  async createSubject(subjectData) {
    return await subjectRepository.create(subjectData);
  }

  async updateSubject(id, updateData) {
    return await subjectRepository.update(id, updateData);
  }

  async deleteSubject(id) {
    return await subjectRepository.delete(id);
  }

  async assignTeacher(assignmentData) {
    return await subjectRepository.assignTeacher(assignmentData);
  }
}

export const subjectService = new SubjectService();
