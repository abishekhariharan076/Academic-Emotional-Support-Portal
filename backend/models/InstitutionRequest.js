const mongoose = require("mongoose");

const institutionRequestSchema = new mongoose.Schema(
  {
    institutionName: { type: String, required: true, trim: true },
    domain: { type: String, required: true, lowercase: true, trim: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "rejected"],
      default: "pending",
    },
    assignedCounselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InstitutionRequest", institutionRequestSchema);
