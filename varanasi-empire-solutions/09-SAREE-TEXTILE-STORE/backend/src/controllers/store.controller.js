import storeService from '../services/store.service.js';

/**
 * Store Controller
 * Handles HTTP requests for textile store management
 */
class StoreController {
  /**
   * Create a new textile store
   * @route POST /api/v1/stores
   */
  async createStore(req, res) {
    const store = await storeService.createStore(req.body);
    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store
    });
  }

  /**
   * Get store by ID
   * @route GET /api/v1/stores/:id
   */
  async getStoreById(req, res) {
    const store = await storeService.getStoreById(req.params.id);
    res.json({
      success: true,
      data: store
    });
  }

  /**
   * Get all stores with filters
   * @route GET /api/v1/stores
   */
  async getAllStores(req, res) {
    const result = await storeService.getAllStores(req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Update store
   * @route PUT /api/v1/stores/:id
   */
  async updateStore(req, res) {
    const store = await storeService.updateStore(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Store updated successfully',
      data: store
    });
  }

  /**
   * Delete store
   * @route DELETE /api/v1/stores/:id
   */
  async deleteStore(req, res) {
    const result = await storeService.deleteStore(req.params.id);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Search stores
   * @route GET /api/v1/stores/search
   */
  async searchStores(req, res) {
    const { q } = req.query;
    const stores = await storeService.searchStores(q);
    res.json({
      success: true,
      data: stores
    });
  }

  /**
   * Get store statistics
   * @route GET /api/v1/stores/:id/statistics
   */
  async getStoreStatistics(req, res) {
    const stats = await storeService.getStoreStatistics(req.params.id);
    res.json({
      success: true,
      data: stats
    });
  }
}

export default new StoreController();
