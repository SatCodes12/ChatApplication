import React, { useEffect, useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatBox from '../components/ChatBox/ChatBox';
import io from 'socket.io-client';
import './Chat.css';

const ENDPOINT = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
let socket, selectedChatCompare;

const Chat = () => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = useChatContext();
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        setNotification((prev) => [newMessageReceived, ...prev]);
      }
    });

    return () => {
      socket.off('message received');
    };
  }, []);

  return (
    <div className="chat-container">
      <Sidebar socket={socket} />
      {selectedChat ? (
        <ChatBox socket={socket} />
      ) : (
        <div className="no-chat-selected">
          <div className="no-chat-content">
            <div className="no-chat-icon">💬</div>
            <h2>Welcome to Chat App</h2>
            <p>Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
export { socket };
