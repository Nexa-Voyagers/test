import { attendanceRepository } from '../repositories/attendance.repository.js';
import { AppError } from '../utils/errors.js';

class AttendanceService {
  async markAttendance(attendanceData) {
    // Check if attendance already marked for this date
    const existing = await attendanceRepository.findByClassAndDate(
      attendanceData.classId,
      attendanceData.sectionId,
      attendanceData.date
    );

    if (existing && existing.length > 0) {
      throw new AppError('Attendance already marked for this class and date', 409);
    }

    return await attendanceRepository.bulkCreate(attendanceData);
  }

  async getAttendance(filters) {
    return await attendanceRepository.findByFilters(filters);
  }

  async getStudentAttendanceSummary(studentId, filters) {
    const attendance = await attendanceRepository.findByStudentId(studentId, filters);

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'PRESENT').length;
    const absent = attendance.filter(a => a.status === 'ABSENT').length;
    const late = attendance.filter(a => a.status === 'LATE').length;
    const percentage = total > 0 ? ((present + late) / total * 100).toFixed(2) : 0;

    return {
      attendance,
      summary: {
        total,
        present,
        absent,
        late,
        percentage: parseFloat(percentage),
      },
    };
  }

  async getClassAttendanceSummary(classId, filters) {
    return await attendanceRepository.getClassSummary(classId, filters);
  }

  async updateAttendance(id, updateData) {
    return await attendanceRepository.update(id, updateData);
  }

  async getLowAttendanceStudents(schoolId, threshold, academicYear) {
    return await attendanceRepository.findLowAttendanceStudents(schoolId, threshold, academicYear);
  }

  async getStaffAttendance(schoolId, filters) {
    return await attendanceRepository.findStaffAttendance(schoolId, filters);
  }

  async markStaffAttendance(attendanceData) {
    return await attendanceRepository.bulkCreateStaffAttendance(attendanceData);
  }

  async sendAttendanceNotifications(classId, sectionId, date) {
    const absentStudents = await attendanceRepository.findAbsentStudents(classId, sectionId, date);

    // Send notifications to parents (implement notification service)
    // for (const student of absentStudents) {
    //   await notificationService.sendAttendanceAlert(student.parent_id, student, date);
    // }

    return { count: absentStudents.length };
  }
}

export const attendanceService = new AttendanceService();
