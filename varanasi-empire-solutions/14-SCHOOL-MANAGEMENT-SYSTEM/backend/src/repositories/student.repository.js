import { pool } from '../config/database.js';

class StudentRepository {
  async findAll(schoolId, filters) {
    const { page, limit, classId, sectionId, academicYear, status } = filters;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM students WHERE school_id = $1';
    const params = [schoolId];

    if (classId) {
      params.push(classId);
      query += ` AND current_class_id = $${params.length}`;
    }

    if (sectionId) {
      params.push(sectionId);
      query += ` AND current_section_id = $${params.length}`;
    }

    if (academicYear) {
      params.push(academicYear);
      query += ` AND academic_year = $${params.length}`;
    }

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ` ORDER BY first_name, last_name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM students WHERE school_id = $1', [schoolId]);
    const total = parseInt(countResult.rows[0].count);

    return {
      students: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findByAdmissionNumber(admissionNumber) {
    const result = await pool.query('SELECT * FROM students WHERE admission_number = $1', [admissionNumber]);
    return result.rows[0];
  }

  async create(studentData) {
    const result = await pool.query(
      `INSERT INTO students (school_id, admission_number, first_name, last_name, date_of_birth, 
       gender, current_class_id, current_section_id, academic_year, status, parent_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [studentData.schoolId, studentData.admission_number, studentData.first_name, studentData.last_name,
       studentData.date_of_birth, studentData.gender, studentData.current_class_id, studentData.current_section_id,
       studentData.academic_year, studentData.status || 'ACTIVE', studentData.parent_id]
    );
    return result.rows[0];
  }

  async update(id, updateData) {
    const result = await pool.query(
      `UPDATE students SET first_name = COALESCE($2, first_name), last_name = COALESCE($3, last_name),
       current_class_id = COALESCE($4, current_class_id), current_section_id = COALESCE($5, current_section_id),
       status = COALESCE($6, status), updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, updateData.first_name, updateData.last_name, updateData.current_class_id, 
       updateData.current_section_id, updateData.status]
    );
    return result.rows[0];
  }

  async delete(id) {
    await pool.query('UPDATE students SET status = $2, updated_at = NOW() WHERE id = $1', [id, 'INACTIVE']);
  }

  async promoteStudents(studentIds, targetClassId, targetSectionId, academicYear) {
    const result = await pool.query(
      `UPDATE students SET current_class_id = $2, current_section_id = $3, academic_year = $4, updated_at = NOW()
       WHERE id = ANY($1::uuid[]) RETURNING id`,
      [studentIds, targetClassId, targetSectionId, academicYear]
    );
    return result.rowCount;
  }

  async getAttendanceByStudentId(studentId, startDate, endDate) {
    let query = 'SELECT * FROM attendance WHERE student_id = $1';
    const params = [studentId];

    if (startDate && endDate) {
      params.push(startDate, endDate);
      query += ` AND date BETWEEN $2 AND $3`;
    }

    query += ' ORDER BY date DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async getResultsByStudentId(studentId, academicYear) {
    let query = 'SELECT * FROM exam_marks WHERE student_id = $1';
    const params = [studentId];

    if (academicYear) {
      params.push(academicYear);
      query += ` AND academic_year = $2`;
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  async getFeesByStudentId(studentId, academicYear) {
    let query = 'SELECT * FROM fee_invoices WHERE student_id = $1';
    const params = [studentId];

    if (academicYear) {
      params.push(academicYear);
      query += ` AND academic_year = $2`;
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  async getReportCard(studentId, examId) {
    const result = await pool.query(
      `SELECT em.*, s.subject_name, s.subject_code, e.exam_name, e.exam_type
       FROM exam_marks em
       JOIN subjects s ON em.subject_id = s.id
       JOIN exams e ON em.exam_id = e.id
       WHERE em.student_id = $1 AND em.exam_id = $2`,
      [studentId, examId]
    );
    return result.rows;
  }
}

export const studentRepository = new StudentRepository();
