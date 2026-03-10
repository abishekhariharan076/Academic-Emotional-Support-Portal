const mongoose = require("mongoose");
const User = require("../models/User");
const CheckIn = require("../models/CheckIn");

exports.getStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK STATS (DB disconnected)");
      return res.json({
        users: { total: 150, students: 130, counselors: 15, admins: 5 },
        checkIns: {
          total: 500,
          open: 12,
          reviewed: 488,
          last7Days: 45,
        },
      });
    }

    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: "student" });
    const counselors = await User.countDocuments({ role: "counselor" });
    const admins = await User.countDocuments({ role: "admin" });

    const totalCheckIns = await CheckIn.countDocuments();
    const openCheckIns = await CheckIn.countDocuments({ status: "open" });
    const reviewedCheckIns = await CheckIn.countDocuments({ status: "reviewed" });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const last7Days = await CheckIn.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      users: { total: totalUsers, students, counselors, admins },
      checkIns: {
        total: totalCheckIns,
        open: openCheckIns,
        reviewed: reviewedCheckIns,
        last7Days,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK USERS (DB disconnected)");
      return res.json([
        { _id: "u1", name: "Alice Student", email: "alice@test.com", role: "student", createdAt: new Date() },
        { _id: "u2", name: "Bob Counselor", email: "bob@test.com", role: "counselor", createdAt: new Date() },
        { _id: "u3", name: "Charlie Admin", email: "charlie@test.com", role: "admin", createdAt: new Date() },
      ]);
    }
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion if needed (optional but recommended)
    if (id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own admin account." });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User successfully removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
