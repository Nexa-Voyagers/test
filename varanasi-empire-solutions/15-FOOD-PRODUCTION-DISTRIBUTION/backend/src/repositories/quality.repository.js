import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const qualityRepository = {
  async createCheck(data) {
    const query = `
      INSERT INTO quality_checks (
        batch_id, check_type, check_date, checked_by, parameters_tested,
        test_results, pass_fail_status, score, defects_found, corrective_actions,
        approved_by, approval_date, notes, attachments, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      data.batch_id, data.check_type, data.check_date, data.checked_by,
      data.parameters_tested, data.test_results, data.pass_fail_status,
      data.score, data.defects_found, data.corrective_actions,
      data.approved_by, data.approval_date, data.notes,
      data.attachments || [], data.metadata || {}
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = `
      SELECT qc.*, pb.batch_number, p.name as product_name
      FROM quality_checks qc
      LEFT JOIN production_batches pb ON qc.batch_id = pb.id
      LEFT JOIN products p ON pb.product_id = p.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.batch_id) {
      query += ` AND qc.batch_id = $${paramCount}`;
      values.push(filters.batch_id);
      paramCount++;
    }

    if (filters.check_type) {
      query += ` AND qc.check_type = $${paramCount}`;
      values.push(filters.check_type);
      paramCount++;
    }

    if (filters.pass_fail_status) {
      query += ` AND qc.pass_fail_status = $${paramCount}`;
      values.push(filters.pass_fail_status);
      paramCount++;
    }

    if (filters.from_date) {
      query += ` AND qc.check_date >= $${paramCount}`;
      values.push(filters.from_date);
      paramCount++;
    }

    if (filters.to_date) {
      query += ` AND qc.check_date <= $${paramCount}`;
      values.push(filters.to_date);
      paramCount++;
    }

    query += ' ORDER BY qc.check_date DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  },

  async findById(id) {
    const query = `
      SELECT qc.*, pb.batch_number, p.name as product_name
      FROM quality_checks qc
      LEFT JOIN production_batches pb ON qc.batch_id = pb.id
      LEFT JOIN products p ON pb.product_id = p.id
      WHERE qc.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Quality check not found');
    }

    return result.rows[0];
  },

  async findByBatch(batchId) {
    const query = `
      SELECT * FROM quality_checks
      WHERE batch_id = $1
      ORDER BY check_date DESC
    `;
    const result = await pool.query(query, [batchId]);
    return result.rows;
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE quality_checks
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Quality check not found');
    }

    return result.rows[0];
  },

  async getQualityStats(filters = {}) {
    let query = `
      SELECT
        COUNT(*) as total_checks,
        SUM(CASE WHEN pass_fail_status = 'pass' THEN 1 ELSE 0 END) as passed,
        SUM(CASE WHEN pass_fail_status = 'fail' THEN 1 ELSE 0 END) as failed,
        AVG(score) as avg_score,
        check_type,
        COUNT(*) as checks_per_type
      FROM quality_checks
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.from_date) {
      query += ` AND check_date >= $${paramCount}`;
      values.push(filters.from_date);
      paramCount++;
    }

    if (filters.to_date) {
      query += ` AND check_date <= $${paramCount}`;
      values.push(filters.to_date);
      paramCount++;
    }

    query += ' GROUP BY check_type';

    const result = await pool.query(query, values);
    return result.rows;
  },
};
