const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportRequest", supportRequestSchema);
