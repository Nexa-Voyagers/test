import { bookingRepository } from '../repositories/booking.repository.js';
export const bookingService = {
  async create(data) { return bookingRepository.create(data); },
  async getAll(filters) { return bookingRepository.findAll(filters); },
  async getById(id) { return bookingRepository.findById(id); },
  async update(id, data) { return bookingRepository.update(id, data); },
  async delete(id) { return bookingRepository.delete(id); }
};
