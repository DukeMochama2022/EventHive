import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { backendURL, isLoggedIn, userData } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn || !userData?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setConnected(false);
      return;
    }
    // Get JWT token from cookies or localStorage (adjust as needed)
    const token = localStorage.getItem("token");
    console.log("Socket token:", token);
    // Connect socket
    const s = io(backendURL.replace(/\/api.*/, ""), {
      auth: { token },
      withCredentials: true,
      transports: ["websocket"],
    });
    socketRef.current = s;
    setSocket(s);
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    // Clean up on unmount or logout
    return () => {
      s.disconnect();
      setSocket(null);
      setConnected(false);
    };
    // eslint-disable-next-line
  }, [isLoggedIn, userData?._id, backendURL]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
