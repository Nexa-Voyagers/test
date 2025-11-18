import weaverService from '../services/weaver.service.js';

/**
 * Weaver Controller
 * Handles HTTP requests for weaver management
 */
class WeaverController {
  /**
   * Create a new weaver
   * @route POST /api/v1/weavers
   */
  async createWeaver(req, res) {
    const weaver = await weaverService.createWeaver(req.body);
    res.status(201).json({
      success: true,
      message: 'Weaver created successfully',
      data: weaver
    });
  }

  /**
   * Get weaver by ID
   * @route GET /api/v1/weavers/:id
   */
  async getWeaverById(req, res) {
    const weaver = await weaverService.getWeaverById(req.params.id);
    res.json({
      success: true,
      data: weaver
    });
  }

  /**
   * Get all weavers with filters
   * @route GET /api/v1/weavers
   */
  async getAllWeavers(req, res) {
    const result = await weaverService.getAllWeavers(req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Update weaver
   * @route PUT /api/v1/weavers/:id
   */
  async updateWeaver(req, res) {
    const weaver = await weaverService.updateWeaver(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Weaver updated successfully',
      data: weaver
    });
  }

  /**
   * Update weaver quality rating
   * @route PATCH /api/v1/weavers/:id/rating
   */
  async updateQualityRating(req, res) {
    const { rating } = req.body;
    const weaver = await weaverService.updateQualityRating(req.params.id, rating);
    res.json({
      success: true,
      message: 'Quality rating updated successfully',
      data: weaver
    });
  }

  /**
   * Delete weaver
   * @route DELETE /api/v1/weavers/:id
   */
  async deleteWeaver(req, res) {
    const result = await weaverService.deleteWeaver(req.params.id);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Search weavers
   * @route GET /api/v1/weavers/search
   */
  async searchWeavers(req, res) {
    const { q } = req.query;
    const weavers = await weaverService.searchWeavers(q);
    res.json({
      success: true,
      data: weavers
    });
  }

  /**
   * Get weaver order history
   * @route GET /api/v1/weavers/:id/orders
   */
  async getOrderHistory(req, res) {
    const result = await weaverService.getWeaverOrderHistory(req.params.id, req.query);
    res.json({
      success: true,
      ...result
    });
  }

  /**
   * Get weaver performance statistics
   * @route GET /api/v1/weavers/:id/performance
   */
  async getPerformance(req, res) {
    const performance = await weaverService.getWeaverPerformance(req.params.id);
    res.json({
      success: true,
      data: performance
    });
  }

  /**
   * Get top rated weavers
   * @route GET /api/v1/weavers/top-rated
   */
  async getTopRated(req, res) {
    const { limit = 10 } = req.query;
    const weavers = await weaverService.getTopRatedWeavers(parseInt(limit));
    res.json({
      success: true,
      data: weavers
    });
  }
}

export default new WeaverController();
