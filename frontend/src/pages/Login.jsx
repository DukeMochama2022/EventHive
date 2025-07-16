import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { User, Mail, Lock, Sparkles } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const { backendURL, setIsLoggedIn, getUserData } = useContext(AuthContext);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(backendURL + "/api/auth/register", {
          username: name,
          email,
          password,
          role,
        });
        if (data.success) {
          toast.success(data.message);
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          return toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendURL + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          return toast.error(data.message);
        }
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center px-4">
      {/* Branding Icon */}
      <div
        onClick={() => navigate("/")}
        className="absolute left-5 top-5 sm:left-20 cursor-pointer flex items-center gap-2"
      >
        <Sparkles className="w-10 h-10 text-blue-600" />
        <span className="text-xl font-bold text-blue-700 hidden sm:inline">
          EventHive
        </span>
      </div>

      {/* Login/Signup Box */}
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-700 text-transparent bg-clip-text mb-2">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {state === "Sign Up"
            ? "Create your account below"
            : "Login to your account"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {state === "Sign Up" && (
            <>
              <div className="flex items-center gap-3 w-full px-4 py-2 rounded-full bg-blue-50 border border-blue-100 focus-within:ring-2 focus-within:ring-blue-400">
                <User className="w-5 h-5 text-blue-600" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>
              {/* Role Selector */}
              <div className="flex items-center gap-3 w-full px-4 py-2 rounded-full bg-purple-50 border border-purple-100 focus-within:ring-2 focus-within:ring-purple-400">
                <span className="text-purple-600 font-semibold text-sm">
                  Role:
                </span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none border-none focus:ring-0"
                  required
                >
                  <option value="client">Client</option>
                  <option value="planner">Planner</option>
                </select>
              </div>
            </>
          )}

          <div className="flex items-center gap-3 w-full px-4 py-2 rounded-full bg-purple-50 border border-purple-100 focus-within:ring-2 focus-within:ring-purple-400">
            <Mail className="w-5 h-5 text-purple-600" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full px-4 py-2 rounded-full bg-blue-50 border border-blue-100 focus-within:ring-2 focus-within:ring-blue-400">
            <Lock className="w-5 h-5 text-blue-600" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="text-right text-sm text-indigo-500 hover:text-indigo-400 cursor-pointer transition duration-200"
          >
            Forgot password?
          </p>

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white py-2 font-medium rounded-full w-full hover:from-indigo-600 hover:to-purple-800 transition duration-300 shadow"
          >
            {state}
          </button>

          <p className="text-sm text-gray-600 mt-4">
            {state === "Sign Up"
              ? "Already have an account?"
              : "Don't have Account?"}{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() =>
                setState(state === "Sign Up" ? "Login" : "Sign Up")
              }
            >
              {state === "Sign Up" ? "Login" : "Sign Up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
