import { reportRepository } from '../repositories/report.repository.js';

export const reportService = {
  async createReport(data) { return reportRepository.create(data); },
  async getAllReports(filters) { return reportRepository.findAll(filters); },
  async getReport(id) { return reportRepository.findById(id); },
  async updateReport(id, data) { return reportRepository.update(id, data); },
  async deleteReport(id) { return reportRepository.delete(id); }
};
