const mongoose = require("mongoose");

const eventPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL or file path
    },

    planner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const EventPackage = mongoose.model("EventPackage", eventPackageSchema);
module.exports = EventPackage;
