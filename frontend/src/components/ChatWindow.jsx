import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { Loader2, Send, User } from "lucide-react";

const ChatWindow = ({ booking, onClose }) => {
  const { socket, connected } = useContext(SocketContext);
  const { userData } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Join room and fetch messages
  useEffect(() => {
    let didTimeout = false;
    if (!socket || !booking?._id) {
      setLoading(false);
      return;
    }
    if (!connected) {
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log("Current booking._id:", booking._id);
    socket.emit("joinRoom", { bookingId: booking._id });
    let timeout = setTimeout(() => {
      didTimeout = true;
      setLoading(false);
    }, 5000); // fallback after 5s
    socket.emit("fetchMessages", { bookingId: booking._id }, (msgs) => {
      console.log("Fetched messages:", msgs);
      setMessages(msgs || []);
      setLoading(false);
      clearTimeout(timeout);
    });
    // Listen for new messages
    const handleNewMessage = (msg) => {
      console.log("Received newMessage:", msg);
      if (msg.booking?.toString() === booking._id?.toString()) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
      clearTimeout(timeout);
    };
  }, [socket, booking?._id, connected]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    console.log("booking:", booking);
    console.log("userData:", userData);
    const clientId =
      typeof booking.client === "string" ? booking.client : booking.client?._id;
    const plannerId =
      typeof booking.planner === "string"
        ? booking.planner
        : booking.planner?._id;
    const receiver = userData._id === clientId ? plannerId : clientId;
    console.log(
      "clientId:",
      clientId,
      "plannerId:",
      plannerId,
      "userData._id:",
      userData._id,
      "receiver:",
      receiver
    );
    console.log("Emitting sendMessage:", {
      receiver,
      content: input,
      bookingId: booking._id,
    });
    if (!receiver) {
      alert(
        "Cannot send message: receiver is undefined. Please refresh the page or contact support."
      );
      return;
    }
    socket.emit("sendMessage", {
      receiver,
      content: input,
      bookingId: booking._id,
    });
    setInput("");
  };

  // Debug: log input changes
  const handleInputChange = useCallback((e) => {
    console.log("Input changed:", e.target.value);
    setInput(e.target.value);
  }, []);

  // Determine chat partner
  const isClient = userData._id === booking.client._id;
  const partner = isClient ? booking.planner : booking.client;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col relative border-2 border-blue-100">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Header */}
        <div className="p-5 border-b flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-200">
            <User className="w-7 h-7 text-blue-700" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-blue-800 text-lg">
              Chatting with {partner?.username || "User"}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {partner?.role || "user"}
            </span>
            <span className="text-xs text-gray-400">
              Package:{" "}
              <span className="font-semibold">{booking.package?.title}</span>
            </span>
          </div>
        </div>
        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-white to-blue-50"
          style={{ minHeight: 300, maxHeight: 400 }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-gray-400 text-center">No messages yet.</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex flex-col ${
                  msg.sender._id === userData._id ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg shadow text-sm max-w-xs break-words ${
                    msg.sender._id === userData._id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {msg.sender.username} •{" "}
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        {connected === false && (
          <div className="text-center text-red-500 text-xs mb-2">
            Not connected to chat server.
          </div>
        )}
        <form
          onSubmit={handleSend}
          className="flex gap-2 p-4 border-t bg-white rounded-b-2xl"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="flex-1 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            placeholder="Type a message..."
            autoFocus
            disabled={connected === false}
          />
          <button
            type="submit"
            disabled={!input.trim() || connected === false}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        {loading && (
          <div className="text-center text-gray-400 text-xs mt-2">
            Loading chat... If this takes too long, please refresh.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
 