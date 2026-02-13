import React, { useState, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { fetchUserChats } from '../../services/chatService';
import { logoutUser } from '../../services/authService';
import { FiSearch, FiMoreVertical } from 'react-icons/fi';
import { IoMdAddCircle } from 'react-icons/io';
import ChatList from './ChatList';
import UserSearch from './UserSearch';
import GroupModal from './GroupModal';
import ProfileModal from './ProfileModal';
import './Sidebar.css';

const Sidebar = ({ socket }) => {
  const { user, setChats } = useChatContext();

  const [showSearch, setShowSearch] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const chats = await fetchUserChats();
      setChats(chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    socket.disconnect();
    navigate('/auth');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="header-left">
          <img
            src={user?.avatar}
            alt="Profile"
            className="profile-avatar"
            onClick={() => setShowProfileModal(true)}
          />
        </div>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => setShowGroupModal(true)}
          >
            <IoMdAddCircle size={24} />
          </button>

          <button
            className="icon-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FiMoreVertical size={24} />
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <button
                onClick={() => {
                  setShowProfileModal(true);
                  setShowMenu(false);
                }}
              >
                Profile
              </button>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="search-container">
        <div
          className="search-box"
          onClick={() => setShowSearch(true)}
        >
          <FiSearch size={18} />
          <span>Search or start new chat</span>
        </div>
      </div>

      <ChatList />

      {showSearch && (
        <UserSearch
          onClose={() => setShowSearch(false)}
          onChatCreated={() => {
            setShowSearch(false);
            loadChats();
          }}
        />
      )}

      {showGroupModal && (
        <GroupModal
          onClose={() => setShowGroupModal(false)}
          onGroupCreated={() => {
            setShowGroupModal(false);
            loadChats();
          }}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;