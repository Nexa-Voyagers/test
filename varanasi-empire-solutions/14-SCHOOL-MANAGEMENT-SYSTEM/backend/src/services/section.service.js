import { sectionRepository } from '../repositories/section.repository.js';

class SectionService {
  async getAllSections(schoolId, classId) {
    return await sectionRepository.findAll(schoolId, classId);
  }

  async createSection(sectionData) {
    return await sectionRepository.create(sectionData);
  }

  async updateSection(id, updateData) {
    return await sectionRepository.update(id, updateData);
  }

  async deleteSection(id) {
    return await sectionRepository.delete(id);
  }
}

export const sectionService = new SectionService();
