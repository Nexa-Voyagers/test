import { artworkRepository } from '../repositories/artwork.repository.js';
export const artworkService = {
  async create(data) { return artworkRepository.create(data); },
  async getAll(filters) { return artworkRepository.findAll(filters); },
  async getById(id) { return artworkRepository.findById(id); },
  async update(id, data) { return artworkRepository.update(id, data); },
  async delete(id) { return artworkRepository.delete(id); }
};
