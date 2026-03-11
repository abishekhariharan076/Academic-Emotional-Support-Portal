const mongoose = require("mongoose");
const SupportRequest = require("../models/SupportRequest");

// Student creates request
exports.createSupportRequest = async (req, res) => {
  try {
    const { subject, message, anonymous } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK SUPPORT CREATE (DB disconnected)");
      return res.json({
        _id: "mock_s" + Date.now(),
        studentId: req.user.id,
        subject,
        message,
        anonymous: !!anonymous,
        status: "pending",
        createdAt: new Date(),
      });
    }

    const doc = await SupportRequest.create({
      studentId: req.user.id,
      subject,
      message,
      anonymous: !!anonymous,
      status: "pending",
    });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Student fetches own requests
exports.getMySupportRequests = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK MY SUPPORT (DB disconnected)");
      return res.json([
        { _id: "s_me", studentId: req.user.id, subject: "Question about mood trends", message: "Why is it flat?", status: "pending", createdAt: new Date() },
      ]);
    }
    const list = await SupportRequest.find({ studentId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Counselor fetches all requests
exports.getAllSupportRequests = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Proceeding with MOCK ALL SUPPORT (DB disconnected)");
      return res.json([
        { _id: "s1", studentId: { name: "Alice Student", email: "alice@test.com" }, subject: "Stressed about projects", message: "Hard to focus.", status: "pending", anonymous: false, createdAt: new Date() },
        { _id: "s2", studentId: null, subject: "Personal Issue", message: "Need someone to talk to.", status: "pending", anonymous: true, createdAt: new Date() },
      ]);
    }
    const domain = req.user.email.split("@")[1];
    const list = await SupportRequest.find()
      .populate({
        path: "studentId",
        select: "name email",
        match: { email: { $regex: `@${domain}$` } }
      })
      .sort({ createdAt: -1 });

    // Filter out requests where studentId is null (not from this domain or deleted)
    const filteredList = list.filter(r => r.studentId !== null);

    const sanitizedList = filteredList.map(req => {
      const entry = req.toObject();
      if (entry.anonymous) {
        entry.studentId = { name: "Anonymous Student", email: "hidden@aesp.org" };
      }
      return entry;
    });

    res.json(sanitizedList);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Counselor responds
exports.respondToSupportRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { counselorReply } = req.body;

    if (mongoose.connection.readyState !== 1) {
      console.log(`Proceeding with MOCK SUPPORT RESPOND for ${id} (DB disconnected)`);
      return res.json({
        _id: id,
        status: "responded",
        counselorId: req.user.id,
        counselorReply: (counselorReply || "").trim(),
        respondedAt: new Date(),
        message: "Response saved in Mock Mode"
      });
    }

    const doc = await SupportRequest.findById(id);
    if (!doc) return res.status(404).json({ message: "Support request not found" });

    doc.status = "responded";
    doc.counselorId = req.user.id;
    doc.counselorReply = (counselorReply || "").trim();
    doc.respondedAt = new Date();

    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete request
exports.deleteSupportRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      console.log(`Proceeding with MOCK DELETE SUPPORT for ${id} (DB disconnected)`);
      return res.json({ message: "Request deleted successfully (Mock Mode)" });
    }

    const request = await SupportRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check ownership
    if (req.user.role === "student" && request.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await request.deleteOne();
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
