import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MyProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updatePassword(form));
    if (result.error) {
      toast.error(
        result.payload.extraDetails ||
          result.payload.error ||
          result.payload.message ||
          "Reset Password failed, please try again."
      );
    } else if (result.payload) {
      toast.success(result.payload.message || "Password updated successfully!");
      setForm({ currentPassword: "", newPassword: "" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-80 md:w-96">
        <h2 className="text-2xl font-bold text-center mb-4">My Profile</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            value={user?.username || ""}
            readOnly
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-all hover:bg-blue-700"
            >
              Reset Password
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg transition-all hover:bg-gray-500"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
