import API from '../config/api';

// Get all comments for a message
export const fetchComments = async (messageId) => {
  const { data } = await API.get(`/comments/${messageId}`);
  return data;
};

// Post a new comment
export const postComment = async (messageId, content) => {
  const { data } = await API.post('/comments', {
    messageId,
    content,
  });
  return data;
};