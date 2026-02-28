const CheckIn = require("../models/CheckIn");

exports.createCheckIn = async (req, res) => {
  try {
    const { moodLevel, message, anonymous } = req.body;

    if (!moodLevel) {
      return res.status(400).json({ message: "Mood level is required" });
    }

    const checkIn = await CheckIn.create({
      userId: req.user.id,
      moodLevel,
      message,
      anonymous,
    });

    res.status(201).json(checkIn);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(checkIns);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
