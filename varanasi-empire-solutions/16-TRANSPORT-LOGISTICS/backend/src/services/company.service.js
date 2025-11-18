import { companyRepository } from '../repositories/company.repository.js';

export const companyService = {
  async createCompany(data) { return companyRepository.create(data); },
  async getAllCompanys(filters) { return companyRepository.findAll(filters); },
  async getCompany(id) { return companyRepository.findById(id); },
  async updateCompany(id, data) { return companyRepository.update(id, data); },
  async deleteCompany(id) { return companyRepository.delete(id); }
};
