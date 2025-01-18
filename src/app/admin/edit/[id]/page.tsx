"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { uploadImage } from "../../../component/imageUpload";

export default function AdminProfile() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params?.id);

  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "",
    picture: null as string | File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();

        // Populate form data with fetched user information
        setFormData({
          fullName: data.fullName,
          role: data.role,
          picture: data.picture,
          password: "",
          confirmPassword: "",
        });

        setImagePreview(data.picture || null);
      } catch (error: any) {
        setError(error.message || "An unexpected error occurred.");
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));

      try {
        setLoading(true);
        const publicURL = await uploadImage(file);
        setFormData({ ...formData, picture: publicURL });
      } catch (error) {
        console.error(error);
        setError("ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองอีกครั้ง");
      } finally {
        setLoading(false);
      }
    } else {
      setError("โปรดเลือกไฟล์รูปภาพที่ถูกต้อง");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authorized. Please log in.");
      return router.push("/login");
    }
  
    setLoading(true);
    setError("");
  
    try {
      const payload: Record<string, any> = {};
      // เตรียมข้อมูลที่ต้องการอัพเดต
      if (formData.fullName) payload.fullName = formData.fullName;
      if (formData.password) payload.password = formData.password;
      if (formData.role) payload.role = formData.role;
      if (formData.picture instanceof File) {
        payload.picture = await uploadImage(formData.picture);
      }
  
      const response = await fetch(`http://localhost:8080/api/admin/${userId}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        // ถ้า response ไม่ OK ให้โยนข้อผิดพลาด
        throw new Error("Failed to update admin profile.");
      }
  
      // ใช้ .text() แทน .json() เพื่อ handle กรณีที่ response ไม่มีข้อมูล
      const text = await response.text();
      const data = text ? JSON.parse(text) : {}; // ป้องกันกรณีไม่มี JSON ใน response
  
      // ตรวจสอบว่า data มี status หรือไม่
      if (data.status === "success") {
        console.log("Success:", data);
        // ทำการเปลี่ยนเส้นทางไปยังหน้าที่ต้องการ
        router.push(`/admin/adminprofile/${userId}`);
      } else {
        setError(data.message || "An error occurred while updating the profile.");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCancel = () => {
    router.back();
  };

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
