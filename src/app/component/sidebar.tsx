"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assets/logo.png";
import Admin from "../assets/admin.png";
import Case from "../assets/case.png";
import News from "../assets/news.png";
import AdminManagement from "../assets/admin-management.png";
import Overview from "../assets/overview.png";

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 h-screen bg-white text-black">
      <Link href="/overview" className="p-6 text-center">
        <Image src={Logo} alt="logo"/>
      </Link>
      <nav className="flex flex-col mt-4">
        <Link href="/overview" className="flex items-center px-6 py-3 text-sm hover:bg-blue-100 ">
          <Image src={Overview} alt="Overview" className="mr-3"/> Overview
        </Link>
        <Link href="/case" className="flex items-center px-6 py-3 text-sm hover:bg-blue-100">
            <Image src={Case} alt="Case" className="mr-3"/> Case
        </Link>
        <Link href="/news" className="flex items-center px-6 py-3 text-sm hover:bg-blue-100">
            <Image src={News} alt="News" className="mr-3"/> News
        </Link>
        <Link href="/admin" className="flex items-center px-6 py-3 text-sm hover:bg-blue-100">
            <Image src={AdminManagement} alt="Adminmanage" className="mr-3"/> Admin management
        </Link>
      </nav>
      <div className="mt-auto text-center ">
        <div className="flex items-center space-x-3 hover:bg-blue-100">
          <Image src={Admin} alt="admin" width={50} height={50} className="rounded-full" />
          <div>
            <p className="text-sm font-medium">Admin name</p>
            <p className="text-xs text-gray-400">Role</p>
          </div>
        </div>
        <button
          className="mt-6 w-full py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-100"
          onClick={() => alert("Logged out")}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
