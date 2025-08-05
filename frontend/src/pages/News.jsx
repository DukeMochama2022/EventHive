import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Search,
  Calendar,
  User,
  Eye,
  Tag,
  Star,
  ArrowLeft,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import { showError } from "../utils/toast";
import LoadingSpinner from "../components/LoadingSpinner";

const News = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { backendURL } = useContext(AuthContext);

  console.log("Backend URL:", backendURL);

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [tag, setTag] = useState(searchParams.get("tag") || "");
  const [featured, setFeatured] = useState(
    searchParams.get("featured") === "true"
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchNews = async () => {
    try {
      setLoading(true);

      if (!backendURL) {
        console.error("Backend URL is undefined");
        showError("Backend URL is not configured");
        return;
      }

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (tag) params.append("tag", tag);
      if (featured) params.append("featured", "true");
      params.append("page", currentPage);
      params.append("limit", 10);

      console.log("Fetching news from:", `${backendURL}/api/news?${params}`);

      const { data } = await axios.get(`${backendURL}/api/news?${params}`, {
        withCredentials: false,
      });

      console.log("News response:", data);

      if (data.success) {
        setNews(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      console.error("Error response:", error.response);
      showError("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("News component mounted, backendURL:", backendURL);
    fetchNews();
  }, [currentPage, search, tag, featured, backendURL]);

  useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    if (featured) params.set("featured", "true");
    if (currentPage > 1) params.set("page", currentPage);
    setSearchParams(params);
  }, [search, tag, featured, currentPage, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setTag("");
    setFeatured(false);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Latest News
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Stay updated with the latest events and announcements
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 text-sm sm:text-base w-full sm:w-auto"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <input
                  type="text"
                  placeholder="Filter by tag..."
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base flex-1"
                />
                <label className="flex items-center gap-2 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-base">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="hidden sm:inline">Featured</span>
                </label>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-3 sm:py-2 text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-base"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <p className="text-gray-600 text-sm sm:text-base">
            Showing {news.length} of {totalItems} articles
          </p>
          {totalPages > 1 && (
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No news found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base px-4">
              Try adjusting your search criteria or check back later for new
              articles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {news.map((article) => (
              <div
                key={article._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200 cursor-pointer"
                onClick={() => navigate(`/news/${article._id}`)}
              >
                {article.image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {article.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  {article.summary && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="hidden sm:inline">
                        {article.author?.username || "Admin"}
                      </span>
                      <span className="sm:hidden">
                        {article.author?.username?.split(" ")[0] || "Admin"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views} views
                    </div>
                  </div>

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          <span className="hidden sm:inline">{tag}</span>
                          <span className="sm:hidden">
                            {tag.length > 8 ? tag.substring(0, 8) + "..." : tag}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
