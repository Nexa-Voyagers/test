import Joi from 'joi';
import attendanceService from '../services/attendance.service.js';
import { asyncHandler } from '../asyncHandler.js';
import { ValidationError } from '../errors.js';

/**
 * Attendance Controller
 * Handles HTTP requests for attendance management
 */

// Validation schemas
const markAttendanceSchema = Joi.object({
  enrollment_id: Joi.number().integer().required(),
  attendance_date: Joi.date().required(),
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE').required(),
  marked_by: Joi.string().required(),
  remarks: Joi.string().optional().allow('', null)
});

const markBulkAttendanceSchema = Joi.object({
  batch_id: Joi.number().integer().required(),
  attendance_date: Joi.date().required(),
  marked_by: Joi.string().required(),
  records: Joi.array().items(
    Joi.object({
      enrollment_id: Joi.number().integer().required(),
      status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE').required(),
      remarks: Joi.string().optional().allow('', null)
    })
  ).min(1).required()
});

const updateAttendanceSchema = Joi.object({
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE').optional(),
  remarks: Joi.string().optional().allow('', null)
});

/**
 * @route   POST /api/v1/attendance
 * @desc    Mark attendance for a student
 * @access  Private
 */
export const markAttendance = asyncHandler(async (req, res) => {
  const { error, value } = markAttendanceSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const attendance = await attendanceService.markAttendance(value);

  res.status(201).json({
    success: true,
    message: 'Attendance marked successfully',
    data: attendance
  });
});

/**
 * @route   POST /api/v1/attendance/bulk
 * @desc    Mark bulk attendance for a batch
 * @access  Private
 */
export const markBulkAttendance = asyncHandler(async (req, res) => {
  const { error, value } = markBulkAttendanceSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { batch_id, attendance_date, marked_by, records } = value;
  const attendance = await attendanceService.markBulkAttendance(
    batch_id,
    attendance_date,
    records,
    marked_by
  );

  res.status(201).json({
    success: true,
    message: 'Bulk attendance marked successfully',
    count: attendance.length,
    data: attendance
  });
});

/**
 * @route   GET /api/v1/attendance/:id
 * @desc    Get attendance by ID
 * @access  Private
 */
export const getAttendanceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attendance = await attendanceService.getAttendanceById(parseInt(id));

  res.status(200).json({
    success: true,
    data: attendance
  });
});

/**
 * @route   GET /api/v1/attendance
 * @desc    Get all attendance records
 * @access  Private
 */
export const getAllAttendance = asyncHandler(async (req, res) => {
  const { enrollment_id, batch_id, student_id, attendance_date, date_from, date_to, status } = req.query;

  const filters = {};
  if (enrollment_id) filters.enrollment_id = parseInt(enrollment_id);
  if (batch_id) filters.batch_id = parseInt(batch_id);
  if (student_id) filters.student_id = parseInt(student_id);
  if (attendance_date) filters.attendance_date = attendance_date;
  if (date_from) filters.date_from = date_from;
  if (date_to) filters.date_to = date_to;
  if (status) filters.status = status;

  const attendance = await attendanceService.getAllAttendance(filters);

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

/**
 * @route   PUT /api/v1/attendance/:id
 * @desc    Update attendance
 * @access  Private
 */
export const updateAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateAttendanceSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const attendance = await attendanceService.updateAttendance(parseInt(id), value);

  res.status(200).json({
    success: true,
    message: 'Attendance updated successfully',
    data: attendance
  });
});

/**
 * @route   DELETE /api/v1/attendance/:id
 * @desc    Delete attendance
 * @access  Private
 */
export const deleteAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await attendanceService.deleteAttendance(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Attendance deleted successfully'
  });
});

/**
 * @route   GET /api/v1/enrollments/:enrollmentId/attendance-percentage
 * @desc    Get attendance percentage for an enrollment
 * @access  Private
 */
export const getAttendancePercentage = asyncHandler(async (req, res) => {
  const { enrollmentId } = req.params;
  const percentage = await attendanceService.getAttendancePercentage(parseInt(enrollmentId));

  res.status(200).json({
    success: true,
    data: percentage
  });
});

/**
 * @route   GET /api/v1/batches/:batchId/attendance-report
 * @desc    Get batch attendance report for a specific date
 * @access  Private
 */
export const getBatchAttendanceReport = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const { date } = req.query;

  if (!date) {
    throw new ValidationError('Date is required');
  }

  const report = await attendanceService.getBatchAttendanceReport(parseInt(batchId), date);

  res.status(200).json({
    success: true,
    data: report
  });
});

/**
 * @route   GET /api/v1/students/:studentId/attendance-summary
 * @desc    Get student attendance summary
 * @access  Private
 */
export const getStudentAttendanceSummary = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { batch_id } = req.query;

  const summary = await attendanceService.getStudentAttendanceSummary(
    parseInt(studentId),
    batch_id ? parseInt(batch_id) : null
  );

  res.status(200).json({
    success: true,
    data: summary
  });
});

/**
 * @route   GET /api/v1/batches/:batchId/low-attendance
 * @desc    Get students with low attendance
 * @access  Private
 */
export const getLowAttendanceStudents = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const { threshold } = req.query;

  const students = await attendanceService.getLowAttendanceStudents(
    parseInt(batchId),
    threshold ? parseInt(threshold) : 75
  );

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});
