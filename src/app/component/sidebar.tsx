"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "../assets/logo.png";
import Admin from "../assets/admin.png";
import Case from "../assets/case.png";
import News from "../assets/news.png";
import AdminManagement from "../assets/admin-management.png";
import Overview from "../assets/overview.png";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: "/overview", label: "Overview", icon: Overview },
    { href: "/case", label: "Case", icon: Case },
    { href: "/news", label: "News", icon: News },
    { href: "/admin", label: "Admin management", icon: AdminManagement },
  ];

  return (
    <div className="flex flex-col w-64 h-screen bg-white text-black">
      <Link href="/overview" className="p-6 text-center">
        <Image src={Logo} alt="logo" />
      </Link>
      <nav className="flex flex-col mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 text-sm ${
              pathname === item.href
                ? "bg-blue-200 text-blue-900 font-semibold"
                : "hover:bg-blue-100"
            }`}
          >
            <Image src={item.icon} alt={item.label} className="mr-3" /> {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto text-center">
        <div className="flex items-center space-x-3 hover:bg-blue-100">
          <Image
            src={Admin}
            alt="admin"
            width={50}
            height={50}
            className="rounded-full"
          />
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
