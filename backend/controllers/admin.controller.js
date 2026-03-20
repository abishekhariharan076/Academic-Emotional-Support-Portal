const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const CheckIn = require("../models/CheckIn");
const InstitutionRequest = require("../models/InstitutionRequest");

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
    const users = await User.find()
      .select("-password")
      .populate("assignedCounselor", "name email")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      console.log(`Proceeding with MOCK DELETE USER for ${id} (DB disconnected)`);
      return res.json({ message: "User successfully removed (Mock Mode)" });
    }

    // Prevent self-deletion
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

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["student", "counselor", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (mongoose.connection.readyState !== 1) {
      console.log(`Proceeding with MOCK UPDATE ROLE for ${id} to ${role} (DB disconnected)`);
      return res.json({ message: `User role updated to ${role} (Mock Mode)` });
    }

    if (id === req.user.id && role !== "admin") {
      return res.status(400).json({ message: "You cannot demote yourself from admin." });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createCounselor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK COUNSELOR CREATION (DB disconnected)");
      return res.status(201).json({
        message: "Counselor account created successfully (Mock Mode)",
        user: { id: "mock_c_" + Date.now(), name, email, role: "counselor" }
      });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const domain = email.split("@")[1];
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "counselor",
      domain
    });

    res.status(201).json({
      message: "Counselor account created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getCounselorLogs = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK COUNSELOR LOGS (DB disconnected)");
      return res.json([
        { _id: "ml1", userId: { name: "Alice Student" }, reviewedBy: { name: "Bob Counselor" }, counselorNote: "Mock log 1", status: "reviewed", updatedAt: new Date() },
        { _id: "ml2", userId: { name: "Charlie Student" }, reviewedBy: { name: "Dave Counselor" }, counselorNote: "Mock log 2", status: "reviewed", updatedAt: new Date() },
      ]);
    }

    // This is a placeholder for actual logging logic. 
    // In a real app, you'd query a separate Logs collection.
    // For now, we'll return recently reviewed check-ins by all counselors.
    const logs = await CheckIn.find({ status: "reviewed" })
      .populate("userId", "name")
      .populate("reviewedBy", "name")
      .sort({ updatedAt: -1 })
      .limit(50);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getInstitutionRequests = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        { _id: "ir1", institutionName: "Test University", domain: "test.edu", contactEmail: "admin@test.edu", message: "Need counselors.", status: "pending", createdAt: new Date() }
      ]);
    }
    const requests = await InstitutionRequest.find().sort({ createdAt: -1 }).populate("assignedCounselorId", "name email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.fulfillInstitutionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { counselorId } = req.body;

    if (!counselorId) return res.status(400).json({ message: "Counselor ID is required" });

    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: "Request fulfilled (Mock Mode)" });
    }

    const request = await InstitutionRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Update students using email regex
    await User.updateMany(
      { email: { $regex: `@${request.domain}$` }, role: "student" },
      { assignedCounselor: counselorId }
    );

    request.status = "fulfilled";
    request.assignedCounselorId = counselorId;
    await request.save();

    res.json({ message: "Institution request fulfilled and students connected", request });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.assignCounselorToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { counselorId } = req.body; // can be null to unassign

    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: "Counselor assigned to user (Mock Mode)" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.assignedCounselor = counselorId || null;
    await user.save();

    res.json({ message: "Counselor assigned successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
