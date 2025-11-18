import { transportRepository } from '../repositories/transport.repository.js';

class TransportService {
  async getAllRoutes(schoolId) {
    return await transportRepository.findAllRoutes(schoolId);
  }

  async createRoute(routeData) {
    return await transportRepository.createRoute(routeData);
  }

  async assignStudentToRoute(assignmentData) {
    return await transportRepository.assignStudent(assignmentData);
  }

  async getRouteStudents(routeId) {
    return await transportRepository.findStudentsByRouteId(routeId);
  }

  async trackVehicle(vehicleId) {
    return await transportRepository.getVehicleLocation(vehicleId);
  }
}

export const transportService = new TransportService();
