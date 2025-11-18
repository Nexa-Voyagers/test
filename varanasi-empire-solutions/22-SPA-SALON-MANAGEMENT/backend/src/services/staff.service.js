import { staffRepository } from '../repositories/staff.repository.js';
export const staffService = {
  async create(data) { return staffRepository.create(data); },
  async getAll(filters) { return staffRepository.findAll(filters); },
  async getById(id) { return staffRepository.findById(id); },
  async update(id, data) { return staffRepository.update(id, data); },
  async delete(id) { return staffRepository.delete(id); }
};
