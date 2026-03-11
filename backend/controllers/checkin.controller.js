const mongoose = require("mongoose");
const CheckIn = require("../models/CheckIn");
const { validationResult } = require("express-validator");

exports.createCheckIn = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { moodLevel, message, anonymous } = req.body;

    if (!moodLevel) {
      return res.status(400).json({ message: "Mood level is required" });
    }

    const domain = req.user.email.split("@")[1];

    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK CHECK-IN (DB disconnected)");
      return res.status(201).json({
        _id: "mock_" + Date.now(),
        userId: req.user.id,
        moodLevel,
        message,
        anonymous,
        domain,
        createdAt: new Date(),
        message: "Check-in saved in Mock Mode",
      });
    }

    const checkIn = await CheckIn.create({
      userId: req.user.id,
      moodLevel,
      message,
      anonymous,
      domain,
    });

    res.status(201).json(checkIn);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyCheckIns = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK LIST (DB disconnected)");
      return res.json([
        { _id: "m1", userId: req.user.id, moodLevel: 4, message: `Feeling steady today. (Account: ${req.user.email})`, createdAt: new Date(Date.now() - 86400000) },
        { _id: "m2", userId: req.user.id, moodLevel: 3, message: `A bit overwhelmed. (User ID: ${req.user.id})`, createdAt: new Date(Date.now() - 172800000) },
      ]);
    }
    const checkIns = await CheckIn.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(checkIns);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
