"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../component/sidebar";
import Image from "next/image";
import admin from "../assets/admin.png";

const mockupUser: any = [
    { id: 1, name: "macus", role: "Master Admin", picture: admin },
    { id: 2, name: "boss", role: "Admin", picture: admin },
    { id: 3, name: "adam", role: "Admin", picture: admin },
    { id: 4, name: "eva", role: "Admin", picture: admin },
    { id: 5, name: "john", role: "Admin", picture: admin },
  ];
  

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  picture: any;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    setUsers(mockupUser);
  }, []);

  const handleDeleteClick = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleCardClick = (id: number) => {
    router.push(`/admin/adminprofile/${id}`);
  };

  return (
    <div className="bg-blue-100 flex h-screen text-black overflow-auto">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full">
        <div className="bg-white p-6 shadow-md">
          <div className="flex items-center justify-between mx-auto w-[90%]">
            <div className="text-3xl font-bold">ADMIN MANAGEMENT</div>
            <a href="/admin/add" className="text-blue-600 flex items-center">
                <Image src="/Addbtn.png" alt="Add News" width={30} height={30} className="mr-2" />
              <span className="translate-y-1">Add Admin</span>
            </a>
          </div>
          <div className="w-[90%] mx-auto top-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="p-2 w-1/4 text-left">
                  <th className="p-2 w-1/4 text-left font-lg">Picture</th>
                  <th className="p-2 w-1/4 text-left">Name</th>
                  <th className="p-2 w-1/8 text-left">Role</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>

        {/* Card Container */}
        <div className="mt-4 w-[90%] mx-auto h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-4 flex items-center rounded-lg shadow-md text-lg hover:bg-blue-200 cursor-pointer"
                onClick={() => handleCardClick(user.id)}
              >
                <div className="w-1/4 text-left">
                  <Image
                    src={user.picture}
                    alt="User"
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="w-1/4 text-left font-medium">{user.name}</div>
                <div className="w-1/4 text-left text-gray-600">{user.role}</div>
                <div className="w-1/8 text-right ml-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(user.id);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
