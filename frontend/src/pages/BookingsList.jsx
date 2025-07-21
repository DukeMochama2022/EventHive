import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Loader2, CalendarCheck2, AlertCircle, Package } from "lucide-react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { showError } from "../utils/toast";
import ChatWindow from "../components/ChatWindow";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const BookingsList = () => {
  const { backendURL } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatBooking, setChatBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${backendURL}/api/bookings/my`, {
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <CalendarCheck2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-700">My Bookings</h2>
        </div>
        <LoadingSkeleton type="list" lines={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <CalendarCheck2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-700">My Bookings</h2>
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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <CalendarCheck2 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-700">My Bookings</h2>
      </div>
      {bookings.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Bookings Found
          </h3>
          <p className="text-gray-500 mb-4">
            You haven't made any bookings yet.
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
                  Planner: {booking.planner?.username || "(Unknown)"}
                </div>
                {booking.message && (
                  <div className="text-gray-500 text-xs mt-2">
                    <span className="font-semibold">Message:</span>{" "}
                    {booking.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                {booking.status === "pending" ||
                booking.status === "accepted" ? (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                ) : null}
                <button
                  onClick={() => setChatBooking(booking)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
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

  // Cancel booking handler
  async function handleCancel(bookingId) {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      setLoading(true);
      await axios.patch(
        `${backendURL}/api/bookings/${bookingId}`,
        { status: "cancelled" },
        { withCredentials: true }
      );
      fetchBookings();
    } catch (err) {
      showError("Failed to cancel booking");
      setLoading(false);
    }
  }
};

export default BookingsList;
