import { asyncHandler } from '../utils/asyncHandler.js';
import { gradeService } from '../services/grade.service.js';

export const getAllGrades = asyncHandler(async (req, res) => {
  const schoolId = req.user.schoolId;

  const grades = await gradeService.getAllGrades(schoolId);

  res.json({
    success: true,
    data: grades,
  });
});

export const createGrade = asyncHandler(async (req, res) => {
  const gradeData = req.body;
  const schoolId = req.user.schoolId;

  const grade = await gradeService.createGrade({ ...gradeData, schoolId });

  res.status(201).json({
    success: true,
    message: 'Grade created successfully',
    data: grade,
  });
});

export const updateGrade = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const grade = await gradeService.updateGrade(id, updateData);

  res.json({
    success: true,
    message: 'Grade updated successfully',
    data: grade,
  });
});

export const deleteGrade = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await gradeService.deleteGrade(id);

  res.json({
    success: true,
    message: 'Grade deleted successfully',
  });
});
