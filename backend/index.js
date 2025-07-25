const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const seedPlans = require("./seedPlans");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const eventRoutes = require("./routes/eventPackageRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message");
const contactMessageRoutes = require("./routes/contactMessageRoutes");
const planRoutes = require("./routes/planRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EventHive API",
      version: "1.0.0",
      description: "API documentation for EventHive",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"], // Adjust as needed
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://event-hive-red.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

const connectedUsers = new Map(); // userId -> socket.id[]

io.on("connection", (socket) => {
  const userId = socket.user.id;
  // Track connected users
  if (!connectedUsers.has(userId)) connectedUsers.set(userId, []);
  connectedUsers.get(userId).push(socket.id);

  console.log("Socket connected:", socket.id, socket.user);

  // Join a chat room (by booking or package)
  socket.on("joinRoom", ({ bookingId, packageId }) => {
    let room = null;
    if (bookingId) room = `booking_${bookingId}`;
    else if (packageId) room = `package_${packageId}`;
    if (room) {
      socket.join(room);
      // Optionally, mark all messages as read when joining
    }
  });

  // Send a message
  socket.on("sendMessage", async (data) => {
    console.log("sendMessage event received:", data); // <-- log event
    try {
      const { receiver, content, packageId, bookingId } = data;
      if (!receiver || !content) return;
      // Save message
      const message = await Message.create({
        sender: userId,
        receiver,
        content,
        package: packageId,
        booking: bookingId,
        isRead: false,
      });
      console.log("Message created:", message); // <-- log message
      await message.populate("sender", "_id username role");
      let room = null;
      if (bookingId) room = `booking_${bookingId}`;
      else if (packageId) room = `package_${packageId}`;
      if (room) {
        io.to(room).emit("newMessage", message);
      }
      // Emit notification to receiver if online
      const receiverSockets = connectedUsers.get(receiver) || [];
      receiverSockets.forEach((sid) => {
        io.to(sid).emit("notification", { message });
      });
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  });

  // Fetch messages for a room
  socket.on("fetchMessages", async ({ bookingId, packageId }, callback) => {
    try {
      let filter = {};
      if (bookingId) filter.booking = bookingId;
      else if (packageId) filter.package = packageId;
      filter.$or = [{ sender: userId }, { receiver: userId }];
      const messages = await Message.find(filter)
        .sort({ createdAt: 1 })
        .populate("sender", "_id username role")
        .populate("receiver", "_id username role");
      // Mark as read all messages where receiver is user and isRead is false
      await Message.updateMany(
        { ...filter, receiver: userId, isRead: false },
        { $set: { isRead: true } }
      );
      if (callback) callback(messages);
    } catch (err) {
      if (callback) callback([]);
    }
  });

  // Get unread count (optionally per booking/package)
  socket.on(
    "getUnreadCount",
    async ({ bookingId, packageId } = {}, callback) => {
      try {
        let filter = { receiver: userId, isRead: false };
        if (bookingId) filter.booking = bookingId;
        else if (packageId) filter.package = packageId;
        const count = await Message.countDocuments(filter);
        if (callback) callback(count);
      } catch (err) {
        if (callback) callback(0);
      }
    }
  );

  socket.on("disconnect", () => {
    // Remove socket from connectedUsers
    if (connectedUsers.has(userId)) {
      connectedUsers.set(
        userId,
        connectedUsers.get(userId).filter((sid) => sid !== socket.id)
      );
      if (connectedUsers.get(userId).length === 0) {
        connectedUsers.delete(userId);
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/packages", eventRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/messages", contactMessageRoutes);
app.use("/api/plans", planRoutes);
app.get("/", (req, res) => {
  res.send("EventHive Api running");
});

(async () => {
  await connectDB();
  await seedPlans();
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

module.exports = { io };
