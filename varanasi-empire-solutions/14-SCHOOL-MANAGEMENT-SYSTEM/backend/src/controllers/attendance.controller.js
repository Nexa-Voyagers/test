import { asyncHandler } from '../utils/asyncHandler.js';
import { attendanceService } from '../services/attendance.service.js';
import { AppError } from '../utils/errors.js';

/**
 * @desc    Mark attendance for class/section
 * @route   POST /api/v1/attendance/mark
 * @access  Private (Teacher/Admin)
 */
export const markAttendance = asyncHandler(async (req, res) => {
  const { classId, sectionId, date, attendanceRecords } = req.body;
  const markedBy = req.user.id;

  const result = await attendanceService.markAttendance({
    classId,
    sectionId,
    date,
    attendanceRecords,
    markedBy,
  });

  res.status(201).json({
    success: true,
    message: 'Attendance marked successfully',
    data: result,
  });
});

/**
 * @desc    Get attendance for a class/section
 * @route   GET /api/v1/attendance
 * @access  Private
 */
export const getAttendance = asyncHandler(async (req, res) => {
  const { classId, sectionId, date, startDate, endDate } = req.query;

  const attendance = await attendanceService.getAttendance({
    classId,
    sectionId,
    date,
    startDate,
    endDate,
  });

  res.json({
    success: true,
    data: attendance,
  });
});

/**
 * @desc    Get attendance summary for a student
 * @route   GET /api/v1/attendance/student/:studentId
 * @access  Private
 */
export const getStudentAttendanceSummary = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { startDate, endDate, academicYear } = req.query;

  const summary = await attendanceService.getStudentAttendanceSummary(studentId, {
    startDate,
    endDate,
    academicYear,
  });

  res.json({
    success: true,
    data: summary,
  });
});

/**
 * @desc    Get class attendance summary
 * @route   GET /api/v1/attendance/class/:classId/summary
 * @access  Private
 */
export const getClassAttendanceSummary = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { sectionId, startDate, endDate, month } = req.query;

  const summary = await attendanceService.getClassAttendanceSummary(classId, {
    sectionId,
    startDate,
    endDate,
    month,
  });

  res.json({
    success: true,
    data: summary,
  });
});

/**
 * @desc    Update attendance record
 * @route   PUT /api/v1/attendance/:id
 * @access  Private (Teacher/Admin)
 */
export const updateAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const attendance = await attendanceService.updateAttendance(id, updateData);

  res.json({
    success: true,
    message: 'Attendance updated successfully',
    data: attendance,
  });
});

/**
 * @desc    Get low attendance students
 * @route   GET /api/v1/attendance/low-attendance
 * @access  Private (Admin/Principal)
 */
export const getLowAttendanceStudents = asyncHandler(async (req, res) => {
  const { threshold = 75, academicYear } = req.query;
  const schoolId = req.user.schoolId;

  const students = await attendanceService.getLowAttendanceStudents(schoolId, threshold, academicYear);

  res.json({
    success: true,
    data: students,
  });
});

/**
 * @desc    Get teacher attendance (staff attendance)
 * @route   GET /api/v1/attendance/staff
 * @access  Private (Admin/HR)
 */
export const getStaffAttendance = asyncHandler(async (req, res) => {
  const { date, startDate, endDate, teacherId } = req.query;
  const schoolId = req.user.schoolId;

  const attendance = await attendanceService.getStaffAttendance(schoolId, {
    date,
    startDate,
    endDate,
    teacherId,
  });

  res.json({
    success: true,
    data: attendance,
  });
});

/**
 * @desc    Mark staff attendance
 * @route   POST /api/v1/attendance/staff/mark
 * @access  Private (Admin/HR)
 */
export const markStaffAttendance = asyncHandler(async (req, res) => {
  const { date, attendanceRecords } = req.body;
  const markedBy = req.user.id;

  const result = await attendanceService.markStaffAttendance({
    date,
    attendanceRecords,
    markedBy,
  });

  res.status(201).json({
    success: true,
    message: 'Staff attendance marked successfully',
    data: result,
  });
});

/**
 * @desc    Send attendance notifications to parents
 * @route   POST /api/v1/attendance/notify
 * @access  Private (Admin)
 */
export const sendAttendanceNotifications = asyncHandler(async (req, res) => {
  const { classId, sectionId, date } = req.body;

  const result = await attendanceService.sendAttendanceNotifications(classId, sectionId, date);

  res.json({
    success: true,
    message: `Notifications sent to ${result.count} parents`,
    data: result,
  });
});
