import express from 'express';
import * as '${route}'Controller from '../controllers/'${route}'.controller.js';

const router = express.Router();

router.get('/', '${route}'Controller.getAll);
router.get('/:id', '${route}'Controller.getById);
router.post('/', '${route}'Controller.create);
router.put('/:id', '${route}'Controller.update);
router.delete('/:id', '${route}'Controller.deleteRecord);

export default router;
