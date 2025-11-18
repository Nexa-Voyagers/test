import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'Saree & Textile Store API'
  });
});

export default router;
