const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Plan = require("./models/Plan");

dotenv.config();

const plans = [
  {
    name: "Free",
    price: 0,
    features: {
      maxBookingsPerMonth: 1,
      maxPackages: 3,
      analytics: false,
      featuredListing: false,
      unlimitedMessaging: false,
      prioritySupport: false,
    },
    description: "Try EventHive for free with basic features.",
  },
  {
    name: "Basic",
    price: 10,
    features: {
      maxBookingsPerMonth: 3,
      maxPackages: 10,
      analytics: false,
      featuredListing: false,
      unlimitedMessaging: false,
      prioritySupport: false,
    },
    description: "For individuals and small events.",
  },
  {
    name: "Pro",
    price: 25,
    features: {
      maxBookingsPerMonth: 10,
      maxPackages: 15,
      analytics: true,
      featuredListing: true,
      unlimitedMessaging: true,
      prioritySupport: false,
    },
    description: "For professionals and growing planners.",
  },
  {
    name: "Enterprise",
    price: 50,
    features: {
      maxBookingsPerMonth: 9999,
      maxPackages: 9999,
      analytics: true,
      featuredListing: true,
      unlimitedMessaging: true,
      prioritySupport: true,
    },
    description: "For agencies and large organizations.",
  },
];

async function seedPlans() {
  for (const plan of plans) {
    const exists = await Plan.findOne({ name: plan.name });
    if (!exists) {
      await Plan.create(plan);
      console.log(`Seeded plan: ${plan.name}`);
    } else {
      console.log(`Plan already exists: ${plan.name}`);
    }
  }
}

module.exports = seedPlans;
