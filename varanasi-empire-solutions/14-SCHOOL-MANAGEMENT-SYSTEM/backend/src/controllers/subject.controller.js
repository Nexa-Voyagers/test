import { asyncHandler } from '../utils/asyncHandler.js';
import { subjectService } from '../services/subject.service.js';

export const getAllSubjects = asyncHandler(async (req, res) => {
  const { classId } = req.query;
  const schoolId = req.user.schoolId;

  const subjects = await subjectService.getAllSubjects(schoolId, classId);

  res.json({
    success: true,
    data: subjects,
  });
});

export const createSubject = asyncHandler(async (req, res) => {
  const subjectData = req.body;
  const schoolId = req.user.schoolId;

  const subject = await subjectService.createSubject({ ...subjectData, schoolId });

  res.status(201).json({
    success: true,
    message: 'Subject created successfully',
    data: subject,
  });
});

export const updateSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const subject = await subjectService.updateSubject(id, updateData);

  res.json({
    success: true,
    message: 'Subject updated successfully',
    data: subject,
  });
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await subjectService.deleteSubject(id);

  res.json({
    success: true,
    message: 'Subject deleted successfully',
  });
});

export const assignTeacher = asyncHandler(async (req, res) => {
  const { subjectId, teacherId, classId, sectionId } = req.body;

  const assignment = await subjectService.assignTeacher({ subjectId, teacherId, classId, sectionId });

  res.status(201).json({
    success: true,
    message: 'Teacher assigned successfully',
    data: assignment,
  });
});
