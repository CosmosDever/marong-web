"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../component/Sidebar";
import Image from "next/image";
import admin from "../../../assets/admin.png";

const mockupUser = [
  { id: 1, email:"admin@gmail.com", name: "macus", role: "Master Admin", picture: admin },
  { id: 2, email:"admin@gmail.com", name: "boss", role: "Admin", picture: admin },
  { id: 3, email:"admin@gmail.com", name: "adam", role: "Admin", picture: admin },
  { id: 4, email:"admin@gmail.com", name: "eva", role: "Admin", picture: admin },
  { id: 5, email:"admin@gmail.com", name: "john", role: "Admin", picture: admin },
];

export default function AdminProfile() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params?.id);

  const user = mockupUser.find((user) => user.id === userId);

  const handleCardClick = (id: number) => {
    router.push(`/admin/edit/${id}`);
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
        <div className="text-3xl font-bold mb-6">ADMIN PROFILE</div>
        <div className="flex justify-center items-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-[90%] h-[90%] flex-col">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 mr-6">
                <Image
                  src={user.picture}
                  alt="Admin"
                  width={120}
                  height={120}
                  className="rounded-full border-2 border-blue-500"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <p className="w-full border border-gray-300 rounded-md px-4 py-2">
                    {user.name || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                 <p className="w-full border border-gray-300 rounded-md px-4 py-2">
                    {user.email || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Role</label>
                  <p className="w-full border border-gray-300 rounded-md px-4 py-2 ">
                    {user.role || "Not Available"}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={() => handleCardClick(user.id)}
                className=" mt-10 py-2 px-6 text-sm text-white bg-blue-500 hover:bg-blue-700 rounded-lg" 
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
