"use client";

import React,{useState,useEffect} from "react";

interface User {
  id: number;
  name: string;
  role: string;
  picture: string; // ให้แน่ใจว่าเป็น URL หรือ Path ที่ถูกต้อง
}

interface UserCardProps {
  user: User;
  onDelete: (id: number) => void;
  onClick: () => void;
}



const UserCard: React.FC<UserCardProps> = ({ user, onDelete, onClick }) => {

  const [adminData, setadminData] = useState({
    roles: "",
    id: ""
  });

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

  return (
    <div
      className="bg-white p-4 flex items-center rounded-lg shadow-md text-lg hover:bg-blue-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-1/4 text-left">
        {/* ใช้แท็ก <img> แทน */}
        <img
          src={user.picture} // ใช้ picture จากฐานข้อมูล
          alt={user.name}
          width={90}
          height={90}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="w-1/4 text-left font-medium">{user.name}</div>
      <div className="w-1/4 text-left text-gray-600">{user.role}</div>
      <div className="w-1/8 text-right ml-auto">
        {adminData.roles === "master Admin" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(user.id);
            }}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
