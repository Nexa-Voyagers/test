import companyService from '../services/company.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for event company endpoints
 */
class CompanyController {
  /**
   * @route   POST /api/companies
   * @desc    Create a new event planning company
   * @access  Private
   */
  createCompany = asyncHandler(async (req, res) => {
    const company = await companyService.createCompany(req.body);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  });

  /**
   * @route   GET /api/companies
   * @desc    Get all companies with optional filters
   * @access  Private
   */
  getCompanies = asyncHandler(async (req, res) => {
    const filters = {
      city: req.query.city,
      is_active: req.query.is_active,
      specialization: req.query.specialization,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    };

    const companies = await companyService.getCompanies(filters);

    res.json({
      success: true,
      count: companies.length,
      data: companies,
    });
  });

  /**
   * @route   GET /api/companies/:id
   * @desc    Get company by ID
   * @access  Private
   */
  getCompanyById = asyncHandler(async (req, res) => {
    const company = await companyService.getCompanyById(req.params.id);

    res.json({
      success: true,
      data: company,
    });
  });

  /**
   * @route   GET /api/companies/:id/stats
   * @desc    Get company with statistics
   * @access  Private
   */
  getCompanyStats = asyncHandler(async (req, res) => {
    const companyWithStats = await companyService.getCompanyWithStats(req.params.id);

    res.json({
      success: true,
      data: companyWithStats,
    });
  });

  /**
   * @route   PUT /api/companies/:id
   * @desc    Update company
   * @access  Private
   */
  updateCompany = asyncHandler(async (req, res) => {
    const company = await companyService.updateCompany(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company,
    });
  });

  /**
   * @route   DELETE /api/companies/:id
   * @desc    Delete company (soft delete)
   * @access  Private
   */
  deleteCompany = asyncHandler(async (req, res) => {
    await companyService.deleteCompany(req.params.id);

    res.json({
      success: true,
      message: 'Company deleted successfully',
    });
  });

  /**
   * @route   GET /api/companies/:id/statistics
   * @desc    Get company statistics
   * @access  Private
   */
  getCompanyStatistics = asyncHandler(async (req, res) => {
    const statistics = await companyService.getCompanyStatistics(req.params.id);

    res.json({
      success: true,
      data: statistics,
    });
  });
}

export default new CompanyController();
