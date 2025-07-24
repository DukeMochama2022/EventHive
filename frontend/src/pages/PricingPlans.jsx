import React, { useContext, useEffect, useState } from "react";
import { CheckCircle, Star } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { showSuccess, showError } from "../utils/toast";

const planColors = {
  Free: {
    bg: "from-gray-100 to-gray-200",
    border: "border-gray-300",
    text: "text-gray-800",
    icon: "text-gray-500",
    button: "bg-gray-400 hover:bg-gray-500",
    badge: "bg-gray-500",
  },
  Basic: {
    bg: "from-blue-100 to-blue-300",
    border: "border-blue-400",
    text: "text-blue-800",
    icon: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    badge: "bg-blue-600",
  },
  Pro: {
    bg: "from-purple-100 to-purple-300",
    border: "border-purple-400",
    text: "text-purple-800",
    icon: "text-purple-600",
    button: "bg-purple-700 hover:bg-purple-800",
    badge: "bg-purple-700",
  },
  Enterprise: {
    bg: "from-indigo-100 to-indigo-300",
    border: "border-indigo-400",
    text: "text-indigo-800",
    icon: "text-indigo-600",
    button: "bg-indigo-700 hover:bg-indigo-800",
    badge: "bg-indigo-700",
  },
};

export default function PricingPlans() {
  const { backendURL, userData, getUserData } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changingPlan, setChangingPlan] = useState("");

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line
  }, [backendURL]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/plans`);
      setPlans(res.data.plans || []);
    } catch (err) {
      showError("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePlan = async (planId) => {
    if (!userData) {
      showError("Please log in to change your plan.");
      return;
    }
    if (userData.plan === planId || userData.plan?._id === planId) {
      showError("You are already on this plan.");
      return;
    }
    setChangingPlan(planId);
    try {
      await axios.patch(
        `${backendURL}/api/user/plan`,
        { planId },
        { withCredentials: true }
      );
      showSuccess("Plan updated successfully!");
      getUserData();
    } catch (err) {
      showError(
        err?.response?.data?.message || err?.message || "Failed to update plan"
      );
    } finally {
      setChangingPlan("");
    }
  };

  const getCurrentPlan = () => {
    if (!userData) return null;
    if (typeof userData.plan === "object" && userData.plan !== null)
      return userData.plan;
    if (typeof userData.plan === "string")
      return plans.find((p) => p._id === userData.plan);
    return null;
  };

  const getCurrentPlanId = () => {
    if (!userData) return null;
    if (typeof userData.plan === "string") return userData.plan;
    if (userData.plan?._id) return userData.plan._id;
    return null;
  };

  const currentPlanId = getCurrentPlanId();
  const currentPlan = getCurrentPlan();

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

      {/* Current Plan Summary */}
      {userData && currentPlan && (
        <div className={`mb-10 flex flex-col items-center justify-center`}>
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg border-2 ${
              planColors[currentPlan.name]?.border || "border-green-500"
            } bg-gradient-to-br ${
              planColors[currentPlan.name]?.bg || "from-green-100 to-green-200"
            }`}
          >
            <Star
              className={`w-6 h-6 ${
                planColors[currentPlan.name]?.icon || "text-green-600"
              }`}
            />
            <span
              className={`text-lg font-bold ${
                planColors[currentPlan.name]?.text || "text-green-800"
              }`}
            >
              You are currently on the{" "}
              <span className="underline">{currentPlan.name}</span> plan
            </span>
            <span
              className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
                planColors[currentPlan.name]?.badge || "bg-green-500"
              } text-white`}
            >
              Current Plan
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-lg text-gray-500">
          Loading plans...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const isCurrent = currentPlanId === plan._id;
            const color = planColors[plan.name] || planColors["Free"];
            return (
              <div
                key={plan._id}
                className={`relative bg-gradient-to-br ${
                  color.bg
                } rounded-2xl shadow-lg p-8 flex flex-col items-center border-4 transition-all duration-200 overflow-visible ${
                  isCurrent
                    ? `${color.border} scale-105 ring-4 ring-green-300 mt-8` // add top margin for badge
                    : "border-transparent hover:scale-105 hover:shadow-2xl"
                }`}
                style={{ minHeight: "340px" }}
              >
                {/* Plan Badge Above Card - Responsive */}
                {isCurrent && (
                  <div
                    className="absolute left-1/2 flex justify-center w-full"
                    style={{ top: "-2.5rem" }}
                  >
                    <span
                      className={`px-5 py-2 rounded-full text-base font-bold shadow-xl ${color.badge} text-white border-2 border-white drop-shadow-lg whitespace-nowrap`}
                    >
                      Current Plan
                    </span>
                  </div>
                )}
                <h2 className={`text-2xl font-extrabold mb-2 ${color.text}`}>
                  {plan.name}
                </h2>
                <div className={`text-3xl font-bold mb-4 ${color.text}`}>
                  {plan.price === 0 ? "$0/mo" : `$${plan.price}/mo`}
                </div>
                <ul
                  className={`${color.text.replace(
                    "800",
                    "900"
                  )} text-sm mb-6 space-y-2`}
                >
                  {plan.features &&
                    Object.entries(plan.features).map(([key, value]) =>
                      value ? (
                        <li key={key} className="flex items-center gap-2">
                          <CheckCircle
                            className={`inline w-5 h-5 ${color.icon}`}
                          />
                          {typeof value === "boolean"
                            ? key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())
                            : `${key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) =>
                                  str.toUpperCase()
                                )}: ${value}`}
                        </li>
                      ) : null
                    )}
                </ul>
                <button
                  className={`font-semibold px-6 py-2 rounded-lg shadow transition text-white w-full ${
                    isCurrent ? "bg-green-400 cursor-not-allowed" : color.button
                  }`}
                  disabled={isCurrent || changingPlan === plan._id}
                  onClick={() => handleChoosePlan(plan._id)}
                >
                  {isCurrent
                    ? "Current Plan"
                    : changingPlan === plan._id
                    ? "Updating..."
                    : `Choose ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
