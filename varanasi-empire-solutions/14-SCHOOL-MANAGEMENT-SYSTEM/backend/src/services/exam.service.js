import { examRepository } from '../repositories/exam.repository.js';
import { AppError, NotFoundError } from '../utils/errors.js';

class ExamService {
  async createExam(examData) {
    return await examRepository.create(examData);
  }

  async getAllExams(schoolId, filters) {
    return await examRepository.findAll(schoolId, filters);
  }

  async getExamById(id) {
    const exam = await examRepository.findById(id);
    if (!exam) {
      throw new NotFoundError('Exam');
    }
    return exam;
  }

  async updateExam(id, updateData) {
    await this.getExamById(id);
    return await examRepository.update(id, updateData);
  }

  async deleteExam(id) {
    await this.getExamById(id);
    return await examRepository.delete(id);
  }

  async createExamTimetable(examId, timetableData) {
    await this.getExamById(examId);
    return await examRepository.createTimetable(examId, timetableData);
  }

  async getExamTimetable(examId, filters) {
    return await examRepository.getTimetable(examId, filters);
  }

  async enterMarks(marksData) {
    // Validate exam, subject, students
    return await examRepository.bulkCreateMarks(marksData);
  }

  async getStudentMarks(studentId, filters) {
    return await examRepository.findMarksByStudentId(studentId, filters);
  }

  async generateReportCard(examId, studentId) {
    const marks = await examRepository.findMarksBy StudentAndExam(studentId, examId);
    const exam = await this.getExamById(examId);

    // Calculate totals and grades
    let totalMarks = 0;
    let totalMaxMarks = 0;

    marks.forEach(mark => {
      totalMarks += mark.marks_obtained || 0;
      totalMaxMarks += mark.max_marks || 0;
    });

    const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks * 100).toFixed(2) : 0;

    return {
      exam,
      marks,
      summary: {
        totalMarks,
        totalMaxMarks,
        percentage: parseFloat(percentage),
      },
    };
  }

  async getClassPerformance(examId, classId, sectionId) {
    return await examRepository.getClassPerformance(examId, classId, sectionId);
  }

  async getSubjectPerformance(examId, subjectId) {
    return await examRepository.getSubjectPerformance(examId, subjectId);
  }

  async getToppers(examId, classId, limit) {
    return await examRepository.findToppers(examId, classId, limit);
  }

  async publishResults(examId, publishedBy) {
    await this.getExamById(examId);
    return await examRepository.publishResults(examId, publishedBy);
  }
}

export const examService = new ExamService();
