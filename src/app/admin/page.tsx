"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../component/sidebar";
import UserCard from "../component/admincard";
import Image from "next/image";


interface User {
  id: number;
  name: string;
  role: string;
  picture: string;
}

const LoadingComponent = () => (
  <div className="flex items-center justify-center h-screen text-lg text-gray-600">Loading...</div>
);

const ErrorComponent = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-screen text-red-600">{message}</div>
);

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const router = useRouter();
  const [adminData, setadminData] = useState({
    roles: "",
    id: ""
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to continue.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/admin/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });

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

  useEffect(() => {
    const fetchadminData = async () => {
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
          const {roles, id } = result.data;
        
          const roleNameMatch = roles.match(/name=ROLE_(.+)\)/);
          const roleName = roleNameMatch ? roleNameMatch[1] : "Unknown Role";
        
          setadminData({ roles: roleName, id });
        } else {
          console.error("Error in API response:", result.statusMessage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchadminData();
  }, []);


  const handleDeleteClick = (id: number, name: string) => {
    setSelectedUserId(id);
    setSelectedUserName(name);
    setShowConfirmPopup(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId !== null) {
      const token = localStorage.getItem("token");
  
      if (!token) {
        setError("Please log in to continue.");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:8080/api/admin/${selectedUserId}/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete the admin");
        }
  
        const data = await response.json();
        if (data.status === "success") {
          setUsers(users.filter((user) => user.id !== selectedUserId));
          setShowConfirmPopup(false);
        } else {
          throw new Error("Failed to delete the admin");
        }
      } catch (err: any) {
        setError(err.message); 
      }
    }
  };
  

  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
  };

  const handleCardClick = (id: number) => {
    router.push(`/admin/adminprofile/${id}`);
  };

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error} />;

  return (
    <div className="bg-[#dee3f6] flex h-screen text-black overflow-auto">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full">
        <div className="bg-white p-6 shadow-md">
        <div className="flex items-center justify-between mx-auto w-[90%]">
          <div className="text-3xl font-bold">ADMIN MANAGEMENT</div>
          {adminData.roles === "master Admin" && (
            <Link href="/admin/add" className="text-blue-600 flex items-center" id="add_admin">
              <Image src="/Addbtn.png" alt="Add Admin" width={30} height={30} className="mr-2" />
              <span className="translate-y-1">Add Admin</span>
            </Link>
          )}
        </div>
          <div className="w-[90%] mx-auto pt-4">
            <table className="w-full text-left border-collapse pt-10 translate-y-8">
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
          <div className="grid grid-cols-1 gap-4" >
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={() => handleDeleteClick(user.id, user.name)}
                onClick={() => handleCardClick(user.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Delete Popup */}
      {showConfirmPopup && selectedUserName && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] text-left transition-transform transform scale-100">
            <div className="text-lg mb-4">Confirm to delete Admin Name: {selectedUserName}</div>
            <div className="flex justify-between">
              <button
                onClick={handleCancelDelete}
                id="canceldeleteadmin"
                className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                id="confirmdeleteadmin"
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
