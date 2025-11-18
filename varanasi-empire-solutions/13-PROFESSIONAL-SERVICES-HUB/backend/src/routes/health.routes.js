import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {
  res.json({ success: true, status: 'healthy' });
});
export default router;
