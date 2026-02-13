import React, { useState } from 'react';
import { FiX, FiCamera } from 'react-icons/fi';
import { useChatContext } from '../../context/ChatContext';
import { updateUserProfile } from '../../services/authService';
import './ProfileModal.css';

const ProfileModal = ({ onClose }) => {
  const { user, setUser } = useChatContext();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const updatedUser = await updateUserProfile(
        name,
        bio,
        avatar
      );

      setUser(updatedUser);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="profile-modal-header">
          <h2>Profile</h2>
          <button className="close-button" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="profile-modal-body">
          <div className="profile-avatar-section">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : user?.avatar
              }
              alt="Profile"
              className="profile-avatar-large"
            />

            <label className="avatar-upload-label">
              <FiCamera size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              className="update-profile-button"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;