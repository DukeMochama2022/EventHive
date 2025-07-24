import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Loader2,
  Search,
  CalendarCheck,
} from "lucide-react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import {
  showInfo,
  showSuccess,
  showError,
  showLoading,
  updateToast,
} from "../utils/toast";

const PublicPackages = () => {
  const { backendURL, isLoggedIn, userData } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });
  const [categories, setCategories] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [bookingModal, setBookingModal] = useState({ open: false, pkg: null });
  const [bookingForm, setBookingForm] = useState({ date: "", message: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 6;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  useEffect(() => {
    fetchPackages();
    fetchCategories();
  }, [backendURL]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/packages`);
      setPackages(res.data.data || []);
    } catch (err) {
      showError("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/category`);
      setCategories(res.data.categories || []);
    } catch {}
  };

  // Filter and search logic
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(search.toLowerCase()) ||
      pkg.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter.category
      ? pkg.category?._id === filter.category
      : true;
    const matchesLocation = filter.location
      ? pkg.location.toLowerCase().includes(filter.location.toLowerCase())
      : true;
    const matchesMinPrice = filter.minPrice
      ? Number(pkg.price) >= Number(filter.minPrice)
      : true;
    const matchesMaxPrice = filter.maxPrice
      ? Number(pkg.price) <= Number(filter.maxPrice)
      : true;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * packagesPerPage,
    currentPage * packagesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Booking logic
  const openBooking = (pkg) => {
    if (!isLoggedIn) {
      showInfo("Please log in as a client or admin to book packages.");
      navigate("/login");
      return;
    }
    if (userData?.role !== "client" && userData?.role !== "admin") {
      showInfo("Only clients or admins can book packages.");
      return;
    }
    setBookingForm({ date: "", message: "" });
    setBookingModal({ open: true, pkg });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingForm.date) {
      showError("Please select a date for your event.");
      return;
    }
    setBookingLoading(true);
    const loadingToast = showLoading("Booking package...");
    try {
      // Convert date string to Date at midnight UTC
      const dateStr = bookingForm.date; // e.g., "2024-06-08"
      const [year, month, day] = dateStr.split("-");
      const eventDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

      await axios.post(
        `${backendURL}/api/bookings/create`,
        {
          package: bookingModal.pkg._id,
          planner: bookingModal.pkg.planner?._id,
          date: eventDate.toISOString(), // Always send as ISO string in UTC
          message: bookingForm.message,
        },
        { withCredentials: true }
      );
      updateToast(loadingToast, "success", "Booking request sent!");
      setBookingModal({ open: false, pkg: null });
    } catch (error) {
      console.log(
        "Booking error:",
        error,
        error.response,
        error.response?.data,
        "Booking planner value:",
        bookingModal.pkg.planner
      );
      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to book package";
      updateToast(loadingToast, "error", backendMsg);
      if (error?.response?.data?.upgradePrompt) {
        setUpgradeMessage(backendMsg);
        setShowUpgradeModal(true);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1
        className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600
       text-transparent bg-clip-text mb-6 text-center"
      >
        Browse Event Packages
      </h1>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-8 items-stretch md:items-end justify-center">
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none w-full md:w-56"
          />
          <Search className="absolute left-2 top-2.5 w-5 h-5 text-blue-400" />
        </div>
        <select
          value={filter.category}
          onChange={(e) =>
            setFilter((f) => ({ ...f, category: e.target.value }))
          }
          className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none w-full md:w-44"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Location"
          value={filter.location}
          onChange={(e) =>
            setFilter((f) => ({ ...f, location: e.target.value }))
          }
          className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none w-full md:w-40"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={filter.minPrice}
          onChange={(e) =>
            setFilter((f) => ({ ...f, minPrice: e.target.value }))
          }
          className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none w-full md:w-28"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filter.maxPrice}
          onChange={(e) =>
            setFilter((f) => ({ ...f, maxPrice: e.target.value }))
          }
          className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none w-full md:w-28"
        />
      </div>
      {/* Packages Grid */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} type="card" />
          ))}
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-center text-gray-500 font-semibold py-16">
          No packages found matching your criteria.
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPackages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white rounded-2xl shadow-lg p-5 flex flex-col h-full border border-blue-100 hover:shadow-xl transition group"
              >
                <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {pkg.image ? (
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="object-cover w-full h-full rounded-xl group-hover:scale-105 transition"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-blue-300" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-blue-800 mb-1 truncate">
                  {pkg.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Tag className="w-4 h-4 text-purple-500" />
                  <span>{pkg.category?.name || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{pkg.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-green-700">
                    Ksh {pkg.price}
                  </span>
                </div>
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => openBooking(pkg)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold text-sm transition"
                  >
                    <CalendarCheck className="w-4 h-4" /> Book
                  </button>
                  <Link
                    to={`/packages/${pkg._id}`}
                    className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-blue-700 px-3 py-2 rounded-lg font-semibold text-sm transition"
                  >
                    More Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center mt-8 gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold border transition ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`px-4 py-2 rounded-lg font-semibold border transition ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold border transition ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </>
      )}

      {/* Booking Modal */}
      {bookingModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setBookingModal({ open: false, pkg: null })}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Book: {bookingModal.pkg.title}
            </h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-blue-700 font-semibold mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) =>
                    setBookingForm((f) => ({ ...f, date: e.target.value }))
                  }
                  required
                  className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1">
                  Message (optional)
                </label>
                <textarea
                  value={bookingForm.message}
                  onChange={(e) =>
                    setBookingForm((f) => ({ ...f, message: e.target.value }))
                  }
                  className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Add any details for the planner..."
                />
              </div>
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Booking...
                  </>
                ) : (
                  <>
                    <CalendarCheck className="w-5 h-5 mr-2" /> Confirm Booking
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Upgrade Prompt Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative text-center">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowUpgradeModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Booking Limit Reached
            </h2>
            <p className="text-gray-700 mb-6">
              {upgradeMessage ||
                "You have reached your plan's booking limit. Please upgrade your plan to book more events."}
            </p>
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition"
              onClick={() => {
                setShowUpgradeModal(false);
                navigate("/pricing");
              }}
            >
              View Pricing Plans
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicPackages;
