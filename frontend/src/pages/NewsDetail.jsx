import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Tag,
  Star,
  Share2,
  Bookmark,
} from "lucide-react";
import { showError } from "../utils/toast";
import LoadingSpinner from "../components/LoadingSpinner";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendURL } = useContext(AuthContext);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendURL}/api/news/${id}`, {
        withCredentials: false
      });

      if (data.success) {
        setArticle(data.data);
        // Fetch related articles based on tags
        if (data.data.tags && data.data.tags.length > 0) {
          fetchRelatedArticles(data.data.tags[0]);
        }
      }
    } catch (error) {
      showError("Failed to fetch article");
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (tag) => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/news?tag=${tag}&limit=3`,
        { withCredentials: false }
      );
      if (data.success) {
        setRelatedArticles(data.data.filter((article) => article._id !== id));
      }
    } catch (error) {
      console.error("Error fetching related articles:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary || article.title,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showError("Link copied to clipboard");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The article you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/news")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/news")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to News
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                <Bookmark className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Article Image */}
          {article.image && (
            <div className="aspect-video overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8">
            {/* Article Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                {article.featured && (
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                )}
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {article.author?.username || "Admin"}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.views} views
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              {article.summary && (
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {article.summary}
                </p>
              )}

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: article.content.replace(/\n/g, "<br>"),
                }}
              />
            </div>

            {/* Article Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Published on {formatDate(article.publishedAt)}</span>
                  <span>by {article.author?.username || "Admin"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>{article.views} views</span>
                  {article.featured && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200 cursor-pointer"
                  onClick={() => navigate(`/news/${relatedArticle._id}`)}
                >
                  {relatedArticle.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h4>
                    {relatedArticle.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedArticle.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(relatedArticle.publishedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
