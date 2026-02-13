import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userInfo);

    if (!userInfo) {
      navigate('/auth');
    }
  }, [navigate]);

  const value = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
