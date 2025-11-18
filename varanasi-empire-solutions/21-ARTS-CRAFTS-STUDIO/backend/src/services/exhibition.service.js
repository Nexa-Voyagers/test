import { exhibitionRepository } from '../repositories/exhibition.repository.js';
export const exhibitionService = {
  async create(data) { return exhibitionRepository.create(data); },
  async getAll(filters) { return exhibitionRepository.findAll(filters); },
  async getById(id) { return exhibitionRepository.findById(id); },
  async update(id, data) { return exhibitionRepository.update(id, data); },
  async delete(id) { return exhibitionRepository.delete(id); }
};
