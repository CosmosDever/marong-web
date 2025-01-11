'use client';
import React, { useState, useEffect } from "react";
import Sidebar from "../component/sidebar";
import admin from "../assets/admin.png";

const mockupUser = [
    { id: 1, username: "admin", name: "macus", role: "Master Admin", picture: admin },
    { id: 2, username: "admin2", name: "boss", role: "Admin", picture: admin },
    { id: 3, username: "admin3", name: "adam", role: "Admin", picture: admin },
];

interface User {
    id: number;
    username: string;
    name: string;
    role: string;
    picture: any;
}

export default function Page() {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        setUsers(mockupUser);
    }, []);

    const handleDelete = (id: number) => {
        setUsers(users.filter((user) => user.id !== id));
        setIsModalOpen(false);
    };

    const openModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="flex h-screen text-black">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
                
                {/* Headings */}
                <div className="grid grid-cols-12 gap-4 items-center text-center mb-4 font-bold text-gray-700">
                    <div className="col-span-2">Picture</div>
                    <div className="col-span-3">Username</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Actions</div>
                </div>

                {/* User Cards */}
                {users.map((user) => (
                    <div key={user.id} className="grid grid-cols-12 gap-4 items-center bg-white p-4 rounded-lg shadow mb-4">
                        <div className="col-span-2 flex justify-center">
                            <img
                                src={user.picture}
                                alt="User"
                                className="w-16 h-16 rounded-full border-2 border-blue-500"
                            />
                        </div>
                        <div className="col-span-3 text-center">{user.username}</div>
                        <div className="col-span-3 text-center">{user.name}</div>
                        <div className="col-span-2 text-center">{user.role}</div>
                        <div className="col-span-2 flex justify-center space-x-4">
                            <button
                                onClick={() => console.log(`Edit user: ${user.id}`)}
                                className="text-blue-500 hover:underline"
                            >
                                <i className="fa fa-pencil"></i>
                            </button>
                            <button
                                onClick={() => openModal(user)}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {isModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                            <h2 className="text-lg font-bold mb-4">Confirm to delete</h2>
                            <p className="mb-6">Are you sure you want to delete Admin <strong>{selectedUser.username}</strong>?</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedUser.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
