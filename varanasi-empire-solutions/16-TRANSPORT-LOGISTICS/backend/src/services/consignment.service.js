import { consignmentRepository } from '../repositories/consignment.repository.js';

export const consignmentService = {
  async createConsignment(data) { return consignmentRepository.create(data); },
  async getAllConsignments(filters) { return consignmentRepository.findAll(filters); },
  async getConsignment(id) { return consignmentRepository.findById(id); },
  async updateConsignment(id, data) { return consignmentRepository.update(id, data); },
  async deleteConsignment(id) { return consignmentRepository.delete(id); }
};
