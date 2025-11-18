import express from 'express';
import { guestController } from '../controllers/guest.controller.js';

const router = express.Router();

router.post('/', guestController.createGuest);
router.get('/search', guestController.searchGuests);
router.get('/vip-list', guestController.getVIPGuests);
router.get('/repeat-list', guestController.getRepeatGuests);
router.get('/:id', guestController.getGuest);
router.get('/:id/preferences', guestController.getGuestPreferences);
router.put('/:id', guestController.updateGuest);
router.post('/:id/award-points', guestController.awardLoyaltyPoints);
router.post('/:id/redeem-points', guestController.redeemLoyaltyPoints);

export default router;
