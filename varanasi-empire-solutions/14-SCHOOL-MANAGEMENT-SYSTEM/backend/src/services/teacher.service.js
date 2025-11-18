import { teacherRepository } from '../repositories/teacher.repository.js';

class TeacherService {
  async getAllTeachers(schoolId, filters) {
    return await teacherRepository.findAll(schoolId, filters);
  }

  async getTeacherById(id) {
    return await teacherRepository.findById(id);
  }

  async createTeacher(teacherData) {
    return await teacherRepository.create(teacherData);
  }

  async updateTeacher(id, updateData) {
    return await teacherRepository.update(id, updateData);
  }

  async deleteTeacher(id) {
    return await teacherRepository.delete(id);
  }

  async getTeacherTimetable(id, date) {
    return await teacherRepository.getTimetable(id, date);
  }
}

export const teacherService = new TeacherService();
