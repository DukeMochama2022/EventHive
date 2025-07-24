import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminUserManager = () => {
  const { backendURL } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendURL}/api/user`, {
        withCredentials: true,
      });
      setUsers(res.data.users || []);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This will also delete all their packages, bookings, and reviews."
      )
    )
      return;
    setDeletingId(id);
    try {
      await axios.delete(`${backendURL}/api/user/${id}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Manage Users</h1>
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <label className="font-semibold text-gray-700">Filter by role:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="client">Client</option>
          <option value="planner">Planner</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-blue-100 rounded-lg">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left text-blue-700">Username</th>
                <th className="px-4 py-2 text-left text-blue-700">Email</th>
                <th className="px-4 py-2 text-left text-blue-700">Role</th>
                <th className="px-4 py-2 text-left text-blue-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {user.username}
                  </td>
                  <td className="px-4 py-2 text-blue-700">{user.email}</td>
                  <td className="px-4 py-2 text-gray-700 capitalize">
                    {user.role}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deletingId === user._id}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded shadow disabled:opacity-50"
                    >
                      {deletingId === user._id ? "Deleting..." : "Delete"}
                    </button>
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

export default AdminUserManager;
