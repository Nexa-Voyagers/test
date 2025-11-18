import { asyncHandler } from '../utils/asyncHandler.js';
import { libraryService } from '../services/library.service.js';

export const getAllBooks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category, status } = req.query;
  const schoolId = req.user.schoolId;

  const result = await libraryService.getAllBooks(schoolId, {
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    category,
    status,
  });

  res.json({
    success: true,
    data: result.books,
    pagination: result.pagination,
  });
});

export const issueBook = asyncHandler(async (req, res) => {
  const { bookId, studentId, dueDate } = req.body;
  const issuedBy = req.user.id;

  const issue = await libraryService.issueBook({ bookId, studentId, dueDate, issuedBy });

  res.status(201).json({
    success: true,
    message: 'Book issued successfully',
    data: issue,
  });
});

export const returnBook = asyncHandler(async (req, res) => {
  const { issueId } = req.body;
  const returnedBy = req.user.id;

  const result = await libraryService.returnBook(issueId, returnedBy);

  res.json({
    success: true,
    message: 'Book returned successfully',
    data: result,
  });
});

export const getStudentIssuedBooks = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const books = await libraryService.getStudentIssuedBooks(studentId);

  res.json({
    success: true,
    data: books,
  });
});

export const getOverdueBooks = asyncHandler(async (req, res) => {
  const schoolId = req.user.schoolId;

  const overdueBooks = await libraryService.getOverdueBooks(schoolId);

  res.json({
    success: true,
    data: overdueBooks,
  });
});
