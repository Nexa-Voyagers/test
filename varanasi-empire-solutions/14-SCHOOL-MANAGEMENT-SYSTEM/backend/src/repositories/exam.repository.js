import { pool } from '../config/database.js';

class ExamRepository {
  async create(examData) {
    const result = await pool.query(
      'INSERT INTO exams (school_id, exam_name, exam_type, academic_year, start_date, end_date, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [examData.schoolId, examData.exam_name, examData.exam_type, examData.academic_year, examData.start_date, examData.end_date, examData.createdBy]
    );
    return result.rows[0];
  }

  async findAll(schoolId, filters) {
    let query = 'SELECT * FROM exams WHERE school_id = $1';
    const params = [schoolId];
    if (filters.academicYear) { params.push(filters.academicYear); query += ` AND academic_year = $${params.length}`; }
    if (filters.examType) { params.push(filters.examType); query += ` AND exam_type = $${params.length}`; }
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);
    return result.rows[0];
  }

  async update(id, updateData) {
    const result = await pool.query(
      'UPDATE exams SET exam_name = COALESCE($2, exam_name), start_date = COALESCE($3, start_date), end_date = COALESCE($4, end_date), updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, updateData.exam_name, updateData.start_date, updateData.end_date]
    );
    return result.rows[0];
  }

  async delete(id) {
    await pool.query('DELETE FROM exams WHERE id = $1', [id]);
  }

  async createTimetable(examId, timetableData) {
    return {};
  }

  async getTimetable(examId, filters) {
    return [];
  }

  async bulkCreateMarks(marksData) {
    return {};
  }

  async findMarksByStudentId(studentId, filters) {
    return [];
  }

  async findMarksByStudentAndExam(studentId, examId) {
    return [];
  }

  async getClassPerformance(examId, classId, sectionId) {
    return {};
  }

  async getSubjectPerformance(examId, subjectId) {
    return {};
  }

  async findToppers(examId, classId, limit) {
    return [];
  }

  async publishResults(examId, publishedBy) {
    await pool.query('UPDATE exams SET results_published = true, published_by = $2, published_at = NOW() WHERE id = $1', [examId, publishedBy]);
    return {};
  }
}

export const examRepository = new ExamRepository();
