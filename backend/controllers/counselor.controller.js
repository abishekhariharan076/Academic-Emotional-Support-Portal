const CheckIn = require("../models/CheckIn");

exports.getAllCheckIns = async (req, res) => {
  try {
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
