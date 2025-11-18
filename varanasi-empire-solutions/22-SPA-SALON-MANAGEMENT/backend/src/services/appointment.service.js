import { appointmentRepository } from '../repositories/appointment.repository.js';
export const appointmentService = {
  async create(data) { return appointmentRepository.create(data); },
  async getAll(filters) { return appointmentRepository.findAll(filters); },
  async getById(id) { return appointmentRepository.findById(id); },
  async update(id, data) { return appointmentRepository.update(id, data); },
  async delete(id) { return appointmentRepository.delete(id); }
};
