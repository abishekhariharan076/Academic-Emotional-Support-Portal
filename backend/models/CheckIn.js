const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
    domain: {
      type: String,
      required: true,
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attachments: [
      {
        url: String,
        fileType: String,
        originalName: String,
      },
    ],
  },
  { timestamps: true }
);

// Indexes
checkInSchema.index({ createdAt: -1 });
checkInSchema.index({ domain: 1, createdAt: -1 });

module.exports = mongoose.model("CheckIn", checkInSchema);
