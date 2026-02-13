import React, { useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import { useSocket } from "../../context/SocketContext";
import moment from "moment";
import "./ChatList.css";

const ChatList = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = useChatContext();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const updateLatestMessage = (newMessage) => {
      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex(
          (chat) => chat._id === newMessage.chat._id
        );

        if (chatIndex === -1) {
          const newChat = {
            ...newMessage.chat,
            latestMessage: newMessage,
          };

          return [newChat, ...prevChats];
        }

        const updatedChat = {
          ...prevChats[chatIndex],
          latestMessage: newMessage,
        };

        const newChats = [...prevChats];
        newChats.splice(chatIndex, 1);
        newChats.unshift(updatedChat);

        return newChats;
      });
    };

    const handleChatCreated = (newChat) => {
      setChats((prevChats) => {
        const exists = prevChats.find((chat) => chat._id === newChat._id);

        if (exists) return prevChats;

        return [newChat, ...prevChats];
      });
    };

    socket.on("message received", updateLatestMessage);
    socket.on("chat created", handleChatCreated);

    return () => {
      socket.off("message received", updateLatestMessage);
      socket.off("chat created", handleChatCreated);
    };
  }, [socket, setChats]);

  const getSender = (chat) => {
    if (chat.isGroupChat) return chat.chatName;
    return chat.users.find((u) => u._id !== user._id)?.name || "Unknown";
  };

  const getSenderAvatar = (chat) => {
    if (chat.isGroupChat)
      return chat.groupAvatar ||
        "https://icon-library.com/images/group-icon/group-icon-11.jpg";
    return chat.users.find((u) => u._id !== user._id)?.avatar;
  };

  const isOnline = (chat) => {
    if (chat.isGroupChat) return false;
    const otherUser = chat.users.find((u) => u._id !== user._id);
    return false;
  };

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`chat-item ${selectedChat?._id === chat._id ? "active" : ""
            }`}
          onClick={() => setSelectedChat(chat)}
        >
          <div className="avatar-wrapper">
            <img
              src={getSenderAvatar(chat)}
              alt={getSender(chat)}
              className="chat-avatar"
            />
            {isOnline(chat) && <span className="online-dot" />}
          </div>

          <div className="chat-info">
            <div className="chat-header-info">
              <h3>{getSender(chat)}</h3>
              <span className="chat-time">
                {chat.latestMessage &&
                  moment(chat.latestMessage.createdAt).format("L LT")}
              </span>
            </div>

            <p className="chat-preview">
              {chat.latestMessage
                ? chat.latestMessage.messageType === "image"
                  ? "📷 Image"
                  : chat.latestMessage.content
                : "Start chatting..."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;