import { asyncHandler } from '../utils/asyncHandler.js';
import { schoolService } from '../services/school.service.js';

export const getAllSchools = asyncHandler(async (req, res) => {
  const schools = await schoolService.getAllSchools();

  res.json({
    success: true,
    data: schools,
  });
});

export const getSchoolById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const school = await schoolService.getSchoolById(id);

  res.json({
    success: true,
    data: school,
  });
});

export const createSchool = asyncHandler(async (req, res) => {
  const schoolData = req.body;
  const createdBy = req.user.id;

  const school = await schoolService.createSchool({ ...schoolData, createdBy });

  res.status(201).json({
    success: true,
    message: 'School created successfully',
    data: school,
  });
});

export const updateSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const school = await schoolService.updateSchool(id, updateData);

  res.json({
    success: true,
    message: 'School updated successfully',
    data: school,
  });
});

export const getSchoolStats = asyncHandler(async (req, res) => {
  const schoolId = req.user.schoolId;

  const stats = await schoolService.getSchoolStats(schoolId);

  res.json({
    success: true,
    data: stats,
  });
});
