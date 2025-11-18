import { pool } from '../database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Body Measurement Repository
 * Handles database operations for body measurements and progress tracking
 */
class MeasurementRepository {
  /**
   * Create a new measurement record
   * @param {Object} measurementData - Measurement data
   * @returns {Promise<Object>} Created measurement
   */
  async create(measurementData) {
    const {
      member_id, measurement_date, weight_kg, height_cm, body_fat_percentage,
      chest_cm, waist_cm, hips_cm, biceps_cm, thighs_cm, notes
    } = measurementData;

    // Calculate BMI
    const bmi = weight_kg / Math.pow(height_cm / 100, 2);

    const query = `
      INSERT INTO body_measurements (
        member_id, measurement_date, weight_kg, height_cm, bmi, body_fat_percentage,
        chest_cm, waist_cm, hips_cm, biceps_cm, thighs_cm, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      member_id, measurement_date || 'CURRENT_DATE', weight_kg, height_cm, bmi, body_fat_percentage,
      chest_cm, waist_cm, hips_cm, biceps_cm, thighs_cm, notes
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all measurements with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of measurements
   */
  async findAll(filters = {}) {
    const { member_id, start_date, end_date, limit = 50, offset = 0 } = filters;

    let query = `
      SELECT
        bm.*,
        m.first_name, m.last_name, m.email
      FROM body_measurements bm
      INNER JOIN members m ON m.member_id = bm.member_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (member_id) {
      query += ` AND bm.member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (start_date) {
      query += ` AND bm.measurement_date >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND bm.measurement_date <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    query += ` ORDER BY bm.measurement_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find measurement by ID
   * @param {number} id - Measurement ID
   * @returns {Promise<Object>} Measurement data
   */
  async findById(id) {
    const query = `
      SELECT
        bm.*,
        m.first_name, m.last_name, m.email, m.phone
      FROM body_measurements bm
      INNER JOIN members m ON m.member_id = bm.member_id
      WHERE bm.measurement_id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Measurement record');
    }

    return result.rows[0];
  }

  /**
   * Find measurements by member
   * @param {number} memberId - Member ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Member measurements
   */
  async findByMember(memberId, limit = 50) {
    const query = `
      SELECT *
      FROM body_measurements
      WHERE member_id = $1
      ORDER BY measurement_date DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [memberId, limit]);
    return result.rows;
  }

  /**
   * Get latest measurement for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Latest measurement or null
   */
  async findLatestByMember(memberId) {
    const query = `
      SELECT *
      FROM body_measurements
      WHERE member_id = $1
      ORDER BY measurement_date DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [memberId]);
    return result.rows[0] || null;
  }

  /**
   * Get baseline (first) measurement for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Baseline measurement or null
   */
  async findBaselineByMember(memberId) {
    const query = `
      SELECT *
      FROM body_measurements
      WHERE member_id = $1
      ORDER BY measurement_date ASC
      LIMIT 1
    `;

    const result = await pool.query(query, [memberId]);
    return result.rows[0] || null;
  }

  /**
   * Update measurement
   * @param {number} id - Measurement ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated measurement
   */
  async update(id, updateData) {
    await this.findById(id); // Check if exists

    const allowedFields = [
      'measurement_date', 'weight_kg', 'height_cm', 'body_fat_percentage',
      'chest_cm', 'waist_cm', 'hips_cm', 'biceps_cm', 'thighs_cm', 'notes'
    ];
    const updates = [];
    const values = [];
    let paramCount = 1;

    // Recalculate BMI if weight or height is updated
    if (updateData.weight_kg || updateData.height_cm) {
      const current = await this.findById(id);
      const weight = updateData.weight_kg || current.weight_kg;
      const height = updateData.height_cm || current.height_cm;
      updateData.bmi = weight / Math.pow(height / 100, 2);
      allowedFields.push('bmi');
    }

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE body_measurements
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE measurement_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete measurement
   * @param {number} id - Measurement ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    await this.findById(id); // Check if exists

    const query = 'DELETE FROM body_measurements WHERE measurement_id = $1';
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Get progress report for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object>} Progress report
   */
  async getProgressReport(memberId) {
    const baseline = await this.findBaselineByMember(memberId);
    const latest = await this.findLatestByMember(memberId);

    if (!baseline || !latest) {
      return {
        baseline: baseline || null,
        latest: latest || null,
        progress: null
      };
    }

    const progress = {
      weight_change: parseFloat((latest.weight_kg - baseline.weight_kg).toFixed(2)),
      bmi_change: parseFloat((latest.bmi - baseline.bmi).toFixed(2)),
      body_fat_change: baseline.body_fat_percentage && latest.body_fat_percentage
        ? parseFloat((latest.body_fat_percentage - baseline.body_fat_percentage).toFixed(2))
        : null,
      chest_change: baseline.chest_cm && latest.chest_cm
        ? parseFloat((latest.chest_cm - baseline.chest_cm).toFixed(2))
        : null,
      waist_change: baseline.waist_cm && latest.waist_cm
        ? parseFloat((latest.waist_cm - baseline.waist_cm).toFixed(2))
        : null,
      hips_change: baseline.hips_cm && latest.hips_cm
        ? parseFloat((latest.hips_cm - baseline.hips_cm).toFixed(2))
        : null,
      biceps_change: baseline.biceps_cm && latest.biceps_cm
        ? parseFloat((latest.biceps_cm - baseline.biceps_cm).toFixed(2))
        : null,
      thighs_change: baseline.thighs_cm && latest.thighs_cm
        ? parseFloat((latest.thighs_cm - baseline.thighs_cm).toFixed(2))
        : null,
      days_tracked: Math.floor((new Date(latest.measurement_date) - new Date(baseline.measurement_date)) / (1000 * 60 * 60 * 24))
    };

    return {
      baseline,
      latest,
      progress
    };
  }

  /**
   * Get measurement trend for member
   * @param {number} memberId - Member ID
   * @param {string} metric - Metric to track (weight_kg, bmi, body_fat_percentage, etc.)
   * @param {number} limit - Number of records
   * @returns {Promise<Array>} Trend data
   */
  async getTrend(memberId, metric = 'weight_kg', limit = 10) {
    const allowedMetrics = ['weight_kg', 'bmi', 'body_fat_percentage', 'chest_cm', 'waist_cm', 'hips_cm', 'biceps_cm', 'thighs_cm'];

    if (!allowedMetrics.includes(metric)) {
      throw new Error(`Invalid metric. Allowed: ${allowedMetrics.join(', ')}`);
    }

    const query = `
      SELECT measurement_date, ${metric}
      FROM body_measurements
      WHERE member_id = $1 AND ${metric} IS NOT NULL
      ORDER BY measurement_date ASC
      LIMIT $2
    `;

    const result = await pool.query(query, [memberId, limit]);
    return result.rows;
  }

  /**
   * Get BMI categories distribution
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Array>} BMI distribution
   */
  async getBMIDistribution(gymId = null) {
    let query = `
      SELECT
        CASE
          WHEN bm.bmi < 18.5 THEN 'Underweight'
          WHEN bm.bmi >= 18.5 AND bm.bmi < 25 THEN 'Normal'
          WHEN bm.bmi >= 25 AND bm.bmi < 30 THEN 'Overweight'
          ELSE 'Obese'
        END as category,
        COUNT(DISTINCT bm.member_id) as member_count
      FROM (
        SELECT DISTINCT ON (member_id) member_id, bmi
        FROM body_measurements
        ORDER BY member_id, measurement_date DESC
      ) bm
      INNER JOIN members m ON m.member_id = bm.member_id
      WHERE 1=1
    `;

    const values = [];
    if (gymId) {
      query += ' AND m.gym_id = $1';
      values.push(gymId);
    }

    query += ' GROUP BY category ORDER BY member_count DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get measurement statistics
   * @param {number} memberId - Member ID
   * @returns {Promise<Object>} Measurement statistics
   */
  async getStatistics(memberId) {
    const query = `
      SELECT
        COUNT(*) as total_measurements,
        MIN(measurement_date) as first_measurement,
        MAX(measurement_date) as last_measurement,
        MIN(weight_kg) as min_weight,
        MAX(weight_kg) as max_weight,
        ROUND(AVG(weight_kg)::numeric, 2) as avg_weight,
        MIN(bmi) as min_bmi,
        MAX(bmi) as max_bmi,
        ROUND(AVG(bmi)::numeric, 2) as avg_bmi
      FROM body_measurements
      WHERE member_id = $1
    `;

    const result = await pool.query(query, [memberId]);
    return result.rows[0];
  }

  /**
   * Count measurements
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    const { member_id } = filters;

    let query = 'SELECT COUNT(*) FROM body_measurements WHERE 1=1';
    const values = [];

    if (member_id) {
      query += ' AND member_id = $1';
      values.push(member_id);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  /**
   * Calculate BMI
   * @param {number} weightKg - Weight in kg
   * @param {number} heightCm - Height in cm
   * @returns {number} BMI value
   */
  calculateBMI(weightKg, heightCm) {
    return parseFloat((weightKg / Math.pow(heightCm / 100, 2)).toFixed(2));
  }

  /**
   * Get BMI category
   * @param {number} bmi - BMI value
   * @returns {string} BMI category
   */
  getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 25) return 'Normal';
    if (bmi >= 25 && bmi < 30) return 'Overweight';
    return 'Obese';
  }
}

export default new MeasurementRepository();
