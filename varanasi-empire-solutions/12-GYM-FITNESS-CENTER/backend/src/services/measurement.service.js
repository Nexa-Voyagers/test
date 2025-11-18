import measurementRepository from '../repositories/measurement.repository.js';
import memberRepository from '../repositories/member.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Body Measurement Service
 * Business logic for body measurements and progress tracking with BMI calculation
 */
class MeasurementService {
  /**
   * Create a new measurement record
   * @param {Object} measurementData - Measurement data
   * @returns {Promise<Object>} Created measurement with calculated BMI
   */
  async createMeasurement(measurementData) {
    const { member_id, weight_kg, height_cm } = measurementData;

    // Validate required fields
    if (!member_id || !weight_kg || !height_cm) {
      throw new ValidationError(['member_id, weight_kg, and height_cm are required']);
    }

    // Verify member exists
    await memberRepository.findById(member_id);

    // Validate measurements
    if (weight_kg <= 0 || weight_kg > 500) {
      throw new ValidationError(['Weight must be between 0 and 500 kg']);
    }

    if (height_cm <= 0 || height_cm > 300) {
      throw new ValidationError(['Height must be between 0 and 300 cm']);
    }

    // BMI is auto-calculated in repository
    const measurement = await measurementRepository.create(measurementData);

    // Add BMI category
    measurement.bmi_category = measurementRepository.getBMICategory(measurement.bmi);

    return measurement;
  }

  /**
   * Get all measurements
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Measurements and metadata
   */
  async getAllMeasurements(filters = {}) {
    const measurements = await measurementRepository.findAll(filters);
    const total = await measurementRepository.count(filters);

    // Add BMI category to each measurement
    measurements.forEach(m => {
      m.bmi_category = measurementRepository.getBMICategory(m.bmi);
    });

    return {
      measurements,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50
    };
  }

  /**
   * Get measurement by ID
   * @param {number} id - Measurement ID
   * @returns {Promise<Object>} Measurement data
   */
  async getMeasurementById(id) {
    const measurement = await measurementRepository.findById(id);
    measurement.bmi_category = measurementRepository.getBMICategory(measurement.bmi);
    return measurement;
  }

  /**
   * Get measurements by member
   * @param {number} memberId - Member ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Member measurements
   */
  async getMeasurementsByMember(memberId, limit = 50) {
    const measurements = await measurementRepository.findByMember(memberId, limit);

    // Add BMI category to each
    measurements.forEach(m => {
      m.bmi_category = measurementRepository.getBMICategory(m.bmi);
    });

    return measurements;
  }

  /**
   * Get latest measurement for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Latest measurement
   */
  async getLatestMeasurement(memberId) {
    const measurement = await measurementRepository.findLatestByMember(memberId);

    if (measurement) {
      measurement.bmi_category = measurementRepository.getBMICategory(measurement.bmi);
    }

    return measurement;
  }

  /**
   * Update measurement
   * @param {number} id - Measurement ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated measurement
   */
  async updateMeasurement(id, updateData) {
    // Validate measurements if provided
    if (updateData.weight_kg !== undefined) {
      if (updateData.weight_kg <= 0 || updateData.weight_kg > 500) {
        throw new ValidationError(['Weight must be between 0 and 500 kg']);
      }
    }

    if (updateData.height_cm !== undefined) {
      if (updateData.height_cm <= 0 || updateData.height_cm > 300) {
        throw new ValidationError(['Height must be between 0 and 300 cm']);
      }
    }

    // BMI is auto-recalculated in repository if weight or height changes
    const measurement = await measurementRepository.update(id, updateData);
    measurement.bmi_category = measurementRepository.getBMICategory(measurement.bmi);

    return measurement;
  }

  /**
   * Delete measurement
   * @param {number} id - Measurement ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteMeasurement(id) {
    return await measurementRepository.delete(id);
  }

  /**
   * Get progress report for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object>} Progress report with baseline and latest measurements
   */
  async getProgressReport(memberId) {
    const report = await measurementRepository.getProgressReport(memberId);

    if (report.baseline) {
      report.baseline.bmi_category = measurementRepository.getBMICategory(report.baseline.bmi);
    }

    if (report.latest) {
      report.latest.bmi_category = measurementRepository.getBMICategory(report.latest.bmi);
    }

    // Add interpretations
    if (report.progress) {
      report.progress.interpretation = {
        weight: report.progress.weight_change > 0 ? 'gained' : report.progress.weight_change < 0 ? 'lost' : 'maintained',
        bmi: report.progress.bmi_change > 0 ? 'increased' : report.progress.bmi_change < 0 ? 'decreased' : 'maintained',
        body_fat: report.progress.body_fat_change
          ? (report.progress.body_fat_change > 0 ? 'increased' : report.progress.body_fat_change < 0 ? 'decreased' : 'maintained')
          : null
      };
    }

    return report;
  }

  /**
   * Get measurement trend for member
   * @param {number} memberId - Member ID
   * @param {string} metric - Metric to track
   * @param {number} limit - Number of records
   * @returns {Promise<Array>} Trend data
   */
  async getMeasurementTrend(memberId, metric = 'weight_kg', limit = 10) {
    return await measurementRepository.getTrend(memberId, metric, limit);
  }

  /**
   * Get BMI distribution
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Array>} BMI distribution
   */
  async getBMIDistribution(gymId = null) {
    return await measurementRepository.getBMIDistribution(gymId);
  }

  /**
   * Get measurement statistics
   * @param {number} memberId - Member ID
   * @returns {Promise<Object>} Measurement statistics
   */
  async getMeasurementStatistics(memberId) {
    return await measurementRepository.getStatistics(memberId);
  }

  /**
   * Calculate BMI
   * @param {number} weightKg - Weight in kg
   * @param {number} heightCm - Height in cm
   * @returns {Object} BMI and category
   */
  calculateBMI(weightKg, heightCm) {
    const bmi = measurementRepository.calculateBMI(weightKg, heightCm);
    const category = measurementRepository.getBMICategory(bmi);

    return {
      bmi,
      category,
      interpretation: this.getBMIInterpretation(bmi)
    };
  }

  /**
   * Get BMI interpretation
   * @param {number} bmi - BMI value
   * @returns {string} Interpretation
   */
  getBMIInterpretation(bmi) {
    if (bmi < 18.5) return 'You are underweight. Consider consulting a nutritionist.';
    if (bmi >= 18.5 && bmi < 25) return 'You have a healthy weight. Keep it up!';
    if (bmi >= 25 && bmi < 30) return 'You are overweight. Consider a balanced diet and regular exercise.';
    return 'You are obese. We recommend consulting a healthcare provider.';
  }
}

export default new MeasurementService();
