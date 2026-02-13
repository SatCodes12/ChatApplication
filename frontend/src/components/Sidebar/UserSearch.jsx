import React, { useState } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import { useChatContext } from '../../context/ChatContext';
import { accessChat } from '../../services/chatService';
import { searchUsers } from '../../services/userService';
import './UserSearch.css';

const UserSearch = ({ onClose, onChatCreated }) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setSelectedChat } = useChatContext();

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const results = await searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccessChat = async (userId) => {
    try {
      const chat = await accessChat(userId);
      setSelectedChat(chat);
      onChatCreated();
    } catch (error) {
      console.error('Error accessing chat:', error);
    }
  };

  return (
    <div className="user-search-overlay">
      <div className="user-search-modal">
        <div className="search-modal-header">
          <h2>New Chat</h2>
          <button className="close-button" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="search-input-container">
          <FiSearch size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="search-results">
          {loading ? (
            <div className="loading-text">Searching...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user._id}
                className="user-result-item"
                onClick={() => handleAccessChat(user._id)}
              >
                <img src={user.avatar} alt={user.name} />
                <div className="user-result-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
            ))
          ) : search ? (
            <div className="no-results">No users found</div>
          ) : (
            <div className="no-results">
              Start typing to search users
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;