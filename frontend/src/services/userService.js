import API from '../config/api';

// Search users
export const searchUsers = async (query) => {
  const { data } = await API.get(`/users?search=${query}`);
  return data;
};