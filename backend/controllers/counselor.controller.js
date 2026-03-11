const mongoose = require("mongoose");
const CheckIn = require("../models/CheckIn");

exports.getAllCheckIns = async (req, res) => {
  try {
    // Extract counselor's domain
    const counselorDomain = req.user.email.split("@")[1];

    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK ALL CHECK-INS (DB disconnected)");
      return res.json([
        { _id: "m1", userId: { name: "Alice Student", email: "alice@test.com" }, moodLevel: 4, message: "Feeling steady.", status: "open", anonymous: false, domain: counselorDomain, createdAt: new Date(Date.now() - 86400000) },
        { _id: "m2", userId: null, moodLevel: 2, message: "Stress is high.", status: "open", anonymous: true, domain: counselorDomain, createdAt: new Date(Date.now() - 43200000) },
      ]);
    }

    // Filter by counselor's institutional domain
    const checkIns = await CheckIn.find({ domain: counselorDomain })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // Map to hide user details if anonymous
    const sanitizedCheckIns = checkIns.map(c => {
      const entry = c.toObject();
      if (entry.anonymous) {
        entry.userId = { name: "Anonymous Student", email: "hidden@aesp.org" };
      }
      return entry;
    });

    res.json(sanitizedCheckIns);
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
    checkIn.reviewedBy = req.user.id;

    await checkIn.save();

    // return updated document
    res.json(checkIn);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
