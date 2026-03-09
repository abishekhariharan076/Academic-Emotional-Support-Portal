const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moodLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      trim: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["open", "reviewed"],
      default: "open",
    },
    counselorNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckIn", checkInSchema);
