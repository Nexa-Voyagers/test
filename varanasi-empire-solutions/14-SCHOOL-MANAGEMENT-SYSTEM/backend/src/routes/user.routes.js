import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userController.getAllUsers || userController.getAllUser || userController.getTimetable || userController.getAdmissionReport);
router.get('/:id', userController.getUserById || userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
