import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import ReactDOM from "react-dom";

export default function Contact() {
  const { userData, isLoggedIn, backendURL } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Prefill name/email if logged in
  useEffect(() => {
    if (isLoggedIn && userData) {
      setForm((f) => ({
        ...f,
        name: userData.username || "",
        email: userData.email || "",
      }));
    }
  }, [isLoggedIn, userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/messages`, form, {
        withCredentials: true,
      });
      setStatus({
        type: "success",
        msg: "Message sent! We'll get back to you soon.",
      });
      setForm((f) => ({ ...f, message: "" }));
      setShowModal(true);
    } catch (err) {
      setStatus({
        type: "error",
        msg: err?.response?.data?.error || "Failed to send message.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-500 to-purple-700 text-transparent bg-clip-text">
        Contact Us
      </h1>
      <p className="text-center text-gray-700 mb-8">
        We'd love to hear from you! Reach out using the details below or send us
        a message directly.
      </p>
      <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-blue-100">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="text-gray-800 font-medium">
              support@eventhive.com
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-600" />
            <span className="text-gray-800 font-medium">+254 112 197 987</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-600" />
            <span className="text-gray-800 font-medium">+254 290 000 000</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-purple-600" />
            <span className="text-gray-800 font-medium">Nairobi, Kenya</span>
          </div>
        </div>
      </div>
      {!isLoggedIn ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-8 text-center font-semibold">
          Please{" "}
          <a href="/login" className="underline text-blue-700">
            log in
          </a>{" "}
          to send us a message.
        </div>
      ) : null}
      {isLoggedIn && userData?.role === "admin" && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-8 text-center font-semibold">
          Admins are not allowed to send messages via this form.
        </div>
      )}
      <form
        className="bg-white rounded-2xl shadow p-6 border border-purple-100 space-y-4"
        onSubmit={(e) => {
          if (userData?.role === "admin") {
            setShowAdminModal(true);
            e.preventDefault();
            return;
          }
          handleSubmit(e);
        }}
      >
        <h2 className="text-xl font-bold text-purple-700 mb-2">
          Send us a message
        </h2>
        {status && (
          <div
            className={`mb-2 p-2 rounded text-sm ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.msg}
          </div>
        )}
        <div>
          <label className="block text-blue-700 font-semibold mb-1">Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Your Name"
            required
          />
        </div>
        <div>
          <label className="block text-blue-700 font-semibold mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="you@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-blue-700 font-semibold mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Type your message..."
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !isLoggedIn || userData?.role === "admin"}
          className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-indigo-600 hover:to-purple-800 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" /> {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {showModal &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative">
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                Message Sent!
              </h2>
              <p className="text-gray-700 mb-6">
                Thank you for reaching out. We'll get back to you soon.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-indigo-600 hover:to-purple-800 transition"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
      {showAdminModal &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative">
              <h2 className="text-2xl font-bold text-red-700 mb-4">
                Not Allowed
              </h2>
              <p className="text-gray-700 mb-6">
                Admins are not allowed to send messages via this form.
              </p>
              <button
                onClick={() => setShowAdminModal(false)}
                className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-indigo-600 hover:to-purple-800 transition"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
