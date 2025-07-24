const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    features: {
      maxBookingsPerMonth: { type: Number, default: 1 },
      maxPackages: { type: Number, default: 2 },
      analytics: { type: Boolean, default: false },
      featuredListing: { type: Boolean, default: false },
      unlimitedMessaging: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
      // Add more features as needed
    },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
