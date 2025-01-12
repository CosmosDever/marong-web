"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [gmail, setGmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const router = useRouter();

    const setToken = (token: string): void => {
        localStorage.setItem("token", token);
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gmail, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await response.json();
            const token: string = data.data.token[0];
            setToken(token);
            router.push("/overview");
        } catch (error: any) {
            setErrorMessage(error.message || "An error occurred. Please try again.");
        }
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
                            id="gmail"
                            placeholder=" "
                            value={gmail}
                            onChange={(e) => setGmail(e.target.value)}
                        />
                        <label
                            htmlFor="gmail"
                            className="absolute text-black font-medium text-sm left-3 top-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal"
                        >
                            Gmail
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
