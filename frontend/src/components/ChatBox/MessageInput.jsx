import React, { useState, useRef } from 'react';
import { FiSmile, FiPaperclip, FiSend, FiX } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import './MessageInput.css';

const MessageInput = ({ onSend, onTyping }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleEmojiClick = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    // Typing indicator
    onTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() && !selectedFile) return;
    
    onSend(message, selectedFile);
    setMessage('');
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onTyping(false);
  };

  return (
    <div className="message-input-container">
      {selectedFile && (
        <div className="file-preview">
          {filePreview ? (
            <img src={filePreview} alt="Preview" />
          ) : (
            <div className="file-preview-doc">
              <span>📎 {selectedFile.name}</span>
            </div>
          )}
          <button className="remove-file-button" onClick={handleRemoveFile}>
            <FiX size={20} />
          </button>
        </div>
      )}

      <form className="message-input-form" onSubmit={handleSubmit}>
        <div className="input-actions-left">
          <button
            type="button"
            className="input-icon-button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FiSmile size={24} />
          </button>
          
          <button
            type="button"
            className="input-icon-button"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiPaperclip size={24} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>

        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={handleTyping}
          className="message-input"
        />

        <button type="submit" className="send-button" disabled={!message.trim() && !selectedFile}>
          <FiSend size={24} />
        </button>
      </form>

      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="dark"
            width="100%"
            height="400px"
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
