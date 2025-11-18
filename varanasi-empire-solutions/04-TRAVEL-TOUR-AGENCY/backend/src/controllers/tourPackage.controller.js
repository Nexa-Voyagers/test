import { tourPackageRepository } from '../repositories/tourPackage.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../utils/errors.js';
import { logger } from '../config/logger.js';

export const createPackage = asyncHandler(async (req, res) => {
  const packageData = {
    ...req.body,
    agency_id: req.user.agency_id,
    created_by: req.user.id,
    package_code: `PKG-${Date.now()}`,
  };

  const tourPackage = await tourPackageRepository.create(packageData);

  logger.info(`Tour package created: ${tourPackage.package_code}`);

  res.status(201).json({
    success: true,
    message: 'Tour package created successfully',
    data: tourPackage,
  });
});

export const getPackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tourPackage = await tourPackageRepository.findById(id);

  if (!tourPackage) {
    throw new NotFoundError('Tour package');
  }

  res.json({
    success: true,
    data: tourPackage,
  });
});

export const getAgencyPackages = asyncHandler(async (req, res) => {
  const agencyId = req.user.agency_id;
  const filters = req.query;

  const packages = await tourPackageRepository.findByAgency(agencyId, filters);

  res.json({
    success: true,
    data: packages,
    count: packages.length,
  });
});

export const searchPackages = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const agencyId = req.user.agency_id;

  const packages = await tourPackageRepository.search(q, agencyId);

  res.json({
    success: true,
    data: packages,
  });
});

export const updatePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tourPackage = await tourPackageRepository.update(id, req.body);

  logger.info(`Tour package updated: ${id}`);

  res.json({
    success: true,
    message: 'Package updated successfully',
    data: tourPackage,
  });
});

export const getPopularPackages = asyncHandler(async (req, res) => {
  const agencyId = req.user.agency_id;
  const { limit = 10 } = req.query;

  const packages = await tourPackageRepository.getPopularPackages(agencyId, limit);

  res.json({
    success: true,
    data: packages,
  });
});

export default {
  createPackage,
  getPackage,
  getAgencyPackages,
  searchPackages,
  updatePackage,
  getPopularPackages,
};
