import React, { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import {
  showSuccess,
  showError,
  showLoading,
  updateToast,
  successMessages,
  errorMessages,
} from "../utils/toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { backendURL } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("request"); // "request" or "reset"

  // Check if we have a token in URL params
  const token = searchParams.get("token");

  React.useEffect(() => {
    if (token) {
      setStep("reset");
    }
  }, [token]);

  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!email) {
      showError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    const loadingToast = showLoading("Sending password reset email...");

    try {
      const { data } = await axios.post(
        backendURL + "/api/auth/request-password-reset",
        { email }
      );

      if (data.success) {
        updateToast(loadingToast, "success", data.message);
        setStep("request-sent");
      } else {
        updateToast(
          loadingToast,
          "error",
          data.message || errorMessages.serverError
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        errorMessages.serverError;
      updateToast(loadingToast, "error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!newPassword || !confirmPassword) {
      showError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    const loadingToast = showLoading("Resetting password...");

    try {
      const { data } = await axios.post(
        backendURL + "/api/auth/reset-password",
        {
          token,
          newPassword,
        }
      );

      if (data.success) {
        updateToast(loadingToast, "success", data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        updateToast(
          loadingToast,
          "error",
          data.message || errorMessages.serverError
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        errorMessages.serverError;
      updateToast(loadingToast, "error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <button
          onClick={handleBackToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {step === "request" || step === "request-sent"
                ? "Reset Password"
                : "Set New Password"}
            </h1>
            <p className="text-gray-600">
              {step === "request"
                ? "Enter your email to receive a password reset link"
                : step === "request-sent"
                ? "Check your email for the reset link"
                : "Enter your new password"}
            </p>
          </div>

          {step === "request" && (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="flex items-center gap-3 w-full px-4 py-2 rounded-full bg-purple-50 border border-purple-100 focus-within:ring-2 focus-within:ring-purple-400">
                <Mail className="w-5 h-5 text-purple-600" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white py-3 font-medium rounded-full w-full hover:from-indigo-600 hover:to-purple-800 transition duration-300 shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          {step === "request-sent" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Check Your Email
                </h3>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>
              <button
                onClick={() => setStep("request")}
                className="text-indigo-500 hover:text-indigo-400 text-sm"
              >
                Didn't receive it? Try again
              </button>
            </div>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="flex items-center gap-3 w-full px-4 py-2 rounded-full bg-blue-50 border border-blue-100 focus-within:ring-2 focus-within:ring-blue-400">
                <Lock className="w-5 h-5 text-blue-600" />
                <input
                  type="password"
                  placeholder="New password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center gap-3 w-full px-4 py-2 rounded-full bg-blue-50 border border-blue-100 focus-within:ring-2 focus-within:ring-blue-400">
                <Lock className="w-5 h-5 text-blue-600" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white py-3 font-medium rounded-full w-full hover:from-indigo-600 hover:to-purple-800 transition duration-300 shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
