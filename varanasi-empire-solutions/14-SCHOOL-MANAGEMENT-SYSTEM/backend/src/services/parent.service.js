import { parentRepository } from '../repositories/parent.repository.js';

class ParentService {
  async getAllParents(schoolId, filters) {
    return await parentRepository.findAll(schoolId, filters);
  }

  async getParentById(id) {
    return await parentRepository.findById(id);
  }

  async createParent(parentData) {
    return await parentRepository.create(parentData);
  }

  async updateParent(id, updateData) {
    return await parentRepository.update(id, updateData);
  }

  async getParentChildren(id) {
    return await parentRepository.findChildren(id);
  }
}

export const parentService = new ParentService();
