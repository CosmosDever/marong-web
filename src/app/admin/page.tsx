'use client'
import React, { useState, useEffect } from "react";

const mockUser = [
    {
        id: 1,
        username: "admin",
        name: "macus",
        role: "master admin",
    },
    {
        id: 2,
        username: "admin2",
        name: "boss",
        role: "admin",
    },
    {
        id: 3,
        username: "admin3",
        name: "adam",
        role: "admin",
    },
];

export default function alladmin() {
    interface User {
        id: number;
        username: string;
        name: string;
        role: string;
    }
    
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        setUsers(mockUser);
    }, []);

    return (
        <div>
            <h1>All Admins</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <p>{user.name}</p>
                        <p>{user.username}</p>
                        <p>{user.role}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

