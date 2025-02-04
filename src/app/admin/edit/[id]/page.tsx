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
  const [adminData, setAdminData] = useState({
    roles: "",
    id: ""
  });

  const [formData, setFormData] = useState({
    firstname: "",
    surname: "",
    password: "",
    confirmPassword: "",
    role: "",
    picture: "" as string | File
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:8080/api/userdata/token/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user data:", response.statusText);
          return;
        }

        const result = await response.json();

        if (result.statusCode === "200") {
          const { roles, id } = result.data;
          const roleNameMatch = roles.match(/name=ROLE_(.+)\)/);
          const roleName = roleNameMatch ? roleNameMatch[1] : "Unknown Role";
          setAdminData({ roles: roleName, id });
        } else {
          console.error("Error in API response:", result.statusMessage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, picture: file as File }));
      setError("");
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
  
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      setLoading(false);
      return;
    }
  
    try {
      // 📌 ดึงข้อมูล Admin ปัจจุบัน
      const response = await fetch(`http://localhost:8080/api/admin/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch current admin data.");
      }
  
      const currentData = await response.json();
  
      let oldFullName = currentData?.data?.fullName || "";
      let [oldFirstName, oldSurname] = oldFullName.split(" ");
  
      let newFirstName = formData.firstname || oldFirstName;
      let newSurname = formData.surname || oldSurname;
  
      let updatedFullName = `${newFirstName} ${newSurname}`.trim();
  
      let imageUrl = "";
      if (typeof formData.picture !== "string" && formData.picture) {
        try {
          imageUrl = await uploadImage(formData.picture);
        } catch (uploadError) {
          setError("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
      }
  
      // 📌 สร้าง payload โดยส่งเฉพาะค่าที่เปลี่ยนแปลง
      const payload: Record<string, any> = {};
      
      if (updatedFullName !== oldFullName) {
        payload.fullName = updatedFullName;
      }
      if (formData.password) {
        payload.password = formData.password;
      }
      if (imageUrl) {
        payload.picture = imageUrl;
      }
      if (adminData.roles === "master Admin" && formData.role) {
        payload.role = formData.role;
      }
  
      if (Object.keys(payload).length === 0) {
        setError("No changes detected.");
        setLoading(false);
        return;
      }
  
      console.log("Payload:", payload);
  
      const updateResponse = await fetch(`http://localhost:8080/api/admin/${userId}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!updateResponse.ok) {
        throw new Error("Failed to update admin profile.");
      }
  
      const data = await updateResponse.json();
      if (data.status === "success") {
        router.back();
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
                  <img
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
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                    />
                  </div>
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
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    disabled={adminData.roles !== "master Admin"}
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="master Admin">Master Admin</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {adminData.roles !== "master Admin" && (
                    <p className="text-gray-500 text-sm">Only Master Admin can update roles.</p>
                  )}
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
                className={`mt-10 py-2 px-6 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
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
