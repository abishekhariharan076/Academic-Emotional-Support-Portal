const mongoose = require("mongoose");
const CheckIn = require("../models/CheckIn");

exports.getAllCheckIns = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK ALL CHECK-INS (DB disconnected)");
      return res.json([
        { _id: "m1", userId: { name: "Alice Student", email: "alice@test.com" }, moodLevel: 80, message: "Feeling great!", status: "open", createdAt: new Date(Date.now() - 86400000) },
        { _id: "m2", userId: { name: "John Doe", email: "john@test.com" }, moodLevel: 30, message: "Struggling with exams.", status: "open", createdAt: new Date(Date.now() - 43200000) },
      ]);
    }
    const checkIns = await CheckIn.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(checkIns);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.reviewCheckIn = async (req, res) => {
  try {
    const { id } = req.params;
    const { counselorNote } = req.body;

    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK REVIEW (DB disconnected)");
      return res.json({
        _id: id,
        status: "reviewed",
        counselorNote: counselorNote || "Mock review saved.",
        updatedAt: new Date(),
      });
    }

    const checkIn = await CheckIn.findById(id);
    if (!checkIn) {
      return res.status(404).json({ message: "Check-in not found" });
    }

    checkIn.status = "reviewed";
    checkIn.counselorNote = counselorNote || "";

    await checkIn.save();

    // return updated document
    res.json(checkIn);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
