import { asyncHandler } from '../utils/asyncHandler.js';
import { examService } from '../services/exam.service.js';
import { AppError } from '../utils/errors.js';

/**
 * @desc    Create exam schedule
 * @route   POST /api/v1/exams
 * @access  Private (Admin/Academic Coordinator)
 */
export const createExam = asyncHandler(async (req, res) => {
  const examData = req.body;
  const schoolId = req.user.schoolId;
  const createdBy = req.user.id;

  const exam = await examService.createExam({ ...examData, schoolId, createdBy });

  res.status(201).json({
    success: true,
    message: 'Exam created successfully',
    data: exam,
  });
});

/**
 * @desc    Get all exams
 * @route   GET /api/v1/exams
 * @access  Private
 */
export const getAllExams = asyncHandler(async (req, res) => {
  const { academicYear, examType, classId } = req.query;
  const schoolId = req.user.schoolId;

  const exams = await examService.getAllExams(schoolId, { academicYear, examType, classId });

  res.json({
    success: true,
    data: exams,
  });
});

/**
 * @desc    Get exam by ID
 * @route   GET /api/v1/exams/:id
 * @access  Private
 */
export const getExamById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const exam = await examService.getExamById(id);

  if (!exam) {
    throw new AppError('Exam not found', 404);
  }

  res.json({
    success: true,
    data: exam,
  });
});

/**
 * @desc    Update exam
 * @route   PUT /api/v1/exams/:id
 * @access  Private (Admin/Academic Coordinator)
 */
export const updateExam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const exam = await examService.updateExam(id, updateData);

  res.json({
    success: true,
    message: 'Exam updated successfully',
    data: exam,
  });
});

/**
 * @desc    Delete exam
 * @route   DELETE /api/v1/exams/:id
 * @access  Private (Admin only)
 */
export const deleteExam = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await examService.deleteExam(id);

  res.json({
    success: true,
    message: 'Exam deleted successfully',
  });
});

/**
 * @desc    Create exam timetable
 * @route   POST /api/v1/exams/:examId/timetable
 * @access  Private (Admin/Academic Coordinator)
 */
export const createExamTimetable = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const timetableData = req.body;

  const timetable = await examService.createExamTimetable(examId, timetableData);

  res.status(201).json({
    success: true,
    message: 'Exam timetable created successfully',
    data: timetable,
  });
});

/**
 * @desc    Get exam timetable
 * @route   GET /api/v1/exams/:examId/timetable
 * @access  Private
 */
export const getExamTimetable = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const { classId, sectionId } = req.query;

  const timetable = await examService.getExamTimetable(examId, { classId, sectionId });

  res.json({
    success: true,
    data: timetable,
  });
});

/**
 * @desc    Enter exam marks
 * @route   POST /api/v1/exams/marks/entry
 * @access  Private (Teacher)
 */
export const enterMarks = asyncHandler(async (req, res) => {
  const { examId, subjectId, classId, sectionId, marks } = req.body;
  const enteredBy = req.user.id;

  const result = await examService.enterMarks({
    examId,
    subjectId,
    classId,
    sectionId,
    marks,
    enteredBy,
  });

  res.status(201).json({
    success: true,
    message: 'Marks entered successfully',
    data: result,
  });
});

/**
 * @desc    Get student marks
 * @route   GET /api/v1/exams/marks/student/:studentId
 * @access  Private
 */
export const getStudentMarks = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { examId, academicYear } = req.query;

  const marks = await examService.getStudentMarks(studentId, { examId, academicYear });

  res.json({
    success: true,
    data: marks,
  });
});

/**
 * @desc    Generate report card
 * @route   GET /api/v1/exams/:examId/report-card/:studentId
 * @access  Private
 */
export const generateReportCard = asyncHandler(async (req, res) => {
  const { examId, studentId } = req.params;

  const reportCard = await examService.generateReportCard(examId, studentId);

  res.json({
    success: true,
    data: reportCard,
  });
});

/**
 * @desc    Get class performance analysis
 * @route   GET /api/v1/exams/:examId/analysis/class/:classId
 * @access  Private (Admin/Teacher)
 */
export const getClassPerformance = asyncHandler(async (req, res) => {
  const { examId, classId } = req.params;
  const { sectionId } = req.query;

  const analysis = await examService.getClassPerformance(examId, classId, sectionId);

  res.json({
    success: true,
    data: analysis,
  });
});

/**
 * @desc    Get subject-wise performance
 * @route   GET /api/v1/exams/:examId/analysis/subject/:subjectId
 * @access  Private (Admin/Teacher)
 */
export const getSubjectPerformance = asyncHandler(async (req, res) => {
  const { examId, subjectId } = req.params;

  const analysis = await examService.getSubjectPerformance(examId, subjectId);

  res.json({
    success: true,
    data: analysis,
  });
});

/**
 * @desc    Get toppers list
 * @route   GET /api/v1/exams/:examId/toppers
 * @access  Private
 */
export const getToppers = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const { classId, limit = 10 } = req.query;

  const toppers = await examService.getToppers(examId, classId, parseInt(limit));

  res.json({
    success: true,
    data: toppers,
  });
});

/**
 * @desc    Publish exam results
 * @route   POST /api/v1/exams/:examId/publish
 * @access  Private (Admin only)
 */
export const publishResults = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const publishedBy = req.user.id;

  const result = await examService.publishResults(examId, publishedBy);

  res.json({
    success: true,
    message: 'Results published successfully',
    data: result,
  });
});
