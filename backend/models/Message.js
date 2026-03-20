const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    supportRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportRequest",
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    domain: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
