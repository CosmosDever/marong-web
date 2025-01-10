'use client';
import React, { useState, useEffect } from "react";
import Sidebar from "../component/sidebar";
import AdminCard from "../component/AdminCard";
import admin from "../assets/admin.png";

const mockupUser = [
    { id: 1, username: "admin", name: "macus", role: "master admin", picture: admin },
    { id: 2, username: "admin2", name: "boss", role: "admin", picture: admin },
    { id: 3, username: "admin3", name: "adam", role: "admin", picture: admin },
];

export default function Page() {
    interface User {
        id: number;
        username: string;
        name: string;
        role: string;
        picture: string;
    }

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        setUsers(mockupUser);
    }, []);

    return (
        <div className="flex h-screen text-black">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
                {users.map((user) => (
                    <AdminCard
                        key={user.id}
                        picture={user.picture}
                        username={user.username}
                        name={user.name}
                        role={user.role}
                        onEdit={() => console.log(`Edit user: ${user.id}`)}
                        onDelete={() => console.log(`Delete user: ${user.id}`)}
                    />
                ))}
            </div>
        </div>
    );
}
