import { reportRepository } from '../repositories/report.repository.js';

class ReportService {
  async getAdmissionReport(schoolId, filters) {
    return await reportRepository.getAdmissionReport(schoolId, filters);
  }

  async getAttendanceReport(schoolId, filters) {
    return await reportRepository.getAttendanceReport(schoolId, filters);
  }

  async getFeeCollectionReport(schoolId, filters) {
    return await reportRepository.getFeeCollectionReport(schoolId, filters);
  }

  async getExamReport(schoolId, filters) {
    return await reportRepository.getExamReport(schoolId, filters);
  }

  async getLibraryReport(schoolId, filters) {
    return await reportRepository.getLibraryReport(schoolId, filters);
  }

  async getStudentStrengthReport(schoolId, academicYear) {
    return await reportRepository.getStudentStrengthReport(schoolId, academicYear);
  }
}

export const reportService = new ReportService();
