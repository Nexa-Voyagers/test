import { asyncHandler } from '../utils/asyncHandler.js';
import { transportService } from '../services/transport.service.js';

export const getAllRoutes = asyncHandler(async (req, res) => {
  const schoolId = req.user.schoolId;

  const routes = await transportService.getAllRoutes(schoolId);

  res.json({
    success: true,
    data: routes,
  });
});

export const createRoute = asyncHandler(async (req, res) => {
  const routeData = req.body;
  const schoolId = req.user.schoolId;
  const createdBy = req.user.id;

  const route = await transportService.createRoute({ ...routeData, schoolId, createdBy });

  res.status(201).json({
    success: true,
    message: 'Route created successfully',
    data: route,
  });
});

export const assignStudentToRoute = asyncHandler(async (req, res) => {
  const { studentId, routeId, stopId, pickupTime } = req.body;

  const assignment = await transportService.assignStudentToRoute({
    studentId,
    routeId,
    stopId,
    pickupTime,
  });

  res.status(201).json({
    success: true,
    message: 'Student assigned to route successfully',
    data: assignment,
  });
});

export const getRouteStudents = asyncHandler(async (req, res) => {
  const { routeId } = req.params;

  const students = await transportService.getRouteStudents(routeId);

  res.json({
    success: true,
    data: students,
  });
});

export const trackVehicle = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;

  const location = await transportService.trackVehicle(vehicleId);

  res.json({
    success: true,
    data: location,
  });
});
