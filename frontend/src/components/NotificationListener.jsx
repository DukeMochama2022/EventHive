import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { showInfo } from "../utils/toast";

const NotificationListener = () => {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      const { message } = data;
      if (message && message.sender && message.sender.username) {
        showInfo(`New message from ${message.sender.username}`);
      } else {
        showInfo("New message received");
      }
    };
    socket.on("notification", handler);
    return () => {
      socket.off("notification", handler);
    };
  }, [socket]);

  return null;
};

export default NotificationListener;
