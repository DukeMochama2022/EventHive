import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Loader2,
  CalendarCheck2,
  AlertCircle,
  Package,
  Eye,
  CheckCircle2,
  XCircle,
  Check,
  Ban,
} from "lucide-react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { showError, showSuccess } from "../utils/toast";
import ChatWindow from "../components/ChatWindow";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const PlannerBookingsList = () => {
  const { backendURL, userData } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${backendURL}/api/bookings/for-planner`, {
        withCredentials: true,
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError("Failed to load bookings. Please refresh the page.");
      showError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this booking as ${status}?`
      )
    )
      return;
    setActionLoading(true);
    try {
      await axios.patch(
        `${backendURL}/api/bookings/${bookingId}`,
        { status },
        { withCredentials: true }
      );
      showSuccess(`Booking marked as ${status}`);
      fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      showError("Failed to update booking status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <CalendarCheck2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-700">Bookings</h2>
        </div>
        <LoadingSkeleton type="list" lines={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <CalendarCheck2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-700">Bookings</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Bookings
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <CalendarCheck2 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-700">Bookings</h2>
      </div>
      {bookings.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Bookings Found
          </h3>
          <p className="text-gray-500 mb-4">
            No bookings for your packages yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-blue-100"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[booking.status] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(booking.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-blue-800 mb-1">
                  {booking.package?.title || "(Deleted Package)"}
                </h3>
                <div className="text-gray-600 text-sm mb-1">
                  {booking.package?.location} &bull; Ksh{" "}
                  {booking.package?.price}
                </div>
                <div className="text-gray-500 text-xs mb-1">
                  Client: {booking.client?.username || "(Unknown)"}
                </div>
                {booking.message && (
                  <div className="text-gray-500 text-xs mt-2">
                    <span className="font-semibold">Message:</span>{" "}
                    {booking.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium text-sm transition"
                >
                  <Eye className="w-4 h-4" /> Details
                </button>
                <button
                  onClick={() => setChatBooking(booking)}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition"
                >
                  Chat
                </button>
                {booking.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking._id, "accepted")
                      }
                      disabled={actionLoading}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" /> Accept
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking._id, "rejected")
                      }
                      disabled={actionLoading}
                      className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                {booking.status === "accepted" && (
                  <button
                    onClick={() => handleStatusUpdate(booking._id, "completed")}
                    disabled={actionLoading}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                  </button>
                )}
                {booking.status === "accepted" && (
                  <button
                    onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                    disabled={actionLoading}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium text-sm transition disabled:opacity-50"
                  >
                    <Ban className="w-4 h-4" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setSelectedBooking(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Booking Details
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    statusColors[selectedBooking.status]
                  }`}
                >
                  {selectedBooking.status.charAt(0).toUpperCase() +
                    selectedBooking.status.slice(1)}
                </span>
              </div>
              <div>
                <span className="font-semibold">Event Date:</span>{" "}
                {new Date(selectedBooking.date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Package:</span>{" "}
                {selectedBooking.package?.title || "(Deleted Package)"}
              </div>
              <div>
                <span className="font-semibold">Location:</span>{" "}
                {selectedBooking.package?.location}
              </div>
              <div>
                <span className="font-semibold">Price:</span> Ksh{" "}
                {selectedBooking.package?.price}
              </div>
              <div>
                <span className="font-semibold">Client:</span>{" "}
                {selectedBooking.client?.username}
              </div>
              <div>
                <span className="font-semibold">Planner:</span>{" "}
                {selectedBooking.planner?.username}
              </div>
              {selectedBooking.message && (
                <div>
                  <span className="font-semibold">Message:</span>{" "}
                  {selectedBooking.message}
                </div>
              )}
              <div>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(selectedBooking.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              {selectedBooking.status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedBooking._id, "accepted")
                    }
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedBooking._id, "rejected")
                    }
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </>
              )}
              {selectedBooking.status === "accepted" && (
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedBooking._id, "completed")
                  }
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                </button>
              )}
              {selectedBooking.status === "accepted" && (
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedBooking._id, "cancelled")
                  }
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                >
                  <Ban className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {chatBooking && (
        <ChatWindow
          booking={chatBooking}
          onClose={() => setChatBooking(null)}
        />
      )}
    </div>
  );
};

export default PlannerBookingsList;
