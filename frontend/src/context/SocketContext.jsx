import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useChatContext } from "./ChatContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useChatContext();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(
      process.env.REACT_APP_SOCKET_URL || "http://localhost:5000",
      { withCredentials: true }
    );

    newSocket.emit("setup", user);

    newSocket.on("user online", (userId) => {
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    });

    newSocket.on("user offline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};