const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
  res.send("EventHive Api running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
