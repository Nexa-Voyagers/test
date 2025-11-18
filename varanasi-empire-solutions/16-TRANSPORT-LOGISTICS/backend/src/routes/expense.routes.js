import express from 'express';
import * as expenseController from '../controllers/expense.controller.js';
const router = express.Router();
router.post('/', expenseController.create);
router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getOne);
router.put('/:id', expenseController.update);
router.delete('/:id', expenseController.remove);
export default router;
