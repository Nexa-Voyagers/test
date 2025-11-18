import { schoolRepository } from '../repositories/school.repository.js';

class SchoolService {
  async getAllSchools() {
    return await schoolRepository.findAll();
  }

  async getSchoolById(id) {
    return await schoolRepository.findById(id);
  }

  async createSchool(schoolData) {
    return await schoolRepository.create(schoolData);
  }

  async updateSchool(id, updateData) {
    return await schoolRepository.update(id, updateData);
  }

  async getSchoolStats(schoolId) {
    return await schoolRepository.getStats(schoolId);
  }
}

export const schoolService = new SchoolService();
