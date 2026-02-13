import express from 'express';

import {
  searchUsers,
  getAllUsers,
  getUserById
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, searchUsers);
router.get('/all', protect, getAllUsers);
router.get('/:id', protect, getUserById);

export default router;
