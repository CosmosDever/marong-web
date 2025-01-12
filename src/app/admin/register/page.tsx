"use client";

import { useState } from "react";
import axios from "axios";
import Sidebar from "../../component/sidebar";

export default function AdminRegister() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setErrorMessage("โปรดเลือกไฟล์รูปภาพที่ถูกต้อง");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    if (password !== confirmPassword) {
      setErrorMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await axios.post("/auth/register", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(`ทำการเพิ่มบัญชีผู้ใช้สำเร็จ`);
      } else {
        setErrorMessage("การเพิ่มบัญชีเจ้าหน้าที่ไม่สำเร็จ กรุณาลองอีกครั้ง");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.response?.data || "การเพิ่มบัญชีเจ้าหน้าที่ไม่สำเร็จ กรุณาลองอีกครั้ง"
      );
    }
  };

  return (
    <div className="flex bg-blue-100 h-screen text-black">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="text-3xl font-bold mb-6">REGISTER ADMIN</div>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 w-7/10 mx-auto"
          style={{ maxWidth: "70%" }}
          encType="multipart/form-data"
        >
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm mb-4">{successMessage}</div>
          )}

      <div className="mb-4 flex items-start">
        <div className="relative">
          {/* Profile Image Preview */}
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="w-24 h-24 object-cover rounded-full border-2 border-blue-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-blue-500 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full cursor-pointer">
            <input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 010 2.828l-1 1L13 3.414l1-1a2 2 0 012.828 0zm-3 3L5 15v2.5a.5.5 0 00.5.5H8l9.414-9.414-3-3z" />
            </svg>
          </label>
        </div>

        {/* Form Fields */}
        <div className="flex-1 ml-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="full_name"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <select
              name="role"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="Master Admin">Master Admin</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>
      </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`py-2 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
