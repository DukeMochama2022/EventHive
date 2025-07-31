import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Loader2,
  MapPin,
  Tag,
  DollarSign,
  User,
  CalendarCheck,
  Package,
  Star,
} from "lucide-react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { showError, showInfo } from "../utils/toast";
import ChatWindow from "../components/ChatWindow";

const PackageDetails = () => {
  const { id } = useParams();
  const { backendURL, isLoggedIn, userData } = useContext(AuthContext);
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({ date: "", message: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, comment: "" });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [myBooking, setMyBooking] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchPackage();
    fetchReviews();
    // eslint-disable-next-line
  }, [id]);

  // Fetch user's booking for this package
  useEffect(() => {
    if (!userData || !isLoggedIn) return;
    const fetchMyBooking = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/bookings/my`, {
          withCredentials: true,
        });
        const found = (res.data.bookings || []).find(
          (b) => b.package === id || b.package?._id === id
        );
        setMyBooking(found || null);
      } catch {
        setMyBooking(null);
      }
    };
    fetchMyBooking();
  }, [userData, isLoggedIn, id, backendURL]);

  const fetchPackage = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/packages/${id}`);
      setPkg(res.data.data);
    } catch (err) {
      showError("Failed to load package details");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/reviews/${id}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Check if user can review (client, has booking, not already reviewed)
  useEffect(() => {
    if (!userData || userData.role !== "client") {
      setCanReview(false);
      return;
    }
    // Check if already reviewed
    const alreadyReviewed = reviews.some((r) => r.client?._id === userData.id);
    if (alreadyReviewed) {
      setCanReview(false);
      return;
    }
    // Check if user has a booking for this package
    const checkBooking = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/bookings/my`, {
          withCredentials: true,
        });
        const hasBooking = (res.data.bookings || []).some(
          (b) => b.package === id || b.package?._id === id
        );
        setCanReview(hasBooking);
      } catch {
        setCanReview(false);
      }
    };
    checkBooking();
  }, [userData, id, reviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      showError("Please select a rating between 1 and 5 stars.");
      return;
    }
    setReviewSubmitting(true);
    try {
      await axios.post(
        `${backendURL}/api/reviews`,
        {
          package: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        },
        { withCredentials: true }
      );
      setReviewForm({ rating: 0, comment: "" });
      fetchReviews();
      showInfo("Review submitted!");
    } catch (error) {
      showError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to submit review"
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editForm.rating < 1 || editForm.rating > 5) {
      showError("Please select a rating between 1 and 5 stars.");
      return;
    }
    setEditSubmitting(true);
    try {
      await axios.patch(
        `${backendURL}/api/reviews/${editingReview._id}`,
        {
          rating: editForm.rating,
          comment: editForm.comment,
        },
        { withCredentials: true }
      );
      setEditingReview(null);
      fetchReviews();
      showInfo("Review updated!");
    } catch (error) {
      showError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to update review"
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`${backendURL}/api/reviews/${reviewId}`, {
        withCredentials: true,
      });
      fetchReviews();
      showInfo("Review deleted.");
    } catch (error) {
      showError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete review"
      );
    }
  };

  const openBooking = () => {
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
    setBookingModal(true);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingForm.date) {
      showError("Please select a date for your event.");
      return;
    }
    setBookingLoading(true);
    try {
      const dateStr = bookingForm.date;
      const [year, month, day] = dateStr.split("-");
      const eventDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      await axios.post(
        `${backendURL}/api/bookings/create`,
        {
          package: pkg._id,
          planner: pkg.planner?._id,
          date: eventDate.toISOString(),
          message: bookingForm.message,
        },
        { withCredentials: true }
      );
      setBookingModal(false);
      showInfo("Booking request sent!");
    } catch (error) {
      showError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to book package"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <LoadingSkeleton type="card" />
      </div>
    );
  }
  if (!pkg) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        Package not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 border border-blue-100">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="w-full h-56 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
            {pkg.image ? (
              <img
                src={pkg.image}
                alt={pkg.title}
                className="object-cover w-full h-full rounded-xl"
              />
            ) : (
              <Package className="w-12 h-12 text-blue-300" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-blue-800 mb-2">{pkg.title}</h1>
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
          <button
            onClick={openBooking}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition"
          >
            <CalendarCheck className="w-5 h-5 mr-2 inline" /> Book Now
          </button>
          {myBooking && (
            <button
              onClick={() => setChatOpen(true)}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Chat with Planner
            </button>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-blue-700 mb-2">Description</h2>
          <p className="text-gray-700 mb-4 whitespace-pre-line">
            {pkg.description}
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Planner Details
            </h3>
            <div className="text-gray-700 text-sm">
              <div>
                <span className="font-semibold">Name:</span>{" "}
                {pkg.planner?.username || "-"}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {pkg.planner?.email || "-"}
              </div>
              {pkg.planner?._id && (
                <div className="mt-3">
                  <Link
                    to={`/user/${pkg.planner._id}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    <User className="w-4 h-4" />
                    View Planner Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" /> Reviews & Ratings
            </h3>
            {reviewsLoading ? (
              <LoadingSkeleton type="list" lines={2} />
            ) : reviews.length === 0 ? (
              <div className="text-gray-500 text-sm">No reviews yet.</div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-yellow-600">
                    {(
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)}
                  </span>
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-500 text-sm">
                    ({reviews.length} reviews)
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {reviews.map((r) => {
                    console.log(
                      "Review client:",
                      r.client?._id,
                      "Logged in user:",
                      userData?.id
                    );
                    return (
                      <div
                        key={r._id}
                        className="border-b last:border-b-0 pb-2 mb-2 last:mb-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-700">
                            {r.client?.username || "Client"}
                          </span>
                          {r.client?._id && (
                            <Link
                              to={`/user/${r.client._id}`}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              (View Profile)
                            </Link>
                          )}
                          <span className="text-yellow-600 font-bold">
                            {r.rating}★
                          </span>
                          <span className="text-gray-400 text-xs">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                          {/* Edit/Delete buttons for own review */}
                          {userData?.role === "client" &&
                            r.client?._id?.toString() ===
                              userData._id?.toString() && (
                              <>
                                <button
                                  onClick={() => handleEditReview(r)}
                                  className="ml-2 text-blue-600 hover:underline text-xs"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(r._id)}
                                  className="ml-2 text-red-600 hover:underline text-xs"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                        </div>
                        {r.comment && (
                          <div className="text-gray-700 text-sm mt-1">
                            {r.comment}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {/* Review Form */}
            {canReview && (
              <form
                onSubmit={handleReviewSubmit}
                className="mt-4 border-t pt-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() =>
                        setReviewForm((f) => ({ ...f, rating: star }))
                      }
                      className={
                        star <= reviewForm.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      <Star className="w-6 h-6" />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((f) => ({ ...f, comment: e.target.value }))
                  }
                  className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Write a review (optional)"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin inline" />
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setBookingModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Book: {pkg.title}
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

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setEditingReview(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Edit Review
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setEditForm((f) => ({ ...f, rating: star }))}
                    className={
                      star <= editForm.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    <Star className="w-6 h-6" />
                  </button>
                ))}
              </div>
              <textarea
                value={editForm.comment}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, comment: e.target.value }))
                }
                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Edit your review (optional)"
                rows={3}
              />
              <button
                type="submit"
                disabled={editSubmitting}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                ) : (
                  "Update Review"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {chatOpen && myBooking && (
        <ChatWindow booking={myBooking} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
};

export default PackageDetails;
