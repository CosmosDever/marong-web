"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../assets/logo.png";

export default function LoginPage() {
    const [gmail, setGmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [adminData, setadminData] = useState({
        roles: ""
      });
    const router = useRouter();

    const setToken = (token: string): void => {
        localStorage.setItem("token", token);
    };

    const extractToken = (data: any): string | null => {
        if (data?.message?.token && Array.isArray(data.message.token) && data.message.token.length > 0) {
            return data.message.token[0];
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setErrorMessage("");
    
        if (!gmail && !password) {
            setErrorMessage("Please enter gmail and password");
            return;
        } else if (!gmail) {
            setErrorMessage("Please enter gmail");
            return;
        } else if (!password) {
            setErrorMessage("Please enter password");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gmail, password }),
            });
    
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Invalid gmail or password");
                } else {
                    throw new Error("An error occurred while logging in.");
                }
            }
    
            const data = await response.json();
            const token = extractToken(data);
            if (token) {
                setToken(token);
    
                const userResponse = await fetch(`http://localhost:8080/api/userdata/token/${token}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
    
                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user roles");
                }
    
                const userData = await userResponse.json();
                if (userData.statusCode === "200") {
                    const { roles } = userData.data;
                    const roleNameMatch = roles.match(/name=ROLE_(.+)\)/);
                    const roleName = roleNameMatch ? roleNameMatch[1] : "Unknown Role";
    
                    if (roleName === "User") {
                        setErrorMessage("คุณไม่มีสิทธิ์เข้าใช้งานระบบ");
                        return;
                    }
                    router.push("/overview");
                } else {
                    throw new Error("Error fetching roles");
                }
            } else {
                throw new Error("Unexpected API response structure");
            }
        } catch (error: any) {
            setErrorMessage(error.message || "An error occurred. Please try again.");
        }
    };
    ;
    
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="w-96 p-6 bg-gray-100 shadow-lg rounded-lg">
                <div className="flex justify-center">
                    <Image src={logo} alt="logo" width={240} />
                </div>
                <h1 className="text-2xl font-bold text-black text-center mb-4">Login</h1>
                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="relative my-4">
                        <input
                            className="peer block w-full px-3 pt-5 pb-2 bg-blue-100 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            type="text"
                            id="login_gmailBox"
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
                            id="login_passwordBox"
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
                        id="loginButton"
                        className="w-full bg-blue-500 hover:bg-blue-700 p-2 text-white rounded-lg mt-4"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}