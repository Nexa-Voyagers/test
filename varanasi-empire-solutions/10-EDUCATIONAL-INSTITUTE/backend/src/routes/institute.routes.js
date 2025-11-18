import express from 'express';
import {
  createInstitute,
  getInstituteById,
  getAllInstitutes,
  updateInstitute,
  deleteInstitute,
  getInstituteStatistics
} from '../controllers/institute.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Institutes
 *   description: Institute management endpoints
 */

/**
 * @swagger
 * /api/v1/institutes:
 *   post:
 *     summary: Create a new institute
 *     tags: [Institutes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Institute created successfully
 */
router.post('/', createInstitute);

/**
 * @swagger
 * /api/v1/institutes:
 *   get:
 *     summary: Get all institutes
 *     tags: [Institutes]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of institutes
 */
router.get('/', getAllInstitutes);

/**
 * @swagger
 * /api/v1/institutes/{id}:
 *   get:
 *     summary: Get institute by ID
 *     tags: [Institutes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Institute details
 */
router.get('/:id', getInstituteById);

/**
 * @swagger
 * /api/v1/institutes/{id}:
 *   put:
 *     summary: Update institute
 *     tags: [Institutes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Institute updated successfully
 */
router.put('/:id', updateInstitute);

/**
 * @swagger
 * /api/v1/institutes/{id}:
 *   delete:
 *     summary: Delete institute
 *     tags: [Institutes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Institute deleted successfully
 */
router.delete('/:id', deleteInstitute);

/**
 * @swagger
 * /api/v1/institutes/{id}/statistics:
 *   get:
 *     summary: Get institute statistics
 *     tags: [Institutes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Institute statistics
 */
router.get('/:id/statistics', getInstituteStatistics);

export default router;
