import { asyncHandler } from '../utils/asyncHandler.js';
import { classService } from '../services/class.service.js';

export const getAllClasses = asyncHandler(async (req, res) => {
  const schoolId = req.user.schoolId;

  const classes = await classService.getAllClasses(schoolId);

  res.json({
    success: true,
    data: classes,
  });
});

export const getClassById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const classData = await classService.getClassById(id);

  res.json({
    success: true,
    data: classData,
  });
});

export const createClass = asyncHandler(async (req, res) => {
  const classData = req.body;
  const schoolId = req.user.schoolId;

  const newClass = await classService.createClass({ ...classData, schoolId });

  res.status(201).json({
    success: true,
    message: 'Class created successfully',
    data: newClass,
  });
});

export const updateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const classData = await classService.updateClass(id, updateData);

  res.json({
    success: true,
    message: 'Class updated successfully',
    data: classData,
  });
});

export const deleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await classService.deleteClass(id);

  res.json({
    success: true,
    message: 'Class deleted successfully',
  });
});
