import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { createGroupChat } from '../../services/chatService';
import { searchUsers } from '../../services/userService';
import { useSocket } from '../../context/SocketContext';
import './GroupModal.css';

const GroupModal = ({ onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSelectUser = (user) => {
    const alreadySelected = selectedUsers.find(
      (u) => u._id === user._id
    );

    if (alreadySelected) {
      setSelectedUsers(
        selectedUsers.filter((u) => u._id !== user._id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      alert('Please add at least 2 users and provide a group name');
      return;
    }

    try {
      setLoading(true);

      const createdGroupChat = await createGroupChat(groupName, selectedUsers);
      socket.emit('chat created', createdGroupChat);

      if (onGroupCreated) {
        onGroupCreated(createdGroupChat);
      }
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-modal-overlay">
      <div className="group-modal">
        <div className="group-modal-header">
          <h2>Create Group Chat</h2>
          <button className="close-button" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="group-modal-body">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="group-name-input"
          />

          <div className="selected-users">
            {selectedUsers.map((user) => (
              <div key={user._id} className="selected-user-badge">
                <span>{user.name}</span>
                <button onClick={() => handleSelectUser(user)}>
                  ×
                </button>
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder="Add users..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="user-search-input"
          />

          <div className="user-search-results">
            {searchResults.map((user) => {
              const isSelected = selectedUsers.find(
                (u) => u._id === user._id
              );

              return (
                <div
                  key={user._id}
                  className={`user-search-item ${isSelected ? 'selected' : ''
                    }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <img src={user.avatar} alt={user.name} />
                  <div className="user-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="create-group-button"
            onClick={handleCreateGroup}
            disabled={loading || !groupName || selectedUsers.length < 2}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
