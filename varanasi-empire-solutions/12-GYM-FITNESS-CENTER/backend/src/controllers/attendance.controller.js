import { asyncHandler } from '../utils/asyncHandler.js';
import attendanceService from '../services/attendance.service.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Attendance Controller
 */

export const checkIn = asyncHandler(async (req, res) => {
  const { member_id, notes } = req.body;
  if (!member_id) throw new ValidationError(['member_id is required']);

  const attendance = await attendanceService.checkIn(parseInt(member_id), notes);
  res.status(201).json({ success: true, message: 'Member checked in successfully', data: attendance });
});

export const checkOut = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.checkOut(parseInt(req.params.id));
  res.json({ success: true, message: 'Member checked out successfully', data: attendance });
});

export const checkOutByMember = asyncHandler(async (req, res) => {
  const { member_id } = req.body;
  if (!member_id) throw new ValidationError(['member_id is required']);

  const attendance = await attendanceService.checkOutByMember(parseInt(member_id));
  res.json({ success: true, message: 'Member checked out successfully', data: attendance });
});

export const getAllAttendance = asyncHandler(async (req, res) => {
  const { member_id, gym_id, start_date, end_date, page = 1, limit = 100 } = req.query;
  const filters = {
    member_id: member_id ? parseInt(member_id) : undefined,
    gym_id: gym_id ? parseInt(gym_id) : undefined,
    start_date,
    end_date,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };

  const result = await attendanceService.getAllAttendance(filters);
  res.json({
    success: true,
    data: result.attendance,
    pagination: { total: result.total, page: result.page, limit: result.limit, pages: Math.ceil(result.total / result.limit) }
  });
});

export const getAttendanceById = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.getAttendanceById(parseInt(req.params.id));
  res.json({ success: true, data: attendance });
});

export const getMemberAttendanceHistory = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  const history = await attendanceService.getMemberAttendanceHistory(parseInt(req.params.memberId), parseInt(limit));
  res.json({ success: true, data: history });
});

export const getTodayAttendance = asyncHandler(async (req, res) => {
  const { gym_id } = req.query;
  if (!gym_id) throw new ValidationError(['gym_id is required']);

  const attendance = await attendanceService.getTodayAttendance(parseInt(gym_id));
  res.json({ success: true, data: attendance });
});

export const getCurrentlyCheckedIn = asyncHandler(async (req, res) => {
  const { gym_id } = req.query;
  if (!gym_id) throw new ValidationError(['gym_id is required']);

  const members = await attendanceService.getCurrentlyCheckedIn(parseInt(gym_id));
  res.json({ success: true, data: members });
});

export const getAttendanceFrequency = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const frequency = await attendanceService.getAttendanceFrequency(parseInt(req.params.memberId), parseInt(days));
  res.json({ success: true, data: frequency });
});

export const getAttendanceStatistics = asyncHandler(async (req, res) => {
  const { gym_id, start_date, end_date } = req.query;
  const filters = {
    gym_id: gym_id ? parseInt(gym_id) : undefined,
    start_date,
    end_date
  };

  const stats = await attendanceService.getAttendanceStatistics(filters);
  res.json({ success: true, data: stats });
});

export const getPeakHours = asyncHandler(async (req, res) => {
  const { gym_id, days = 30 } = req.query;
  if (!gym_id) throw new ValidationError(['gym_id is required']);

  const peakHours = await attendanceService.getPeakHours(parseInt(gym_id), parseInt(days));
  res.json({ success: true, data: peakHours });
});

export const getDailyTrend = asyncHandler(async (req, res) => {
  const { gym_id, days = 30 } = req.query;
  if (!gym_id) throw new ValidationError(['gym_id is required']);

  const trend = await attendanceService.getDailyTrend(parseInt(gym_id), parseInt(days));
  res.json({ success: true, data: trend });
});

export default {
  checkIn,
  checkOut,
  checkOutByMember,
  getAllAttendance,
  getAttendanceById,
  getMemberAttendanceHistory,
  getTodayAttendance,
  getCurrentlyCheckedIn,
  getAttendanceFrequency,
  getAttendanceStatistics,
  getPeakHours,
  getDailyTrend
};
