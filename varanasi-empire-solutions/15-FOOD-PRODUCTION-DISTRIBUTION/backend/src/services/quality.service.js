import { qualityRepository } from '../repositories/quality.repository.js';
import { productionRepository } from '../repositories/production.repository.js';
import { ValidationError } from '../utils/errors.js';

export const qualityService = {
  async createQualityCheck(data) {
    // Validate batch exists
    await productionRepository.findById(data.batch_id);

    // Calculate pass/fail status based on score if not provided
    if (!data.pass_fail_status && data.score !== undefined) {
      const threshold = parseInt(process.env.QC_PASS_THRESHOLD) || 80;
      data.pass_fail_status = data.score >= threshold ? 'pass' : 'fail';
    }

    const check = await qualityRepository.createCheck(data);

    // If QC failed, update batch status
    if (check.pass_fail_status === 'fail') {
      await productionRepository.updateStatus(
        data.batch_id,
        'quality_failed',
        `Quality check failed. Score: ${check.score}`
      );
    }

    return check;
  },

  async getAllQualityChecks(filters) {
    return qualityRepository.findAll(filters);
  },

  async getQualityCheck(id) {
    return qualityRepository.findById(id);
  },

  async getChecksByBatch(batchId) {
    await productionRepository.findById(batchId);
    return qualityRepository.findByBatch(batchId);
  },

  async updateQualityCheck(id, data) {
    // Recalculate pass/fail status if score is updated
    if (data.score !== undefined && !data.pass_fail_status) {
      const threshold = parseInt(process.env.QC_PASS_THRESHOLD) || 80;
      data.pass_fail_status = data.score >= threshold ? 'pass' : 'fail';
    }

    return qualityRepository.update(id, data);
  },

  async approveQualityCheck(id, approvedBy) {
    const check = await qualityRepository.findById(id);

    if (check.pass_fail_status !== 'pass') {
      throw new ValidationError('Only passed quality checks can be approved');
    }

    return qualityRepository.update(id, {
      approved_by: approvedBy,
      approval_date: new Date(),
    });
  },

  async getQualityStats(filters) {
    return qualityRepository.getQualityStats(filters);
  },

  async runBatchTests(batchId, tests) {
    const batch = await productionRepository.findById(batchId);
    const results = [];

    for (const test of tests) {
      const checkData = {
        batch_id: batchId,
        check_type: test.type,
        check_date: new Date(),
        checked_by: test.checked_by,
        parameters_tested: test.parameters,
        test_results: test.results,
        score: test.score,
        notes: test.notes,
      };

      const check = await this.createQualityCheck(checkData);
      results.push(check);
    }

    return results;
  },
};
