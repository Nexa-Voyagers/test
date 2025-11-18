import { reviewRepository } from '../repositories/review.repository.js';
export const reviewService = {
  async create(data) { return reviewRepository.create(data); },
  async getAll(filters) { return reviewRepository.findAll(filters); },
  async getById(id) { return reviewRepository.findById(id); },
  async update(id, data) { return reviewRepository.update(id, data); },
  async delete(id) { return reviewRepository.delete(id); }
};
