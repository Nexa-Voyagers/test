import { materialRepository } from '../repositories/material.repository.js';
export const materialService = {
  async create(data) { return materialRepository.create(data); },
  async getAll(filters) { return materialRepository.findAll(filters); },
  async getById(id) { return materialRepository.findById(id); },
  async update(id, data) { return materialRepository.update(id, data); },
  async delete(id) { return materialRepository.delete(id); }
};
