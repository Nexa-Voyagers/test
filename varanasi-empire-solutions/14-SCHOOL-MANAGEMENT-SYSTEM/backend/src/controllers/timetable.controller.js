import { asyncHandler } from '../utils/asyncHandler.js';
import { timetableService } from '../services/timetable.service.js';

export const getTimetable = asyncHandler(async (req, res) => {
  const { classId, sectionId, date } = req.query;

  const timetable = await timetableService.getTimetable({ classId, sectionId, date });

  res.json({
    success: true,
    data: timetable,
  });
});

export const createTimetable = asyncHandler(async (req, res) => {
  const timetableData = req.body;
  const createdBy = req.user.id;

  const timetable = await timetableService.createTimetable({ ...timetableData, createdBy });

  res.status(201).json({
    success: true,
    message: 'Timetable created successfully',
    data: timetable,
  });
});

export const updateTimetable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const timetable = await timetableService.updateTimetable(id, updateData);

  res.json({
    success: true,
    message: 'Timetable updated successfully',
    data: timetable,
  });
});

export const deleteTimetable = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await timetableService.deleteTimetable(id);

  res.json({
    success: true,
    message: 'Timetable deleted successfully',
  });
});
