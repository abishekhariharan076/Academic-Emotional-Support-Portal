const User = require("../models/User");
const CheckIn = require("../models/CheckIn");

exports.getStats = async (req, res) => {
  try {
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
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
