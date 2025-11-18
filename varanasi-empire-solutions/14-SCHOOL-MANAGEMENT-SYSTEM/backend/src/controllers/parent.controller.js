import { asyncHandler } from '../utils/asyncHandler.js';
import { parentService } from '../services/parent.service.js';

export const getAllParents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const schoolId = req.user.schoolId;

  const result = await parentService.getAllParents(schoolId, {
    page: parseInt(page),
    limit: parseInt(limit),
    search,
  });

  res.json({
    success: true,
    data: result.parents,
    pagination: result.pagination,
  });
});

export const getParentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const parent = await parentService.getParentById(id);

  res.json({
    success: true,
    data: parent,
  });
});

export const createParent = asyncHandler(async (req, res) => {
  const parentData = req.body;
  const schoolId = req.user.schoolId;

  const parent = await parentService.createParent({ ...parentData, schoolId });

  res.status(201).json({
    success: true,
    message: 'Parent created successfully',
    data: parent,
  });
});

export const updateParent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const parent = await parentService.updateParent(id, updateData);

  res.json({
    success: true,
    message: 'Parent updated successfully',
    data: parent,
  });
});

export const getParentChildren = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const children = await parentService.getParentChildren(id);

  res.json({
    success: true,
    data: children,
  });
});
