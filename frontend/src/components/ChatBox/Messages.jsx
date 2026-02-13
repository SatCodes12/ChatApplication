import React, { useEffect, useRef } from 'react';
import { useChatContext } from '../../context/ChatContext';
import moment from 'moment';
import ScrollableFeed from 'react-scrollable-feed';
import { ClipLoader } from 'react-spinners';
import './Messages.css';

const Messages = ({ messages, loading, isTyping }) => {
  const { user } = useChatContext();
  const messagesEndRef = useRef(null);

  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  const renderMessageContent = (message) => {
    if (message.messageType === 'image') {
      return (
        <div className="message-image-container">
          <img src={message.fileUrl} alt="Shared" className="message-image" />
          {message.content && <p>{message.content}</p>}
        </div>
      );
    } else if (message.messageType === 'file') {
      return (
        <div className="message-file">
          <div className="file-icon">📎</div>
          <div className="file-info">
            <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
              {message.fileName}
            </a>
            <small>{(message.fileSize / 1024).toFixed(2)} KB</small>
          </div>
        </div>
      );
    }
    return <p>{message.content}</p>;
  };

  if (loading) {
    return (
      <div className="messages-loading">
        <ClipLoader color="var(--primary-color)" size={50} />
      </div>
    );
  }

  return (
    <div className="messages-container">
      <ScrollableFeed>
        {messages.map((message, i) => (
          <div
            key={message._id}
            className={`message-wrapper ${message.sender._id === user._id ? 'sent' : 'received'
              }`}
          >
            {(isSameSender(messages, message, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
                <img
                  src={message.sender.avatar}
                  alt={message.sender.name}
                  className="message-avatar"
                />
              )}

            <div
              className={`message-bubble ${message.sender._id === user._id ? 'sent-bubble' : 'received-bubble'
                }`}
            >

            <div className="message-sender">
              {message.sender._id === user._id ? 'You' : message.sender.name}
            </div>

            {renderMessageContent(message)}
            <span className="message-time">
              {moment(message.createdAt).format('L LT')}
            </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollableFeed>
    </div>
  );
};

export default Messages;
