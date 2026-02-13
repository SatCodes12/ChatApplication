import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import { FiMoreVertical, FiArrowLeft } from 'react-icons/fi';
import './ChatHeader.css';

const ChatHeader = () => {
  const { selectedChat, setSelectedChat, user } = useChatContext();

  const getSender = () => {
    if (!selectedChat) return '';
    if (selectedChat.isGroupChat) {
      return selectedChat.chatName;
    }
    return selectedChat.users.find((u) => u._id !== user._id)?.name || 'Unknown';
  };

  const getSenderAvatar = () => {
    if (!selectedChat) return '';
    if (selectedChat.isGroupChat) {
      return selectedChat.groupAvatar || 'https://icon-library.com/images/group-icon/group-icon-11.jpg';
    }
    return selectedChat.users.find((u) => u._id !== user._id)?.avatar;
  };

  const getGroupInfo = () => {
    if (selectedChat.isGroupChat) {
      return `${selectedChat.users.length} members`;
    }
    return 'Solo chat';
  };

  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <button className="back-button" onClick={() => setSelectedChat(null)}>
          <FiArrowLeft size={24} />
        </button>
        <img
          src={getSenderAvatar()}
          alt={getSender()}
          className="chat-header-avatar"
        />
        <div className="chat-header-info">
          <h3 style={{ marginRight: '6px', display: 'inline' }}>
            {getSender()}
          </h3>
          <span className="chat-status">{getGroupInfo()}</span>
        </div>
      </div>
      <div className="chat-header-actions">
        <button className="icon-button">
          <FiMoreVertical size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
