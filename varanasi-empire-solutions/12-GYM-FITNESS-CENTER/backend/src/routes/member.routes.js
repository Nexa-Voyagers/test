import express from 'express';
import memberController from '../controllers/member.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', memberController.createMember);
router.get('/', memberController.getAllMembers);
router.get('/search', memberController.searchMembers);
router.get('/expiring-memberships', memberController.getMembersWithExpiringMemberships);
router.get('/:id', memberController.getMemberById);
router.get('/:id/with-membership', memberController.getMemberWithMembership);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

export default router;
