const SupportRequest = require("../models/SupportRequest");

// Student creates request
exports.createSupportRequest = async (req, res) => {
  try {
    const { subject, message, anonymous } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
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
    const list = await SupportRequest.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Counselor responds
exports.respondToSupportRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { counselorReply } = req.body;

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
