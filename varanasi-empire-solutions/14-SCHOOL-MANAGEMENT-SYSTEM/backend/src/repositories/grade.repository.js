import { pool } from '../config/database.js';

class GradeRepository {
  async findAll(schoolId, filters = {}) {
    const result = await pool.query('SELECT * FROM grades WHERE school_id = $1', [schoolId]);
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM grades WHERE id = $1', [id]);
    return result.rows[0];
  }

  async create(data) {
    return {};
  }

  async update(id, updateData) {
    return {};
  }

  async delete(id) {
    await pool.query('DELETE FROM grades WHERE id = $1', [id]);
  }
}

export const gradeRepository = new GradeRepository();
