import express from 'express';
import membershipController from '../controllers/membership.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/enroll', membershipController.enrollMembership);
router.post('/renew/:memberId', membershipController.renewMembership);
router.post('/update-expired', membershipController.updateExpiredMemberships);
router.get('/', membershipController.getAllMemberships);
router.get('/expiring', membershipController.getExpiringMemberships);
router.get('/revenue/stats', membershipController.getRevenueStats);
router.get('/member/:memberId', membershipController.getActiveMembership);
router.get('/member/:memberId/history', membershipController.getMembershipHistory);
router.get('/:id', membershipController.getMembershipById);
router.put('/:id', membershipController.updateMembership);
router.post('/:id/payment', membershipController.addPayment);
router.post('/:id/cancel', membershipController.cancelMembership);

export default router;
