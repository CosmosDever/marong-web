'use client';
import React, { useState, useEffect } from "react";
import Sidebar from "../component/sidebar";
import admin from "../assets/admin.png";
import Link from "next/link";

const mockupUser = [
    { id: 1, username: "admin", name: "macus", role: "Master Admin", picture: admin },
    { id: 2, username: "admin2", name: "boss", role: "Admin", picture: admin },
    { id: 3, username: "admin3", name: "adam", role: "Admin", picture: admin },
];

export default function Page() {
    interface User {
        id: number;
        username: string;
        name: string;
        role: string;
        picture: any;
    }

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        setUsers(mockupUser);
    }, []);

    return (
        <div className="flex h-screen text-black">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Admin Management</h1>
                    <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
                        <span className="mr-2">+ New Admin</span>
                    </button>
                </div>
                <table className="w-full bg-white shadow-md rounded overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3">Picture</th>
                            <th className="text-left px-6 py-3">Username</th>
                            <th className="text-left px-6 py-3">Name</th>
                            <th className="text-left px-6 py-3">Role</th>
                            <th className="text-left px-6 py-3">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="px-6 py-3">
                                    <img
                                        src={user.picture}
                                        alt="User"
                                        className="w-12 h-12 rounded-full border-2 border-blue-500"
                                    />
                                </td>
                                <td className="px-6 py-3">{user.username}</td>
                                <td className="px-6 py-3">{user.name}</td>
                                <td className="px-6 py-3">{user.role}</td>
                                <td className="px-6 py-3">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => history.push(`/admin/edit/${user.id}`)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            <i className="fa fa-pencil"></i>
                                        </button>
                                        <button
                                            onClick={() => console.log(`Delete user: ${user.id}`)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
