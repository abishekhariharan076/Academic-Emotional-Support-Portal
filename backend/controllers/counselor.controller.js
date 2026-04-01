const mongoose = require("mongoose");
const CheckIn = require("../models/CheckIn");
const User = require("../models/User");

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

exports.getStudents = async (req, res) => {
  try {
    const counselorDomain = req.user.email.split("@")[1];

    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK STUDENTS (DB disconnected)");
      return res.json([
        { _id: "s1", name: "Alice Student", email: `alice@${counselorDomain}` },
        { _id: "s2", name: "Bob Student", email: `bob@${counselorDomain}` },
        { _id: "s3", name: "Charlie Student", email: `charlie@${counselorDomain}` },
      ]);
    }

    const students = await User.find({
      role: "student",
      domain: counselorDomain
    }).select("name email domain");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getCounselors = async (req, res) => {
  try {
    const studentDomain = req.user.email.split("@")[1];

    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK COUNSELORS (DB disconnected)");
      return res.json([
        { _id: "c1", name: "Bob Counselor", email: `bob@${studentDomain}` },
        { _id: "c2", name: "Dave Counselor", email: `dave@${studentDomain}` },
      ]);
    }

    const counselors = await User.find({
      role: "counselor",
      domain: studentDomain
    }).select("name email domain");

    res.json(counselors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
