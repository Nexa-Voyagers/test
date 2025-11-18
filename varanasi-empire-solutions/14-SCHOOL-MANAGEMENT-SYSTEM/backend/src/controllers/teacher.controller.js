import { asyncHandler } from '../utils/asyncHandler.js';
import { teacherService } from '../services/teacher.service.js';

export const getAllTeachers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, department, status } = req.query;
  const schoolId = req.user.schoolId;

  const result = await teacherService.getAllTeachers(schoolId, {
    page: parseInt(page),
    limit: parseInt(limit),
    department,
    status,
  });

  res.json({
    success: true,
    data: result.teachers,
    pagination: result.pagination,
  });
});

export const getTeacherById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const teacher = await teacherService.getTeacherById(id);

  res.json({
    success: true,
    data: teacher,
  });
});

export const createTeacher = asyncHandler(async (req, res) => {
  const teacherData = req.body;
  const schoolId = req.user.schoolId;
  const createdBy = req.user.id;

  const teacher = await teacherService.createTeacher({ ...teacherData, schoolId, createdBy });

  res.status(201).json({
    success: true,
    message: 'Teacher created successfully',
    data: teacher,
  });
});

export const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const teacher = await teacherService.updateTeacher(id, updateData);

  res.json({
    success: true,
    message: 'Teacher updated successfully',
    data: teacher,
  });
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await teacherService.deleteTeacher(id);

  res.json({
    success: true,
    message: 'Teacher deleted successfully',
  });
});

export const getTeacherTimetable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  const timetable = await teacherService.getTeacherTimetable(id, date);

  res.json({
    success: true,
    data: timetable,
  });
});
