import { useContext, useEffect, useState, useCallback } from "react";
import { SocketContext } from "../context/SocketContext";

const useUnreadCount = ({ bookingId, packageId } = {}) => {
  const { socket } = useContext(SocketContext);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(() => {
    if (socket) {
      socket.emit("getUnreadCount", { bookingId, packageId }, (count) => {
        setUnreadCount(count || 0);
      });
    }
  }, [socket, bookingId, packageId]);

  useEffect(() => {
    fetchUnread();
    // Optionally, listen for newMessage to refresh
    if (!socket) return;
    socket.on("newMessage", fetchUnread);
    return () => {
      socket.off("newMessage", fetchUnread);
    };
  }, [fetchUnread, socket]);

  return { unreadCount, refreshUnread: fetchUnread };
};

export default useUnreadCount;
