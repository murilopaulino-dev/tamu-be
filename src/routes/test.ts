import express, { Response } from 'express';

const router = express.Router();

router.get('/', (req, res: Response) => {
  res.status(200).json({ message: 'Test route is working!' });
});

export default router;
