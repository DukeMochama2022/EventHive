import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendURL } = useContext(AuthContext);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${backendURL}/api/messages`, {
          withCredentials: true,
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [backendURL]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        Contact Messages
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : messages.length === 0 ? (
        <div className="text-gray-500">No messages found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-blue-100 rounded-lg">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left text-blue-700">Name</th>
                <th className="px-4 py-2 text-left text-blue-700">Email</th>
                <th className="px-4 py-2 text-left text-blue-700">Message</th>
                <th className="px-4 py-2 text-left text-blue-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="border-t">
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {msg.name}
                  </td>
                  <td className="px-4 py-2 text-blue-700">{msg.email}</td>
                  <td className="px-4 py-2 text-gray-700 max-w-xs break-words">
                    {msg.message}
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages; 