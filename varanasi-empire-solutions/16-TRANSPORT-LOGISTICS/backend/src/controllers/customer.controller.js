import { customerService } from '../services/customer.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const data = await customerService.createCustomer(req.body);
  res.status(201).json({ success: true, data });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await customerService.getAllCustomers(req.query);
  res.json({ success: true, count: data.length, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await customerService.getCustomer(req.params.id);
  res.json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await customerService.updateCustomer(req.params.id, req.body);
  res.json({ success: true, data });
});

export const remove = asyncHandler(async (req, res) => {
  await customerService.deleteCustomer(req.params.id);
  res.json({ success: true, message: 'customer deleted' });
});
