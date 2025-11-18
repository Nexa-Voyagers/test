import { pool } from '../config/database.js';

class AttendanceRepository {
  async findByClassAndDate(classId, sectionId, date) {
    const result = await pool.query(
      'SELECT * FROM attendance WHERE class_id = $1 AND section_id = $2 AND date = $3',
      [classId, sectionId, date]
    );
    return result.rows;
  }

  async bulkCreate(attendanceData) {
    const { classId, sectionId, date, attendanceRecords, markedBy } = attendanceData;
    const values = attendanceRecords.map(record => 
      `('${record.studentId}', '${classId}', '${sectionId}', '${date}', '${record.status}', '${markedBy}')`
    ).join(',');

    const query = `INSERT INTO attendance (student_id, class_id, section_id, date, status, marked_by) 
                   VALUES ${values} RETURNING *`;
    const result = await pool.query(query);
    return result.rows;
  }

  async findByFilters(filters) {
    let query = 'SELECT * FROM attendance WHERE 1=1';
    const params = [];

    if (filters.classId) {
      params.push(filters.classId);
      query += ` AND class_id = $${params.length}`;
    }

    if (filters.date) {
      params.push(filters.date);
      query += ` AND date = $${params.length}`;
    }

    if (filters.startDate && filters.endDate) {
      params.push(filters.startDate, filters.endDate);
      query += ` AND date BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    query += ' ORDER BY date DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findByStudentId(studentId, filters) {
    let query = 'SELECT * FROM attendance WHERE student_id = $1';
    const params = [studentId];

    if (filters.startDate && filters.endDate) {
      params.push(filters.startDate, filters.endDate);
      query += ` AND date BETWEEN $2 AND $3`;
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  async getClassSummary(classId, filters) {
    const result = await pool.query(
      `SELECT status, COUNT(*) as count FROM attendance 
       WHERE class_id = $1 GROUP BY status`,
      [classId]
    );
    return result.rows;
  }

  async update(id, updateData) {
    const result = await pool.query(
      'UPDATE attendance SET status = $2, remarks = $3, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, updateData.status, updateData.remarks]
    );
    return result.rows[0];
  }

  async findLowAttendanceStudents(schoolId, threshold, academicYear) {
    const result = await pool.query(
      `SELECT s.id, s.first_name, s.last_name, s.admission_number,
       COUNT(a.id) as total_days,
       SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) as present_days,
       ROUND((SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END)::NUMERIC / COUNT(a.id) * 100), 2) as percentage
       FROM students s
       JOIN attendance a ON s.id = a.student_id
       WHERE s.school_id = $1 AND s.academic_year = $2
       GROUP BY s.id, s.first_name, s.last_name, s.admission_number
       HAVING ROUND((SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END)::NUMERIC / COUNT(a.id) * 100), 2) < $3`,
      [schoolId, academicYear, threshold]
    );
    return result.rows;
  }

  async findAbsentStudents(classId, sectionId, date) {
    const result = await pool.query(
      `SELECT s.*, a.status FROM students s
       JOIN attendance a ON s.id = a.student_id
       WHERE a.class_id = $1 AND a.section_id = $2 AND a.date = $3 AND a.status = 'ABSENT'`,
      [classId, sectionId, date]
    );
    return result.rows;
  }

  async findStaffAttendance(schoolId, filters) {
    let query = 'SELECT * FROM staff_attendance WHERE school_id = $1';
    const params = [schoolId];

    if (filters.date) {
      params.push(filters.date);
      query += ` AND date = $${params.length}`;
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  async bulkCreateStaffAttendance(attendanceData) {
    const { date, attendanceRecords, markedBy } = attendanceData;
    const values = attendanceRecords.map(record => 
      `('${record.teacherId}', '${date}', '${record.status}', '${markedBy}')`
    ).join(',');

    const query = `INSERT INTO staff_attendance (teacher_id, date, status, marked_by) 
                   VALUES ${values} RETURNING *`;
    const result = await pool.query(query);
    return result.rows;
  }
}

export const attendanceRepository = new AttendanceRepository();
