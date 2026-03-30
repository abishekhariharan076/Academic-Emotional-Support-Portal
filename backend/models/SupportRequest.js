const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },

    message: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1500,
    },

    anonymous: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "responded"],
      default: "pending",
    },

    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    counselorReply: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1500,
    },

    respondedAt: {
      type: Date,
      default: null,
    },
    domain: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Indexes
supportRequestSchema.index({ createdAt: -1 });
supportRequestSchema.index({ domain: 1, createdAt: -1 });

module.exports = mongoose.model("SupportRequest", supportRequestSchema);
