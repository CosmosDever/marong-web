"use client";

import React from "react";

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
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(user.id);
          }}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
