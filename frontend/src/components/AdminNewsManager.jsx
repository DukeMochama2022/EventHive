import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Star,
  Tag,
  Save,
  X,
} from "lucide-react";
import { showSuccess, showError } from "../utils/toast";
import LoadingSpinner from "./LoadingSpinner";

const AdminNewsManager = () => {
  const { backendURL, userData } = useContext(AuthContext);

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    image: "",
    tags: "",
    status: "published",
    featured: false,
  });

  const fetchNews = async () => {
    try {
      setLoading(true);

      if (!backendURL) {
        showError("Backend URL is not configured");
        return;
      }

      if (!userData) {
        showError("Please log in to access this feature");
        return;
      }

      if (userData.role !== "admin") {
        showError("You need admin privileges to manage news");
        return;
      }

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      params.append("page", currentPage);
      params.append("limit", 10);

      const { data } = await axios.get(
        `${backendURL}/api/news/admin/all?${params}`,
        { withCredentials: true }
      );

      if (data.success) {
        setNews(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        showError("Access denied. You need admin privileges to manage news.");
      } else if (error.response?.status === 401) {
        showError("Please log in to access this feature.");
      } else {
        showError("Failed to fetch news");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if user is admin
    if (userData && userData.role === "admin") {
      fetchNews();
    }
  }, [currentPage, search, statusFilter, userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Handle tags processing
      let processedTags = [];
      if (formData.tags) {
        if (typeof formData.tags === "string") {
          processedTags = formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        } else if (Array.isArray(formData.tags)) {
          processedTags = formData.tags
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        }
      }

      const submitData = {
        ...formData,
        tags: processedTags,
      };

      if (editingNews) {
        const { data } = await axios.put(
          `${backendURL}/api/news/${editingNews._id}`,
          submitData,
          { withCredentials: true }
        );
        if (data.success) {
          showSuccess("News updated successfully");
          setShowForm(false);
          setEditingNews(null);
          resetForm();
          fetchNews();
        }
      } else {
        const { data } = await axios.post(
          `${backendURL}/api/news`,
          submitData,
          {
            withCredentials: true,
          }
        );
        if (data.success) {
          showSuccess("News created successfully");
          setShowForm(false);
          resetForm();
          fetchNews();
        }
      }
    } catch (error) {
      showError(error.response?.data?.message || "Failed to save news");
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      summary: newsItem.summary || "",
      image: newsItem.image || "",
      tags: newsItem.tags ? newsItem.tags.join(", ") : "",
      status: newsItem.status,
      featured: newsItem.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) {
      return;
    }

    try {
      const { data } = await axios.delete(`${backendURL}/api/news/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        showSuccess("News deleted successfully");
        fetchNews();
      }
    } catch (error) {
      showError("Failed to delete news");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      summary: "",
      image: "",
      tags: "",
      status: "published",
      featured: false,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if user data is still loading
  if (userData === false) {
    return <LoadingSpinner />;
  }

  // Check if user is admin
  if (!userData || userData.role !== "admin") {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          {!userData
            ? "Please log in to access this feature."
            : `You need admin privileges to manage news articles. Current role: ${userData.role}`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          News Management
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingNews(null);
            resetForm();
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add News
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* News Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingNews ? "Edit News" : "Add News"}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingNews(null);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="Brief summary of the article..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={8}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="Write your article content here..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured Article
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 sm:py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                {editingNews ? "Update News" : "Create News"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingNews(null);
                  resetForm();
                }}
                className="px-6 py-3 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* News List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((article) => (
                <tr key={article._id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-start sm:items-center">
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover mr-3 sm:mr-4 flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {article.title}
                          </h4>
                          {article.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                        </div>
                        {article.summary && (
                          <p className="text-sm text-gray-500 line-clamp-1 mb-1">
                            {article.summary}
                          </p>
                        )}
                        <div className="flex flex-col sm:hidden text-xs text-gray-500 gap-1">
                          <span>by {article.author?.username || "Admin"}</span>
                          <span>{formatDate(article.publishedAt)}</span>
                          <span>{article.views} views</span>
                        </div>
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {article.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                              >
                                <Tag className="w-3 h-3" />
                                <span className="hidden sm:inline">{tag}</span>
                                <span className="sm:hidden">
                                  {tag.length > 6
                                    ? tag.substring(0, 6) + "..."
                                    : tag}
                                </span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        article.status
                      )}`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-900">
                    {article.author?.username || "Admin"}
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-500">
                    {formatDate(article.publishedAt)}
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-500">
                    {article.views}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page{" "}
                  <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsManager;
