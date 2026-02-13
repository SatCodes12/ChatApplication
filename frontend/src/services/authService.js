import API from '../config/api';

// Login User
export const loginUser = async (email, password) => {
  const { data } = await API.post('/auth/login', {
    email,
    password,
  });

  localStorage.setItem('userInfo', JSON.stringify(data));
  return data;
};

// Register User
export const registerUser = async (userData) => {
  const { data } = await API.post('/auth/register', userData);

  localStorage.setItem('userInfo', JSON.stringify(data));
  return data;
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem('userInfo');
};

export const updateUserProfile = async (name, bio, avatar) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('bio', bio);

  if (avatar) {
    formData.append('avatar', avatar);
  }

  const { data } = await API.put('/auth/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // Merge with existing user
  const existingUser = JSON.parse(localStorage.getItem('userInfo'));
  const updatedUser = { ...existingUser, ...data };

  localStorage.setItem('userInfo', JSON.stringify(updatedUser));

  return updatedUser;
};
