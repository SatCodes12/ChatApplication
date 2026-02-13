import React, { useState, useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import { useSocket } from "../../context/SocketContext";
import {
  getMessages,
  markMessagesAsRead,
  sendChatMessage,
} from "../../services/messageService";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import "./ChatBox.css";

const ChatBox = () => {
  const { selectedChat, setChats } = useChatContext();
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Load messages + join room
  useEffect(() => {
    if (!selectedChat || !socket) return;

    const loadMessages = async () => {
      try {
        setLoading(true);

        const data = await getMessages(selectedChat._id);
        setMessages(data);

        socket.emit("join chat", selectedChat._id);

        await markMessagesAsRead(selectedChat._id);
        socket.emit("message read", { chatId: selectedChat._id });

      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [selectedChat, socket]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessage) => {
      if (!selectedChat) return;

      console.log("New message received:", newMessage);

      if (newMessage.chat._id === selectedChat._id) {
        setMessages((prev) => {
          const exists = prev.find((m) => m._id === newMessage._id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }
    };

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [selectedChat, socket]);

  // Typing indicators
  useEffect(() => {
    if (!socket) return;

    const handleTyping = (roomId) => {
      if (selectedChat && roomId === selectedChat._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (roomId) => {
      if (selectedChat && roomId === selectedChat._id) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stop typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    setIsTyping(false);
  }, [selectedChat]);

  const handleSendMessage = async (content, file) => {
    try {
      const newMessage = await sendChatMessage(
        selectedChat._id,
        content,
        file
      );

      socket.emit("new message", newMessage);

      // Update messages UI
      setMessages((prev) => [...prev, newMessage]);

      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex(
          (chat) => chat._id === selectedChat._id
        );

        if (chatIndex === -1) return prevChats;

        const updatedChat = {
          ...prevChats[chatIndex],
          latestMessage: newMessage,
        };

        const newChats = [...prevChats];
        newChats.splice(chatIndex, 1);
        newChats.unshift(updatedChat);

        return newChats;
      });

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const typingHandler = (status) => {
    if (!selectedChat || !socket) return;

    if (status) {
      socket.emit("typing", selectedChat._id);
    } else {
      socket.emit("stop typing", selectedChat._id);
    }
  };

  return (
    <div className="chatbox">
      <ChatHeader />
      <Messages messages={messages} loading={loading} isTyping={isTyping} />
      <MessageInput onSend={handleSendMessage} onTyping={typingHandler} />
    </div>
  );
};

export default ChatBox;