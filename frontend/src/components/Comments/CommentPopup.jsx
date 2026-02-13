import React, { useEffect, useRef, useState } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { fetchComments, postComment } from '../../services/commentService';
import { useChatContext } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import './CommentPopup.css';
import moment from 'moment';

const CommentPopup = ({ messageId, onClose }) => {
    const { user, selectedChat } = useChatContext();
    const { socket } = useSocket();

    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const popupRef = useRef(null);

    /* -------------------- Load Initial Comments -------------------- */
    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await fetchComments(messageId);

                const sorted = [...data].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setComments(sorted);
            } catch (err) {
                console.error('Load comments error:', err);
            }
        };

        if (messageId) loadComments();
    }, [messageId]);

    /* -------------------- Real-Time Listener -------------------- */
    useEffect(() => {
        if (!socket) return;

        const handleCommentReceived = ({ messageId: incomingId, comment }) => {
            if (incomingId !== messageId) return;

            setComments((prev) => {
                if (prev.some((c) => c._id === comment._id)) return prev;
                return [comment, ...prev];
            });
        };

        socket.on('comment received', handleCommentReceived);

        return () => {
            socket.off('comment received', handleCommentReceived);
        };
    }, [socket, messageId]);

    /* -------------------- Close On Outside Click -------------------- */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    /* -------------------- Submit Comment -------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const newComment = await postComment(messageId, text);

            // Optimistic update
            setComments((prev) => [newComment, ...prev]);

            // Emit to server
            if (socket && selectedChat) {
                socket.emit('new comment', {
                    messageId,
                    comment: newComment,
                    chat: selectedChat,
                });
            }

            setText('');
        } catch (err) {
            console.error('Post comment error:', err);
        }
    };

    return (
        <div className="comment-popup" ref={popupRef}>
            <div className="comment-header">Comments</div>

            <div className="comment-list">
                <ScrollableFeed>
                    {comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                            <div className="comment-top">
                                <span className="comment-user">
                                    {(comment.user?._id === user._id) ? 'You' : comment.user?.name}
                                </span>

                                <span className="comment-time">
                                    {moment(comment.createdAt).format('L LT')}
                                </span>
                            </div>

                            <div className="comment-text">
                                {comment.content}
                            </div>
                        </div>
                    ))}
                </ScrollableFeed>
            </div>

            <form onSubmit={handleSubmit} className="comment-input">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default CommentPopup;