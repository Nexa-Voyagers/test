import { asyncHandler } from '../utils/asyncHandler.js';
import { studentService } from '../services/student.service.js';
import { AppError } from '../utils/errors.js';

/**
 * @desc    Get all students
 * @route   GET /api/v1/students
 * @access  Private
 */
export const getAllStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, classId, sectionId, academicYear, status } = req.query;
  const schoolId = req.user.schoolId;

  const result = await studentService.getAllStudents(schoolId, {
    page: parseInt(page),
    limit: parseInt(limit),
    classId,
    sectionId,
    academicYear,
    status,
  });

  res.json({
    success: true,
    data: result.students,
    pagination: result.pagination,
  });
});

/**
 * @desc    Get student by ID
 * @route   GET /api/v1/students/:id
 * @access  Private
 */
export const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await studentService.getStudentById(id);

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  res.json({
    success: true,
    data: student,
  });
});

/**
 * @desc    Create new student
 * @route   POST /api/v1/students
 * @access  Private
 */
export const createStudent = asyncHandler(async (req, res) => {
  const studentData = req.body;
  const schoolId = req.user.schoolId;
  const createdBy = req.user.id;

  const student = await studentService.createStudent({ ...studentData, schoolId, createdBy });

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: student,
  });
});

/**
 * @desc    Update student
 * @route   PUT /api/v1/students/:id
 * @access  Private
 */
export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const student = await studentService.updateStudent(id, updateData);

  res.json({
    success: true,
    message: 'Student updated successfully',
    data: student,
  });
});

/**
 * @desc    Delete student
 * @route   DELETE /api/v1/students/:id
 * @access  Private
 */
export const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await studentService.deleteStudent(id);

  res.json({
    success: true,
    message: 'Student deleted successfully',
  });
});

/**
 * @desc    Promote students
 * @route   POST /api/v1/students/promote
 * @access  Private (Admin/Principal only)
 */
export const promoteStudents = asyncHandler(async (req, res) => {
  const { studentIds, targetClassId, targetSectionId, academicYear } = req.body;

  const result = await studentService.promoteStudents(studentIds, targetClassId, targetSectionId, academicYear);

  res.json({
    success: true,
    message: `${result.count} students promoted successfully`,
    data: result,
  });
});

/**
 * @desc    Get student attendance summary
 * @route   GET /api/v1/students/:id/attendance
 * @access  Private
 */
export const getStudentAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  const attendance = await studentService.getStudentAttendance(id, startDate, endDate);

  res.json({
    success: true,
    data: attendance,
  });
});

/**
 * @desc    Get student exam results
 * @route   GET /api/v1/students/:id/results
 * @access  Private
 */
export const getStudentResults = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { academicYear } = req.query;

  const results = await studentService.getStudentResults(id, academicYear);

  res.json({
    success: true,
    data: results,
  });
});

/**
 * @desc    Get student fee status
 * @route   GET /api/v1/students/:id/fees
 * @access  Private
 */
export const getStudentFees = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { academicYear } = req.query;

  const fees = await studentService.getStudentFees(id, academicYear);

  res.json({
    success: true,
    data: fees,
  });
});

/**
 * @desc    Generate student ID card
 * @route   GET /api/v1/students/:id/id-card
 * @access  Private
 */
export const generateIdCard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const idCardData = await studentService.generateIdCard(id);

  res.json({
    success: true,
    data: idCardData,
  });
});

/**
 * @desc    Get student report card
 * @route   GET /api/v1/students/:id/report-card
 * @access  Private
 */
export const getReportCard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { examId } = req.query;

  const reportCard = await studentService.getReportCard(id, examId);

  res.json({
    success: true,
    data: reportCard,
  });
});
