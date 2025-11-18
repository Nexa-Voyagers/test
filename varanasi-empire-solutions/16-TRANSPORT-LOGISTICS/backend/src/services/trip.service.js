import { tripRepository } from '../repositories/trip.repository.js';

export const tripService = {
  async createTrip(data) { return tripRepository.create(data); },
  async getAllTrips(filters) { return tripRepository.findAll(filters); },
  async getTrip(id) { return tripRepository.findById(id); },
  async updateTrip(id, data) { return tripRepository.update(id, data); },
  async deleteTrip(id) { return tripRepository.delete(id); }
};
