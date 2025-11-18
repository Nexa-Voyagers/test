import { libraryRepository } from '../repositories/library.repository.js';

class LibraryService {
  async getAllBooks(schoolId, filters) {
    return await libraryRepository.findAll(schoolId, filters);
  }

  async issueBook(issueData) {
    return await libraryRepository.createIssue(issueData);
  }

  async returnBook(issueId, returnedBy) {
    return await libraryRepository.returnBook(issueId, returnedBy);
  }

  async getStudentIssuedBooks(studentId) {
    return await libraryRepository.findIssuedBooksByStudentId(studentId);
  }

  async getOverdueBooks(schoolId) {
    return await libraryRepository.findOverdueBooks(schoolId);
  }
}

export const libraryService = new LibraryService();
