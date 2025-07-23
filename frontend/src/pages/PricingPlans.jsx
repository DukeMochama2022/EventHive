import React from "react";
import { CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0/mo",
    color: {
      bg: "from-gray-100 to-gray-200",
      border: "border-gray-300",
      text: "text-gray-800",
      icon: "text-gray-500",
      button: "bg-gray-400 hover:bg-gray-500",
      badge: "bg-gray-500",
    },
    features: [
      "Up to 1 event booking/month",
      "Community support",
      "Basic listing for planners",
      "Limited messaging",
    ],
    badge: "Starter",
  },
  {
    name: "Basic",
    price: "$10/mo",
    color: {
      bg: "from-blue-100 to-blue-300",
      border: "border-blue-400",
      text: "text-blue-800",
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    features: [
      "Up to 3 event bookings/month",
      "Email support",
      "Basic analytics",
      "Standard listing for planners",
      "Limited messaging",
    ],
  },
  {
    name: "Pro",
    price: "$25/mo",
    mostPopular: true,
    color: {
      bg: "from-purple-100 to-purple-300",
      border: "border-purple-400",
      text: "text-purple-800",
      icon: "text-purple-600",
      button: "bg-purple-700 hover:bg-purple-800",
      badge: "bg-purple-700",
    },
    features: [
      "Up to 10 event bookings/month",
      "Standard customer support",
      "Basic analytics dashboard",
      "Standard listing for planners",
      "Unlimited messaging",
    ],
  },
  {
    name: "Enterprise",
    price: "$50/mo",
    color: {
      bg: "from-indigo-100 to-indigo-300",
      border: "border-indigo-400",
      text: "text-indigo-800",
      icon: "text-indigo-600",
      button: "bg-indigo-700 hover:bg-indigo-800",
    },
    features: [
      "Unlimited event bookings",
      "Priority customer support",
      "Advanced analytics dashboard",
      "Featured listing for planners",
      "Unlimited messaging",
    ],
  },
];

export default function PricingPlans() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-indigo-500 to-purple-700 text-transparent bg-clip-text">
        Pricing Plans
      </h1>
      <p className="text-center text-gray-700 mb-10 max-w-2xl mx-auto">
        Choose the plan that fits your needs. All plans come with access to our
        event management platform, secure messaging, and planner listings.
        Upgrade anytime as your needs grow!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`relative bg-gradient-to-br ${plan.color.bg} rounded-2xl shadow-lg p-8 flex flex-col items-center border-4 ${plan.color.border}`}
          >
            {(plan.mostPopular || plan.badge) && (
              <span
                className={`absolute -top-5 left-1/2 -translate-x-1/2 ${
                  plan.mostPopular ? plan.color.badge : "bg-gray-500"
                } text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg`}
              >
                {plan.mostPopular ? "Most Popular" : plan.badge}
              </span>
            )}
            <h2 className={`text-2xl font-extrabold mb-2 ${plan.color.text}`}>
              {plan.name}
            </h2>
            <div className={`text-3xl font-bold mb-4 ${plan.color.text}`}>
              {plan.price}
            </div>
            <ul
              className={`${plan.color.text.replace(
                "800",
                "900"
              )} text-sm mb-6 space-y-2`}
            >
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckCircle
                    className={`inline w-5 h-5 ${plan.color.icon}`}
                  />{" "}
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`font-semibold px-6 py-2 rounded-lg shadow transition text-white ${plan.color.button}`}
            >{`Choose ${plan.name}`}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
