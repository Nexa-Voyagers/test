import { asyncHandler } from '../utils/asyncHandler.js';
import { reportService } from '../services/report.service.js';

export const getAdmissionReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, classId } = req.query;
  const schoolId = req.user.schoolId;

  const report = await reportService.getAdmissionReport(schoolId, { startDate, endDate, classId });

  res.json({
    success: true,
    data: report,
  });
});

export const getAttendanceReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, classId, sectionId } = req.query;
  const schoolId = req.user.schoolId;

  const report = await reportService.getAttendanceReport(schoolId, { startDate, endDate, classId, sectionId });

  res.json({
    success: true,
    data: report,
  });
});

export const getFeeCollectionReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, classId } = req.query;
  const schoolId = req.user.schoolId;

  const report = await reportService.getFeeCollectionReport(schoolId, { startDate, endDate, classId });

  res.json({
    success: true,
    data: report,
  });
});

export const getExamReport = asyncHandler(async (req, res) => {
  const { examId, classId, sectionId } = req.query;
  const schoolId = req.user.schoolId;

  const report = await reportService.getExamReport(schoolId, { examId, classId, sectionId });

  res.json({
    success: true,
    data: report,
  });
});

export const getLibraryReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const schoolId = req.user.schoolId;

  const report = await reportService.getLibraryReport(schoolId, { startDate, endDate });

  res.json({
    success: true,
    data: report,
  });
});

export const getStudentStrengthReport = asyncHandler(async (req, res) => {
  const { academicYear } = req.query;
  const schoolId = req.user.schoolId;

  const report = await reportService.getStudentStrengthReport(schoolId, academicYear);

  res.json({
    success: true,
    data: report,
  });
});
