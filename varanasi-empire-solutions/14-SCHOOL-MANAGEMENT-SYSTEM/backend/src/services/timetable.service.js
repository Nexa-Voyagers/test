import { timetableRepository } from '../repositories/timetable.repository.js';

class TimetableService {
  async getTimetable(filters) {
    return await timetableRepository.find(filters);
  }

  async createTimetable(timetableData) {
    return await timetableRepository.create(timetableData);
  }

  async updateTimetable(id, updateData) {
    return await timetableRepository.update(id, updateData);
  }

  async deleteTimetable(id) {
    return await timetableRepository.delete(id);
  }
}

export const timetableService = new TimetableService();
