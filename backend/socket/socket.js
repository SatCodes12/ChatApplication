import { Server } from 'socket.io';

let io;
const onlineUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    },
    pingTimeout: 60000
  });

  io.on('connection', (socket) => {
    console.log('Connected to socket.io');

    // User setup
    socket.on('setup', (userData) => {
      socket.join(userData._id);
      onlineUsers.set(userData._id, socket.id);
      socket.broadcast.emit('user online', userData._id);
      console.log(`User ${userData.name} joined`);
    });

    // Join chat room
    socket.on('join chat', (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    // Typing indicator
    socket.on('typing', (room) => {
      socket.to(room).emit('typing', room);
    });

    socket.on('stop typing', (room) => {
      socket.to(room).emit('stop typing', room);
    });

    // New message
    socket.on('new message', (newMessageReceived) => {
      const chat = newMessageReceived.chat;

      if (!chat.users) return console.log('chat.users not defined');

      chat.users.forEach((user) => {
        if (user._id === newMessageReceived.sender._id) return;

        socket.to(user._id).emit('message received', newMessageReceived);
      });
    });

    // Chat created
    socket.on('chat created', (newChat) => {
      if (!newChat.users) return console.log('chat.users not defined');

      newChat.users.forEach((user) => {
        socket.to(user._id).emit('chat created', newChat);
      });
    });

    // Message read
    socket.on('message read', (data) => {
      socket.to(data.chatId).emit('messages read', data);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected');

      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          socket.broadcast.emit('user offline', userId);
          break;
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export { initSocket, getIO };