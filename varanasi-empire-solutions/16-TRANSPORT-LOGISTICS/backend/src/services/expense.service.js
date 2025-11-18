import { expenseRepository } from '../repositories/expense.repository.js';

export const expenseService = {
  async createExpense(data) { return expenseRepository.create(data); },
  async getAllExpenses(filters) { return expenseRepository.findAll(filters); },
  async getExpense(id) { return expenseRepository.findById(id); },
  async updateExpense(id, data) { return expenseRepository.update(id, data); },
  async deleteExpense(id) { return expenseRepository.delete(id); }
};
