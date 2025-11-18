import { pool } from '../config/database.js';

class TeacherRepository {
  async findAll(schoolId, filters = {}) {
    const result = await pool.query('SELECT * FROM teachers WHERE school_id = $1', [schoolId]);
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM teachers WHERE id = $1', [id]);
    return result.rows[0];
  }

  async create(data) {
    return {};
  }

  async update(id, updateData) {
    return {};
  }

  async delete(id) {
    await pool.query('DELETE FROM teachers WHERE id = $1', [id]);
  }
}

export const teacherRepository = new TeacherRepository();
