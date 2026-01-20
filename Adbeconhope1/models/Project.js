const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant", // for multitenancy
      required: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
    },
    featureImage: {
      type: String, // main project image URL
    },
    description: {
      type: String, // project summary
    },
    sections: [
      {
        heading: { type: String },
        content: { type: String },
        listItems: [String],
      },
    ],
    images: [String ],
    donationsInfo: {
      accountDetails: { type: String },
      donateUrl: { type: String },
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "latest"],
      default: "ongoing",
    },
    goal: {
      type: Number,
      default: 0,
    },
    raised: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
