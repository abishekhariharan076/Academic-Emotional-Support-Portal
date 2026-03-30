const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io"); // Still required for types if needed, but we'll remove usage
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
const io = null; // Removed Socket.io

// middleware
// whitelist for CORS
const whitelist = [
  "https://academic-emotional-support-portal.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
  max: 300, // Limit each IP to 300 requests per window (increased from 100)
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Increased limit for testing/reliability
  message: { message: "Too many authentication attempts, please try again in an hour." },
  skip: (req) => req.method === "OPTIONS", // Don't limit preflight requests
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api", limiter);
app.use("/api/checkins", checkInRoutes);
app.use("/api/counselor", counselorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/reference", require("./routes/resource.routes"));



// test route
app.get("/", (req, res) => {
  res.send("AESP backend running ✅");
});

// database connection
const connectWithRetry = () => {
  console.log("Attempting to connect to MongoDB...");
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) => {
      console.error("MongoDB error ❌", err.message);
      console.log("Retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Global Error Handler (Must be last)
app.use(require("./middleware/error.middleware"));

const PORT = process.env.PORT || 5000;
console.log(`Starting server on port ${PORT}...`);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
