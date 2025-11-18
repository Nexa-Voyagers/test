import { pool } from '../config/database.js';

class UserRepository {
  async findAll(schoolId, filters) {
    const { page, limit, role } = filters;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, email, full_name, role, school_id, is_active, created_at FROM users WHERE school_id = $1';
    const params = [schoolId];

    if (role) {
      params.push(role);
      query += ` AND role = $${params.length}`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM users WHERE school_id = $1',
      [schoolId]
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      users: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT id, email, full_name, role, school_id, phone, is_active, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async create(userData) {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role, school_id, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, full_name, role, school_id`,
      [userData.email, userData.password_hash, userData.full_name, userData.role, userData.schoolId, userData.phone]
    );
    return result.rows[0];
  }

  async update(id, updateData) {
    const { full_name, phone, role, is_active } = updateData;
    const result = await pool.query(
      `UPDATE users SET full_name = COALESCE($2, full_name), phone = COALESCE($3, phone), 
       role = COALESCE($4, role), is_active = COALESCE($5, is_active), updated_at = NOW()
       WHERE id = $1 RETURNING id, email, full_name, role, school_id`,
      [id, full_name, phone, role, is_active]
    );
    return result.rows[0];
  }

  async updatePassword(id, passwordHash) {
    await pool.query(
      'UPDATE users SET password_hash = $2, updated_at = NOW() WHERE id = $1',
      [id, passwordHash]
    );
  }

  async updateLastLogin(id) {
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [id]
    );
  }

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

export const userRepository = new UserRepository();
