import Message from '../models/Message.js';

// @desc    Post a comment on an image message
// @route   POST /api/comments
// @access  Private
const postComment = async (req, res) => {
  try {
    const { messageId, content } = req.body;

    if (!messageId || !content) {
      return res.status(400).json({ message: 'Message ID and content are required' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only image messages can have comments
    if (message.messageType !== 'image') {
      return res.status(400).json({ message: 'Comments allowed only on image messages' });
    }

    // Check if comments are allowed
    if (!message.allowComments) {
      return res.status(403).json({ message: 'Comments are disabled for this image' });
    }

    const newComment = {
      user: req.user._id,
      content
    };

    message.comments.push(newComment);
    await message.save();

    // Re-fetch and populate comment user
    const updatedMessage = await Message.findById(messageId)
      .populate('comments.user', 'name email avatar');

    const addedComment = updatedMessage.comments[updatedMessage.comments.length - 1];

    res.status(201).json(addedComment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Get all comments of an image message
// @route   GET /api/comments/:messageId
// @access  Private
const getComments = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId)
      .populate('comments.user', 'name email avatar');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.messageType !== 'image') {
      return res.status(400).json({ message: 'Not an image message' });
    }

    res.json(message.comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Delete a comment
// @route   DELETE /api/comments/:messageId/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const { messageId, commentId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const comment = message.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only comment owner can delete
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    comment.deleteOne();
    await message.save();

    res.json({ message: 'Comment deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { postComment, getComments, deleteComment };