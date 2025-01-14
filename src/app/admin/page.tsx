"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../component/sidebar";
import UserCard from "../component/admincard"; // Import UserCard ที่แยกออกมา
import Image from "next/image";

interface User {
  id: number;
  name: string;
  role: string;
  picture: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/all");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.status === "success") {
          const formattedUsers = data.data.map((user: any) => ({
            id: user.id,
            name: user.fullName,
            role: user.role.replace("ROLE_", ""),
            picture: user.picture,
          }));
          setUsers(formattedUsers);
        } else {
          throw new Error("Failed to load users");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteClick = (id: number, name: string) => {
    setSelectedUserId(id);
    setSelectedUserName(name);
    setShowConfirmPopup(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId !== null) {
      setUsers(users.filter((user) => user.id !== selectedUserId));
    }
    setShowConfirmPopup(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
  };

  const handleCardClick = (id: number) => {
    router.push(`/admin/adminprofile/${id}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="bg-blue-100 flex h-screen text-black overflow-auto">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full">
        <div className="bg-white p-6 shadow-md">
          <div className="flex items-center justify-between mx-auto w-[90%]">
            <div className="text-3xl font-bold">ADMIN MANAGEMENT</div>
            <a href="/admin/add" className="text-blue-600 flex items-center">
              <Image src="/Addbtn.png" alt="Add Admin" width={30} height={30} className="mr-2" />
              <span className="translate-y-1">Add Admin</span>
            </a>
          </div>
        </div>

        {/* Card Container */}
        <div className="mt-4 w-[90%] mx-auto h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={() => handleDeleteClick(user.id, user.name)} // ปรับให้ส่งชื่อผู้ใช้
                onClick={() => handleCardClick(user.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Delete Popup */}
      {showConfirmPopup && selectedUserName && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] text-center">
            <div className="text-lg mb-4">Confirm to delete Admin Name: {selectedUserName}</div>
            <div className="flex justify-between">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
