import express from 'express';
import vendorController from '../controllers/vendor.controller.js';
import vendorCategoryController from '../controllers/vendor-category.controller.js';
import eventVendorController from '../controllers/event-vendor.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Vendor category routes
router.post('/categories', vendorCategoryController.createCategory);
router.get('/categories', vendorCategoryController.getCategories);
router.get('/categories/popular', vendorCategoryController.getPopularCategories);
router.get('/categories/:id/vendors', vendorCategoryController.getCategoryWithVendors);
router.get('/categories/:id/statistics', vendorCategoryController.getCategoryStatistics);
router.get('/categories/:id', vendorCategoryController.getCategoryById);
router.put('/categories/:id', vendorCategoryController.updateCategory);
router.delete('/categories/:id', vendorCategoryController.deleteCategory);

// Event vendor booking routes
router.post('/bookings', eventVendorController.createBooking);
router.get('/bookings', eventVendorController.getBookings);
router.get('/bookings/pending-payments', eventVendorController.getPendingPayments);
router.post('/bookings/calculate-payment', eventVendorController.calculatePaymentBreakdown);
router.get('/bookings/event/:eventId', eventVendorController.getEventBookings);
router.get('/bookings/event/:eventId/summary', eventVendorController.getEventVendorSummary);
router.get('/bookings/vendor/:vendorId', eventVendorController.getVendorBookings);
router.get('/bookings/vendor/:vendorId/payment-summary', eventVendorController.getVendorPaymentSummary);
router.get('/bookings/:id', eventVendorController.getBookingById);
router.put('/bookings/:id/payment', eventVendorController.recordPayment);
router.put('/bookings/:id/status', eventVendorController.updateBookingStatus);
router.put('/bookings/:id', eventVendorController.updateBooking);
router.delete('/bookings/:id', eventVendorController.deleteBooking);

// Vendor routes
router.post('/', vendorController.createVendor);
router.get('/', vendorController.getVendors);
router.get('/search', vendorController.searchVendors);
router.get('/top-rated', vendorController.getTopRatedVendors);
router.get('/available', vendorController.getAvailableVendors);
router.get('/:id/performance', vendorController.getVendorPerformance);
router.get('/:id/bookings', vendorController.getVendorBookings);
router.get('/:id', vendorController.getVendorById);
router.put('/:id', vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);

export default router;
