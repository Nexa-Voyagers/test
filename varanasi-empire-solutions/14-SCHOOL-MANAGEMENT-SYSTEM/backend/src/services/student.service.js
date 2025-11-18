import { studentRepository } from '../repositories/student.repository.js';
import { AppError, NotFoundError } from '../utils/errors.js';

class StudentService {
  async getAllStudents(schoolId, filters) {
    return await studentRepository.findAll(schoolId, filters);
  }

  async getStudentById(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError('Student');
    }
    return student;
  }

  async createStudent(studentData) {
    // Check for duplicate admission number
    const existing = await studentRepository.findByAdmissionNumber(studentData.admission_number);
    if (existing) {
      throw new AppError('Admission number already exists', 409);
    }

    return await studentRepository.create(studentData);
  }

  async updateStudent(id, updateData) {
    const student = await this.getStudentById(id);
    return await studentRepository.update(id, updateData);
  }

  async deleteStudent(id) {
    await this.getStudentById(id);
    return await studentRepository.delete(id);
  }

  async promoteStudents(studentIds, targetClassId, targetSectionId, academicYear) {
    const count = await studentRepository.promoteStudents(studentIds, targetClassId, targetSectionId, academicYear);
    return { count };
  }

  async getStudentAttendance(studentId, startDate, endDate) {
    return await studentRepository.getAttendanceByStudentId(studentId, startDate, endDate);
  }

  async getStudentResults(studentId, academicYear) {
    return await studentRepository.getResultsByStudentId(studentId, academicYear);
  }

  async getStudentFees(studentId, academicYear) {
    return await studentRepository.getFeesByStudentId(studentId, academicYear);
  }

  async generateIdCard(studentId) {
    const student = await this.getStudentById(studentId);
    // Generate ID card data/QR code
    return {
      student,
      qrCode: `STUDENT-${student.admission_number}`,
    };
  }

  async getReportCard(studentId, examId) {
    return await studentRepository.getReportCard(studentId, examId);
  }
}

export const studentService = new StudentService();
