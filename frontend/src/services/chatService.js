import API from '../config/api';

// Create group chat
export const createGroupChat = async (groupName, users) => {
  const { data } = await API.post('/chats/group', {
    name: groupName,
    users: JSON.stringify(users.map((u) => u._id)),
  });

  return data;
};

export const fetchUserChats = async () => {
  const { data } = await API.get('/chats');
  return data;
};

export const accessChat = async (userId) => {
  const { data } = await API.post('/chats', { userId });
  return data;
};