import API from '../config/api';

// Get messages for a chat
export const getMessages = async (chatId) => {
  const { data } = await API.get(`/messages/${chatId}`);
  return data;
};

// Mark messages as read
export const markMessagesAsRead = async (chatId) => {
  await API.put(`/messages/read/${chatId}`);
};

// Send message (text or file)
export const sendChatMessage = async (chatId, content, file) => {
  const formData = new FormData();
  formData.append('chatId', chatId);

  if (file) {
    formData.append('file', file);
    if (content) formData.append('content', content);
  } else {
    formData.append('content', content);
  }

  const { data } = await API.post('/messages', formData);

  return data;
};