import { expenseService } from '../services/expense.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const data = await expenseService.createExpense(req.body);
  res.status(201).json({ success: true, data });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await expenseService.getAllExpenses(req.query);
  res.json({ success: true, count: data.length, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await expenseService.getExpense(req.params.id);
  res.json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await expenseService.updateExpense(req.params.id, req.body);
  res.json({ success: true, data });
});

export const remove = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.params.id);
  res.json({ success: true, message: 'expense deleted' });
});
