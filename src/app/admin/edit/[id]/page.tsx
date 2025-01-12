"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../component/Sidebar";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import admin from "../../../assets/admin.png";

const mockupUser = [
  { id: 1, ID: "admin", Full_name: "macus", role: "Master Admin", picture: admin },
  { id: 2, ID: "admin2", Full_name: "boss", role: "Admin", picture: admin },
  { id: 3, ID: "admin3", Full_name: "adam", role: "Admin", picture: admin },
  { id: 4, ID: "admin4", Full_name: "eva", role: "Admin", picture: admin },
  { id: 5, ID: "admin5", Full_name: "john", role: "Admin", picture: admin },
];

export default function AdminProfile() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params?.id);

  const user = mockupUser.find((user) => user.id === userId);

  const [formData, setFormData] = useState({
    fullName: user?.Full_name || "",
    id: user?.ID || "",
    password: "",
    confirmPassword: "",
    role: user?.role || "",
    picture: user?.picture || null as string | StaticImageData | File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | StaticImageData | null>(user?.picture || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string | null);
      reader.readAsDataURL(file);
      setFormData({ ...formData, picture: file });
    }
  };

  const handleSave = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", formData.id);
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      if (formData.picture instanceof File) {
        formDataToSend.append("picture", formData.picture);
      }

      const response = await fetch(`/api/admin/update`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to update admin profile.");
      }

      const data = await response.json();
      console.log("Success:", data);
      router.push(`/admin/adminprofile/${userId}`);
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/adminprofile/${userId}`);
  };

  if (!user) {
    return (
      <div className="flex bg-blue-100 h-screen text-black">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-xl font-bold">
          <p>User not found!</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-blue-100 h-screen text-black">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="text-3xl font-bold mb-6">EDIT PROFILE</div>
        <div className="flex justify-center items-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-[90%] h-[90%] flex-col">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 mr-6 relative">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Admin"
                    width={120}
                    height={120}
                    className="rounded-full border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-blue-500 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full cursor-pointer">
                  <input
                    type="file"
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
              <div className="flex-1 space-y-4">
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">ID</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  >
                    <option value="Master Admin">Master Admin</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="text-right space-x-4">
              <button
                onClick={handleCancel}
                className="mt-10 py-2 px-6 text-sm text-white bg-gray-500 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`mt-10 py-2 px-6 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
