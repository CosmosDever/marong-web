"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const mockUser = {
    username: "admin",
    password: "admin",
};

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const setToken = (token: string) => {
        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour
        localStorage.setItem("token", token);
        localStorage.setItem("token_expiration", expirationTime.toString());
    };

    const refreshToken = () => {
        const token = localStorage.getItem("token");
        const expirationTime = localStorage.getItem("token_expiration");

        if (token && expirationTime) {
            const currentTime = new Date().getTime();
            if (currentTime > parseInt(expirationTime)) {
                localStorage.removeItem("token");
                localStorage.removeItem("token_expiration");
                alert("Session expired. Please login again.");
                router.push("/login");
            } else {
                // Extend the token expiration time
                const newExpirationTime = currentTime + 60 * 60 * 1000;
                localStorage.setItem("token_expiration", newExpirationTime.toString());
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(refreshToken, 5 * 60 * 1000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        // Mock login logic
        if (username === mockUser.username && password === mockUser.password) {
            console.log("Login successful");
            setToken("mocked-jwt-token");
            router.push("/admin"); // Navigate to another page after login
        } else {
            setErrorMessage("Invalid username or password");
        }

        // Example API call for future use
        /*
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();
            setToken(data.token); // Assume token is returned in the response
            router.push("/admin");
        } catch (error) {
            console.error(error);
            setErrorMessage("Login failed. Please try again.");
        }
        */
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="w-96 p-6 bg-gray-100 shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-black text-center mb-4">Login</h1>
                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="relative my-4">
                        <input
                            className="peer block w-full px-3 pt-5 pb-2 bg-blue-100 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            type="text"
                            id="username"
                            placeholder=" "
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label
                            htmlFor="username"
                            className="absolute text-black font-medium text-sm left-3 top-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal"
                        >
                            Username
                        </label>
                    </div>

                    <div className="relative my-4">
                        <input
                            className="peer block w-full px-3 pt-5 pb-2 bg-blue-100 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            type="password"
                            id="password"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label
                            htmlFor="password"
                            className="absolute text-black font-medium text-sm left-3 top-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal"
                        >
                            Password
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 p-2 text-white rounded-lg mt-4"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
