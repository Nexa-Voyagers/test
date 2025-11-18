import { reportRepository } from '../repositories/report.repository.js';
export const reportService = {
  async create(data) { return reportRepository.create(data); },
  async getAll(filters) { return reportRepository.findAll(filters); },
  async getById(id) { return reportRepository.findById(id); },
  async update(id, data) { return reportRepository.update(id, data); },
  async delete(id) { return reportRepository.delete(id); }
};
