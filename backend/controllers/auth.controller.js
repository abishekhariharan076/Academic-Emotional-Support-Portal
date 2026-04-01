const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email, domain: user.domain }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "dummy-id");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }

    if (mongoose.connection.readyState !== 1) {
      const mockDomain = email.includes("@") ? email.split("@")[1] : "example.edu";
      const mockUser = {
        _id: `mock_${Date.now()}`,
        name,
        email,
        role: ["student", "counselor", "admin"].includes(role) ? role : "student",
        domain: mockDomain,
      };
      const token = signToken(mockUser);
      return res.status(201).json({
        token,
        user: mockUser,
        message: "Logged in via Mock Mode (Database Offline)",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const domain = email.split("@")[1];
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: ["student", "counselor", "admin"].includes(role) ? role : "student",
      domain,
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, domain: user.domain },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    if (mongoose.connection.readyState !== 1) {
      let role = "student";
      if (email.startsWith("admin")) role = "admin";
      else if (email.startsWith("counselor")) role = "counselor";

      const domain = email.includes("@") ? email.split("@")[1] : "example.edu";
      const mockUser = {
        _id: `mock_${role}_${Date.now()}`,
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        email,
        role,
        domain,
      };
      const token = signToken(mockUser);
      return res.json({
        token,
        user: mockUser,
        message: `Logged in as ${role.toUpperCase()} via Mock Mode (Database Offline)`,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`SECURITY: Failed login attempt for non-existent email: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.warn(`SECURITY: Failed login attempt for email: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, domain: user.domain },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  if (!tokenId) {
    return res.status(400).json({ message: "tokenId is required" });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      const mockUser = {
        _id: `mock_google_${Date.now()}`,
        name: "Mock Google User",
        email: "google_user@example.com",
        role: "student",
        domain: "example.edu",
      };
      const token = signToken(mockUser);
      return res.json({
        token,
        user: mockUser,
        message: "Logged in via Mock Mode (Database Offline)",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      const domain = email.split("@")[1];
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
        role: "student",
        domain,
      });
      console.log(`New user created via Google: ${email}`);
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, domain: user.domain, picture },
    });
  } catch (err) {
    console.error("Google Login Error:", err.message);
    return res.status(500).json({ message: "Google login failed", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const mockToken = jwt.sign({ id: "mock_id" }, process.env.JWT_SECRET || "mock_secret", { expiresIn: "1h" });
      return res.json({
        message: "If that email exists, a reset link has been sent.",
        debugToken: mockToken,
      });
    }

    const user = await User.findOne({ email });
    console.log(`SECURITY: Password reset requested for: ${email}`);

    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log(`[PASSWORD RESET] Token for ${email}: ${resetToken}`);

    return res.json({
      message: "If that email exists, a reset link has been sent.",
      debugToken: resetToken,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: "Password updated successfully (Mock Mode)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token", error: err.message });
  }
};
