import { asyncHandler } from '../utils/asyncHandler.js';
import { sectionService } from '../services/section.service.js';

export const getAllSections = asyncHandler(async (req, res) => {
  const { classId } = req.query;
  const schoolId = req.user.schoolId;

  const sections = await sectionService.getAllSections(schoolId, classId);

  res.json({
    success: true,
    data: sections,
  });
});

export const createSection = asyncHandler(async (req, res) => {
  const sectionData = req.body;
  const section = await sectionService.createSection(sectionData);

  res.status(201).json({
    success: true,
    message: 'Section created successfully',
    data: section,
  });
});

export const updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const section = await sectionService.updateSection(id, updateData);

  res.json({
    success: true,
    message: 'Section updated successfully',
    data: section,
  });
});

export const deleteSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await sectionService.deleteSection(id);

  res.json({
    success: true,
    message: 'Section deleted successfully',
  });
});
