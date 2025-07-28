import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const TestEmail = () => {
  const { backendURL } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTestEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${backendURL}/api/auth/test-email`,
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage("✅ Test email sent successfully! Check your inbox.");
      } else {
        setMessage("❌ Failed to send test email: " + response.data.message);
      }
    } catch (error) {
      setMessage(
        "❌ Error: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Test Email Service
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Send a test welcome email to verify the email service is working
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleTestEmail}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Test Email"}
            </button>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md ${
                message.includes("✅")
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-500 text-sm">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestEmail;
