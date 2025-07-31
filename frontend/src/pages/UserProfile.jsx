import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Briefcase,
  Award,
  ArrowLeft,
  Calendar,
  Star,
} from "lucide-react";
import { showError } from "../utils/toast";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { backendURL, userData } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPackages, setUserPackages] = useState([]);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          backendURL + `/api/user/profile/${userId}`
        );

        if (data.success) {
          setProfile(data.profile);
          // Fetch user's packages if they're a planner
          if (data.profile.role === "planner") {
            fetchUserPackages();
          }
          // Fetch user's reviews
          fetchUserReviews();
        } else {
          showError("Profile not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        showError("Failed to load profile");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserPackages = async () => {
      try {
        const { data } = await axios.get(
          backendURL + `/api/packages?planner=${userId}`
        );
        if (data.success) {
          setUserPackages(data.packages);
        }
      } catch (error) {
        console.error("Error fetching user packages:", error);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const { data } = await axios.get(
          backendURL + `/api/reviews?user=${userId}`
        );
        if (data.success) {
          setUserReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, backendURL, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The user profile you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getFullName = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile.username;
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "planner":
        return "bg-purple-100 text-purple-800";
      case "client":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col items-center space-y-4">
                {/* Profile Picture */}
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                {/* User Info */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {getFullName()}
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(
                      profile.role
                    )}`}
                  >
                    {profile.role.charAt(0).toUpperCase() +
                      profile.role.slice(1)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="w-full space-y-3">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Media Links */}
                {profile.socialMedia &&
                  Object.values(profile.socialMedia).some((link) => link) && (
                    <div className="w-full">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Social Media
                      </h3>
                      <div className="flex justify-center gap-3">
                        {profile.socialMedia.facebook && (
                          <a
                            href={profile.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {profile.socialMedia.twitter && (
                          <a
                            href={profile.socialMedia.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-500"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        {profile.socialMedia.instagram && (
                          <a
                            href={profile.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-700"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {profile.socialMedia.linkedin && (
                          <a
                            href={profile.socialMedia.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-800"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Planner-specific Information */}
            {profile.role === "planner" && (
              <>
                {(profile.specialization || profile.experience) && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Professional Information
                    </h3>
                    <div className="space-y-3">
                      {profile.specialization && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700">
                            <strong>Specialization:</strong>{" "}
                            {profile.specialization}
                          </span>
                        </div>
                      )}
                      {profile.experience && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">
                            <strong>Experience:</strong> {profile.experience}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* User's Packages */}
                {userPackages.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Event Packages
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userPackages.slice(0, 4).map((pkg) => (
                        <Link
                          key={pkg._id}
                          to={`/packages/${pkg._id}`}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition"
                        >
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {pkg.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {pkg.description.substring(0, 100)}...
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-600 font-semibold">
                              KSH {pkg.price}
                            </span>
                            <span className="text-xs text-gray-500">
                              {pkg.category?.name || "Uncategorized"}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {userPackages.length > 4 && (
                      <div className="mt-4 text-center">
                        <Link
                          to={`/packages?planner=${userId}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all packages ({userPackages.length})
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* User's Reviews */}
            {userReviews.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Reviews
                </h3>
                <div className="space-y-4">
                  {userReviews.slice(0, 3).map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      {review.package && (
                        <p className="text-sm text-gray-500 mt-1">
                          For: {review.package.title}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {userReviews.length > 3 && (
                  <div className="mt-4 text-center">
                    <span className="text-gray-600">
                      Showing 3 of {userReviews.length} reviews
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {userData && userData._id !== userId && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.role === "planner" && (
                    <Link
                      to={`/packages?planner=${userId}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      View Packages
                    </Link>
                  )}
                  <button
                    onClick={() =>
                      navigate(`/dashboard/messages?user=${userId}`)
                    }
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
