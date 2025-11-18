import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
  res.json({ success: true, message: 'Login endpoint - implement with user repository' });
});

router.post('/register', async (req, res) => {
  res.json({ success: true, message: 'Register endpoint - implement with user repository' });
});

export default router;
