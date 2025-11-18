import { inventoryRepository } from '../repositories/inventory.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { unitRepository } from '../repositories/unit.repository.js';
import { ValidationError } from '../utils/errors.js';

export const inventoryService = {
  async getAllInventory(filters) {
    return inventoryRepository.findAll(filters);
  },

  async getInventory(id) {
    return inventoryRepository.findById(id);
  },

  async updateInventory(id, data) {
    return inventoryRepository.upsert(data);
  },

  async addStock(id, quantity, notes = null) {
    if (quantity <= 0) {
      throw new ValidationError('Quantity must be positive');
    }

    const inventory = await inventoryRepository.updateStock(id, quantity, 'add');
    return inventory;
  },

  async removeStock(id, quantity, notes = null) {
    if (quantity <= 0) {
      throw new ValidationError('Quantity must be positive');
    }

    const inventory = await inventoryRepository.findById(id);
    if (inventory.available_stock < quantity) {
      throw new ValidationError('Insufficient stock available');
    }

    return inventoryRepository.updateStock(id, quantity, 'subtract');
  },

  async reserveStock(id, quantity) {
    if (quantity <= 0) {
      throw new ValidationError('Quantity must be positive');
    }

    return inventoryRepository.reserveStock(id, quantity);
  },

  async releaseStock(id, quantity) {
    if (quantity <= 0) {
      throw new ValidationError('Quantity must be positive');
    }

    return inventoryRepository.releaseStock(id, quantity);
  },

  async getLowStockItems(unitId = null) {
    return inventoryRepository.getLowStockItems(unitId);
  },

  async getInventoryValue(unitId = null) {
    return inventoryRepository.getInventoryValue(unitId);
  },

  async getInventoryByProduct(productId, filters = {}) {
    return inventoryRepository.findAll({ ...filters, product_id: productId });
  },

  async getInventoryByUnit(unitId, filters = {}) {
    return inventoryRepository.findAll({ ...filters, unit_id: unitId });
  },

  async transferStock(fromInventoryId, toInventoryId, quantity, notes = null) {
    if (quantity <= 0) {
      throw new ValidationError('Quantity must be positive');
    }

    const fromInventory = await inventoryRepository.findById(fromInventoryId);
    if (fromInventory.available_stock < quantity) {
      throw new ValidationError('Insufficient stock available for transfer');
    }

    // Remove from source
    await inventoryRepository.updateStock(fromInventoryId, quantity, 'subtract');

    // Add to destination
    await inventoryRepository.updateStock(toInventoryId, quantity, 'add');

    return {
      from: await inventoryRepository.findById(fromInventoryId),
      to: await inventoryRepository.findById(toInventoryId),
    };
  },

  async adjustStock(id, newQuantity, reason) {
    const inventory = await inventoryRepository.findById(id);
    const difference = newQuantity - inventory.current_stock;

    if (difference > 0) {
      return this.addStock(id, difference, reason);
    } else if (difference < 0) {
      return this.removeStock(id, Math.abs(difference), reason);
    }

    return inventory;
  },
};
