import { studioRepository } from '../repositories/studio.repository.js';
export const studioService = {
  async create(data) { return studioRepository.create(data); },
  async getAll(filters) { return studioRepository.findAll(filters); },
  async getById(id) { return studioRepository.findById(id); },
  async update(id, data) { return studioRepository.update(id, data); },
  async delete(id) { return studioRepository.delete(id); }
};
