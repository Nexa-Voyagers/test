import { productionRepository } from '../repositories/production.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { unitRepository } from '../repositories/unit.repository.js';
import { ConflictError, ValidationError, NotFoundError } from '../utils/errors.js';

export const productionService = {
  async createBatch(data) {
    // Validate unit exists
    await unitRepository.findById(data.unit_id);

    // Validate product exists
    const product = await productRepository.findById(data.product_id);

    // Generate batch number if not provided
    if (!data.batch_number) {
      const prefix = process.env.BATCH_NUMBER_PREFIX || 'FP';
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      data.batch_number = `${prefix}${timestamp}${random}`;
    }

    // Check if batch number already exists
    const existing = await productionRepository.findByBatchNumber(data.batch_number);
    if (existing) {
      throw new ConflictError('Batch number already exists');
    }

    // Calculate expiry date based on production date and shelf life
    if (!data.expiry_date && product.shelf_life_days) {
      const productionDate = new Date(data.production_date);
      const expiryDate = new Date(productionDate);
      expiryDate.setDate(expiryDate.getDate() + product.shelf_life_days);
      data.expiry_date = expiryDate;
    }

    // Calculate total cost
    data.total_cost = (data.raw_material_cost || 0) + (data.labor_cost || 0) + (data.overhead_cost || 0);

    return productionRepository.createBatch(data);
  },

  async getAllBatches(filters) {
    return productionRepository.findAll(filters);
  },

  async getBatch(id) {
    return productionRepository.findById(id);
  },

  async updateBatch(id, data) {
    // Recalculate total cost if cost components are updated
    if (data.raw_material_cost !== undefined || data.labor_cost !== undefined || data.overhead_cost !== undefined) {
      const batch = await productionRepository.findById(id);
      data.total_cost =
        (data.raw_material_cost ?? batch.raw_material_cost) +
        (data.labor_cost ?? batch.labor_cost) +
        (data.overhead_cost ?? batch.overhead_cost);
    }

    return productionRepository.update(id, data);
  },

  async startProduction(id) {
    const batch = await productionRepository.findById(id);

    if (batch.status !== 'planned') {
      throw new ValidationError('Only planned batches can be started');
    }

    return productionRepository.updateStatus(id, 'in_progress', 'Production started');
  },

  async completeProduction(id, quantityProduced, notes = null) {
    const batch = await productionRepository.findById(id);

    if (batch.status !== 'in_progress') {
      throw new ValidationError('Only in-progress batches can be completed');
    }

    await productionRepository.update(id, { quantity_produced: quantityProduced });
    return productionRepository.updateStatus(id, 'completed', notes || 'Production completed');
  },

  async cancelBatch(id, reason) {
    const batch = await productionRepository.findById(id);

    if (batch.status === 'completed') {
      throw new ValidationError('Completed batches cannot be cancelled');
    }

    return productionRepository.updateStatus(id, 'cancelled', reason);
  },

  async getProductionStats(filters) {
    return productionRepository.getProductionStats(filters);
  },

  async getBatchesByProduct(productId, filters = {}) {
    return productionRepository.findAll({ ...filters, product_id: productId });
  },

  async getBatchesByUnit(unitId, filters = {}) {
    return productionRepository.findAll({ ...filters, unit_id: unitId });
  },
};
