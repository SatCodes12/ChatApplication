import express from 'express';
import { postComment, getComments, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, postComment);
router.get('/:messageId', protect, getComments);
router.delete('/:messageId/:commentId', protect, deleteComment);

export default router;