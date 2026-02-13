import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    let messageData = {
      sender: req.user._id,
      chat: chatId,
      readBy: [req.user._id]
    };

    // Handle file upload
    if (req.file) {
      // console.log('File received:', req.file.originalname);
      const result = await uploadToCloudinary(req.file.buffer, 'chat-app/messages');
      // console.log('Cloudinary upload result:', result);
      
      messageData.fileUrl = result.secure_url;
      messageData.fileName = req.file.originalname;
      messageData.fileSize = req.file.size;
      
      // Determine message type based on file mimetype
      if (req.file.mimetype.startsWith('image/')) {
        messageData.messageType = 'image';
      } else {
        messageData.messageType = 'file';
      }
      
      // Content can be optional for file messages
      messageData.content = content || '';
    } else {
      if (!content) {
        return res.status(400).json({ message: 'Message content is required' });
      }
      messageData.content = content;
      messageData.messageType = 'text';
    }

    let message = await Message.create(messageData);

    message = await message.populate('sender', 'name avatar');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name email avatar'
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name email avatar')
      .populate('chat');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:chatId
// @access  Private
const markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      {
        chat: req.params.chatId,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id }
      },
      {
        $addToSet: { readBy: req.user._id }
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { sendMessage, getMessages, markAsRead };
