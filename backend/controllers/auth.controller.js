const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }

    // Check database connection status
    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK REGISTRATION (DB disconnected)");
      const mockUser = {
        _id: "mock_" + Date.now(),
        name,
        email,
        role: ["student", "counselor", "admin"].includes(role) ? role : "student",
      };
      const token = signToken(mockUser);
      return res.status(201).json({
        token,
        user: mockUser,
        message: "Logged in via Mock Mode (Database Offline)",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: ["student", "counselor", "admin"].includes(role) ? role : "student",
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    // Check database connection status
    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK LOGIN (DB disconnected)");

      let role = "student";
      if (email.startsWith("admin")) role = "admin";
      else if (email.startsWith("counselor")) role = "counselor";

      const mockUser = {
        _id: "mock_" + role + "_" + Date.now(),
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        email: email,
        role: role,
      };
      const token = signToken(mockUser);
      return res.json({
        token,
        user: mockUser,
        message: `Logged in as ${role.toUpperCase()} via Mock Mode (Database Offline)`,
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
