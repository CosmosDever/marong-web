"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../component/sidebar";
import { uploadImage } from "../../component/imageUpload";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";


export default function AddAdmin() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    gmail: "",
    picture: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    telephone: "",
    gender: "",
    role: "",
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // Redirect หากไม่มี token
    }
  }, []);

  const handleFileChange = async (event: any) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("โปรดเลือกไฟล์รูปภาพที่ถูกต้อง");
        return;
      }

      if (file.size > 5000000) {
        setErrorMessage("ขนาดไฟล์รูปภาพใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดเล็กกว่า 5MB");
        return;
      }

      setImagePreview(URL.createObjectURL(file));

      try {
        setLoading(true);
        const publicURL = await uploadImage(file);
        setFormData({ ...formData, picture: publicURL });
      } catch (error) {
        console.error(error);
        setErrorMessage("ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองอีกครั้ง");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ");
      window.location.href = "/login";
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const requestBody = {
        fullName: formData.fullName,
        gmail: formData.gmail,
        picture: formData.picture,
        password: formData.password,
        birthday: formData.birthday,
        telephone: formData.telephone,
        gender: formData.gender,
        role: formData.role,
      };

      const response = await axios.post(
        "http://localhost:8080/api/admin/add",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status === "success") {
        const { id, full_name, gmail, role } = response.data.data;
        setSuccessMessage(
          `เพิ่มบัญชีสำเร็จ: ID: ${id}, Name: ${full_name}, Email: ${gmail}, Role: ${role}`
        );

        // รีเซ็ตข้อมูลฟอร์ม
        setFormData({
          fullName: "",
          gmail: "",
          picture: "",
          password: "",
          confirmPassword: "",
          birthday: "",
          telephone: "",
          gender: "",
          role: "",
        });
        setImagePreview("");
      } else {
        throw new Error(response?.data?.message || "ไม่สามารถเพิ่มบัญชีได้");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setErrorMessage(err.response?.data?.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
    router.back();
  };


  return (
    <div className="flex bg-blue-100 h-screen text-black">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="text-3xl font-bold mb-6">ADD ADMIN</div>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 w-7/10 mx-auto"
          style={{ maxWidth: "70%" }}
        >
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm mb-4">{successMessage}</div>
          )}

          <div className="mb-4 flex items-start">
            <div className="relative">
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
                  name="picture"
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

            <div className="flex-1 ml-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="gmail"
                  value={formData.gmail}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                   <option value="" disabled>Select Role</option>
                  <option value="master Admin">Master Admin</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Telephone</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div className="text-right space-x-4">
          <button
              type="button"
              onClick={handleCancel}
              className="mt-10 py-2 px-6 text-sm text-white bg-gray-500 hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`py-2 px-6 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Processing..." : "Add Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
