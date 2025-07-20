import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Loader2,
  BarChart2,
  Users,
  CalendarCheck2,
  Star,
  FolderKanban,
  DollarSign,
} from "lucide-react";

const statCards = [
  {
    key: "totalBookings",
    label: "Total Bookings",
    icon: CalendarCheck2,
    color: "from-blue-400 to-blue-600",
  },
  {
    key: "completedBookings",
    label: "Completed Bookings",
    icon: CalendarCheck2,
    color: "from-green-400 to-green-600",
  },
  {
    key: "totalRevenue",
    label: "Total Revenue (Ksh)",
    icon: DollarSign,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    color: "from-purple-400 to-purple-600",
  },
  {
    key: "clients",
    label: "Clients",
    icon: Users,
    color: "from-pink-400 to-pink-600",
  },
  {
    key: "planners",
    label: "Planners",
    icon: Users,
    color: "from-indigo-400 to-indigo-600",
  },
  {
    key: "admins",
    label: "Admins",
    icon: Users,
    color: "from-gray-400 to-gray-600",
  },
  {
    key: "totalPackages",
    label: "Total Packages",
    icon: FolderKanban,
    color: "from-cyan-400 to-cyan-600",
  },
  {
    key: "totalReviews",
    label: "Total Reviews",
    icon: Star,
    color: "from-yellow-300 to-yellow-500",
  },
];

const Analytics = () => {
  const { backendURL } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${backendURL}/api/analytics/overview`, {
          withCredentials: true,
        });
        setStats(res.data.data);
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [backendURL]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-8 flex items-center gap-3">
        <BarChart2 className="w-8 h-8 text-blue-500" /> Analytics Overview
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center font-semibold">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {statCards.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              className={`bg-gradient-to-br ${color} rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center`}
            >
              <Icon className="w-10 h-10 mb-2 text-white drop-shadow" />
              <div className="text-2xl font-bold text-white mb-1">
                {key === "totalRevenue"
                  ? `Ksh ${stats[key]?.toLocaleString()}`
                  : stats[key]?.toLocaleString?.() ?? 0}
              </div>
              <div className="text-white text-lg font-medium opacity-90">
                {label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;
