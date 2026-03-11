const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("mongo-sanitize");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const checkInRoutes = require("./routes/checkin.routes");
const counselorRoutes = require("./routes/counselor.routes");
const adminRoutes = require("./routes/admin.routes");
const supportRoutes = require("./routes/support.routes");


require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Sanitize NoSQL Injection
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  next();
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Increased limit for testing/reliability
  message: { message: "Too many authentication attempts, please try again in an hour." },
  skip: (req) => req.method === "OPTIONS", // Don't limit preflight requests
});

app.use("/api", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/checkins", checkInRoutes);
app.use("/api/counselor", counselorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/resources", require("./routes/resource.routes"));



// test route
app.get("/", (req, res) => {
  res.send("AESP backend running ✅");
});

// database connection
console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => {
    console.error("MongoDB error ❌", err.message);
    console.log("Proceeding without MongoDB connection for now...");
  });

// Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("join-room", (roomId) => {
    // Basic validation: roomId should start with chat_ and match user's domain
    // In a prod app, we'd verify the JWT here. 
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("send-message", (data) => {
    // data: { roomId, sender, message, timestamp }
    io.to(data.roomId).emit("receive-message", data);
    console.log(`Message in ${data.roomId} from ${data.sender}: ${data.message}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
console.log(`Starting server on port ${PORT}...`);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
